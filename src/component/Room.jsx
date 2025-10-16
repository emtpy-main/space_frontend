import React, { useEffect, useCallback, useState, useRef } from "react";
import { useSocket } from "../utils/socket";
import { usePeer } from "../utils/Peer";
import Fab from "@mui/material/Fab";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import CallEndIcon from '@mui/icons-material/CallEnd';

const Room = () => {
  const { socket } = useSocket();
  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteAns,
    sendStream,
    remoteStream,
  } = usePeer();

  const [myStream, setMyStream] = useState(null);
  const [remoteEmailId, setRemoteEmailId] = useState(null);

  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const handleNewUserJoined = useCallback(
    async (data) => {
      const { emailId } = data;
      console.log("New User joined room", emailId);
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
      setRemoteEmailId(emailId);
    },
    [createOffer, socket]
  );

  const handleIncomingCall = useCallback(
    async (data) => {
      const { from, offer } = data;
      console.log("Incoming call from ", from, offer);
      const ans = await createAnswer(offer);
      socket.emit("call-accepted", { emailId: from, ans });
      setRemoteEmailId(from);
    },
    [createAnswer, socket]
  );

  const handleCallAccepted = useCallback(
    async (data) => {
      const { ans } = data;
      console.log("Call got accepted", ans);
      await setRemoteAns(ans);
    },
    [setRemoteAns]
  );

  const handleNegotiationNeeded = useCallback(async () => {
    console.log("Negotiation needed");
    const offer = await createOffer();
    socket.emit("call-user", { emailId: remoteEmailId, offer });
  }, [createOffer, remoteEmailId, socket]);

  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);

    peer.addEventListener("negotiationneeded", handleNegotiationNeeded);

    return () => {
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);

      peer.removeEventListener("negotiationneeded", handleNegotiationNeeded);
    };
  }, [
    handleNewUserJoined,
    socket,
    handleIncomingCall,
    handleCallAccepted,
    peer,
    handleNegotiationNeeded,
  ]);
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        setMyStream(stream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }
        sendStream(stream);
      })
      .catch((err) => console.error("Error accessing media:", err));
  }, [sendStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleCallEnded = () => {
    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
    } 
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
    }       
    peer.close();
    socket.disconnect();
    window.location.reload(); 
  };

  return (
   <div className="flex h-screen w-screen flex-col bg-gray-900 p-2 md:p-4">
      
      {/* --- Remote Video Section --- */}
      {/* On medium screens and up, this is a relative container for the draggable video */}
      <div className="relative flex-1 rounded-lg overflow-hidden">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="h-full w-full object-cover"
        />

        {/* --- Draggable Local Video (Picture-in-Picture on DESKTOP) --- */}
        {/* This Draggable component is now HIDDEN on small screens and shown on medium+ */}
        <Draggable nodeRef={draggableNodeRef}>
          <div ref={draggableNodeRef} className="hidden md:block">
             <Paper 
              elevation={4} 
              className="absolute top-4 right-4 w-[25vw] max-w-[220px] min-w-[150px] cursor-move overflow-hidden rounded-lg border-2 border-gray-500"
              style={{ resize: 'both' }} // inline style for resize
            >
              <video
                ref={myVideoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover transform -scale-x-100" // Mirror effect
              />
            </Paper>
          </div>
        </Draggable>
      </div>

      {/* --- Local Video Section (Visible only on MOBILE) --- */}
      {/* This block is only visible on small screens, creating the split-screen effect */}
      <div className="flex-1 rounded-lg overflow-hidden mt-2 md:hidden">
         <video
            ref={myVideoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover transform -scale-x-100"
          />
      </div>

      {/* --- Call Controls Overlay --- */}
      {/* Using fixed positioning to ensure it's always at the bottom over the video */}
      <div className="fixed bottom-0 left-0 flex w-full flex-col items-center p-4 bg-gradient-to-t from-black/60 to-transparent">
        <p className="mb-4 rounded-full bg-black/50 px-4 py-1.5 text-sm text-white">
          Connected to {remoteEmailId}
        </p>
        
        <Fab
          onClick={onEndCall}
          aria-label="end call"
          sx={{
            backgroundColor: '#ff3b30',
            '&:hover': {
              backgroundColor: '#d93128',
            },
          }}
        >
          <CallEndIcon sx={{ color: 'white' }} />
        </Fab>
      </div>
    </div>
  );
};

export default Room;
