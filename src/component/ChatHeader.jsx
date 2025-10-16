import { useEffect, useCallback, useMemo } from "react"; // 1. Added useCallback and useMemo
import { Avatar, IconButton } from "@mui/material";
import { ArrowBack, Videocam, Call, MoreVert } from "@mui/icons-material";
import { useSocket } from "../utils/socket";
import { useNavigate } from "react-router";

const ChatHeader = ({ user, onBack, loginUserId, loginEmail }) => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const roomId = useMemo(
    () => [user._id, loginUserId].sort().join("_"),
    [user._id, loginUserId]
  );

  const email = loginEmail;
  console.log("Login user id in header:", loginUserId);
  console.log("Login email in header:", email);
  console.log("Chatting with user id in header:", user?._id);

  const handleJoinRoom = () => {
    if (socket && email && roomId) {
      socket.emit("join-room", { roomId, emailId: email });
      console.log(`Joining room ${roomId} with email ${email}`);
    }
  };
  const handleJoinRoom_res = useCallback(
   
    ({ roomId }) => {
       console.log("Navigating to room with ID: ", roomId);
      navigate(`/room/${roomId}`);
    },
    [navigate]
  );
  useEffect(() => {
    socket.on("joined-room", handleJoinRoom_res);

    return () => {
      socket.off("joined-room", handleJoinRoom_res);
    };
  }, [handleJoinRoom_res, socket]);

  return (
    <div className="flex items-center justify-between p-3 border-b border-white/10">
      <div className="flex items-center">
        <IconButton
          sx={{ color: "white" }}
          onClick={onBack}
          className="md:hidden"
        >
          <ArrowBack />
        </IconButton>
        <Avatar
          src={user.photoUrl}
          alt={`${user.firstName} ${user.lastName}`}
          sx={{ width: 45, height: 45, ml: { xs: 1, md: 0 } }}
        />
        <h2 className="text-xl font-semibold text-white ml-4">{`${user.firstName} ${user.lastName}`}</h2>
      </div>
      <div>
        <IconButton sx={{ color: "white" }} onClick={handleJoinRoom}>
          <Videocam />
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <Call />
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <MoreVert />
        </IconButton>
      </div>
    </div>
  );
};

export default ChatHeader;
