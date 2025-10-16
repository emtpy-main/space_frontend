import React, { useEffect, useCallback, useState, useRef } from "react";
import { useSocket } from "../utils/socket";
import { usePeer } from "../utils/Peer";
import Paper from "@mui/material/Paper";
import Fab from "@mui/material/Fab";
import CallEndIcon from "@mui/icons-material/CallEnd";
import { useNavigate } from "react-router";
// NOTE: removed unused imports (Draggable, VideoCallUI) because we use manual drag

const Room = () => {
  const { socket } = useSocket();
  const { peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream } = usePeer();

  const navigate = useNavigate();

  // streams + ids
  const [myStream, setMyStream] = useState(null);
  const [remoteEmailId, setRemoteEmailId] = useState(null);

  // refs
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localWrapperRef = useRef(null);

  // drag state
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStartRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  /* ------------------------
     Drag handlers (mouse + touch)
     ------------------------ */
  const handleDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
    const dx = clientX - dragStartRef.current.startX;
    const dy = clientY - dragStartRef.current.startY;
    setPosition({
      x: dragStartRef.current.initialX + dx,
      y: dragStartRef.current.initialY + dy,
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleDragMove, { passive: false });
      window.addEventListener("touchend", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging]);

  /* ------------------------
     Socket & Peer event handlers
     ------------------------ */
  const handleNewUserJoined = useCallback(
    async (data) => {
      const { emailId } = data;
      console.log("New user joined:", emailId);
      try {
        const offer = await createOffer();
        socket.emit("call-user", { emailId, offer });
        setRemoteEmailId(emailId);
      } catch (err) {
        console.error("Error creating/sending offer:", err);
      }
    },
    [createOffer, socket]
  );

  const handleIncomingCall = useCallback(
    async (data) => {
      const { from, offer } = data;
      console.log("Incoming call from:", from);
      try {
        const ans = await createAnswer(offer);
        socket.emit("call-accepted", { emailId: from, ans });
        setRemoteEmailId(from);
      } catch (err) {
        console.error("Error answering call:", err);
      }
    },
    [createAnswer, socket]
  );

  const handleCallAccepted = useCallback(
    async (data) => {
      const { ans } = data;
      console.log("Call accepted, setting remote answer");
      try {
        await setRemoteAns(ans);
      } catch (err) {
        console.error("Error setting remote answer:", err);
      }
    },
    [setRemoteAns]
  );

  const handleCallEndedRemote = useCallback(
    (data) => {
      console.log("Remote ended the call", data);
      // Remote ended — ensure local cleanup and navigate back
      cleanupAndLeave();
    },
    [] // cleanupAndLeave defined later; we'll call it directly in the function body to keep order
  );

  const handleNegotiationNeeded = useCallback(async () => {
    if (!remoteEmailId) return;
    try {
      const offer = await createOffer();
      socket.emit("call-user", { emailId: remoteEmailId, offer });
    } catch (err) {
      console.warn("Negotiation needed failed:", err);
    }
  }, [createOffer, remoteEmailId, socket]);

  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("call-ended", handleCallEndedRemote);
    peer.addEventListener("negotiationneeded", handleNegotiationNeeded);

    return () => {
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("call-ended", handleCallEndedRemote);
      peer.removeEventListener("negotiationneeded", handleNegotiationNeeded);
    };
  }, [
    socket,
    peer,
    handleNewUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleCallEndedRemote,
    handleNegotiationNeeded,
  ]);

  /* ------------------------
     Media setup & attaching to <video>
     ------------------------ */
  useEffect(() => {
    let mounted = true;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (!mounted) return;
        setMyStream(stream);
        sendStream(stream); // add tracks to peer
        if (myVideoRef.current) myVideoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error("getUserMedia error:", err);
      });

    return () => {
      mounted = false;
    };
  }, [sendStream]);

  // attach remote stream to remote <video>
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // ensure local video ref updates when stream changes or element mounts
  useEffect(() => {
    if (myStream && myVideoRef.current) {
      myVideoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  /* ------------------------
     Cleanup logic
     ------------------------ */
  const cleanupMedia = useCallback(() => {
    try {
      if (myStream) myStream.getTracks().forEach((t) => t.stop());
    } catch (e) {
      console.warn("Error stopping local tracks:", e);
    }
    try {
      if (remoteStream) remoteStream.getTracks().forEach((t) => t.stop());
    } catch (e) {
      console.warn("Error stopping remote tracks:", e);
    }
    try {
      if (peer && peer.signalingState !== "closed") peer.close();
    } catch (e) {
      console.warn("Error closing peer:", e);
    }
    // clear video elements' srcObject
    try {
      if (myVideoRef.current) myVideoRef.current.srcObject = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    } catch (e) {
      /* ignore */
    }
  }, [myStream, remoteStream, peer]);

  const cleanupAndLeave = useCallback(() => {
    cleanupMedia();
    // remove important socket listeners if needed
    try {
      socket.off("incoming-call");
      socket.off("user-joined");
      socket.off("call-accepted");
      socket.off("call-ended");
    } catch (e) {
      // ignore
    } 
    navigate("/chat", { replace: true });
    window.location.reload(); 
  }, [cleanupMedia, socket, navigate]);

  /* ------------------------
     End call (local action)
     ------------------------ */
  const onEndCall = useCallback(() => {
    console.log("Local user ended call");
    // notify remote first (best-effort)
    if (socket && remoteEmailId) {
      try {
        socket.emit("call-ended", { emailId: remoteEmailId });
      } catch (e) {
        console.warn("emit call-ended failed:", e);
      }
    }
    cleanupAndLeave();
  }, [socket, remoteEmailId, cleanupAndLeave]);

  /* ------------------------
     JSX
     ------------------------ */
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-900 text-white">
      {/* Full-screen remote video (cover) */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        muted={false}
        className="absolute inset-0 h-full w-full object-cover bg-black"
      />

      {/* Top-center status */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 rounded-full bg-black/30 px-4 py-2 text-sm text-slate-300 backdrop-blur-sm">
        <span>
          You are connected to{" "}
          <strong className="text-white">{remoteEmailId || "..."}</strong>
        </span>
      </div>
 
      <div
        ref={localWrapperRef}
        className="absolute z-30 w-48 md:w-64 cursor-move touch-none overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          bottom: 20,
          right: 20,
          touchAction: "none",
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div className="aspect-video w-full">
          <video
            ref={myVideoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute top-2 left-2 text-xs font-semibold text-slate-300">
          My Video
        </div>
      </div> 
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40">
        <Fab
          onClick={onEndCall}
          aria-label="End Call"
          sx={{
            backgroundColor: "#ff3b30",
            "&:hover": { backgroundColor: "#d93128" },
          }}
        >
          <CallEndIcon sx={{ color: "white" }} />
        </Fab>
      </div>
    </div>
  );
};

export default Room;
