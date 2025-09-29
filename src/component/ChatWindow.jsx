import {
  ArrowBack,
  Call,
  Mood,
  MoreVert,
  Send,
  Videocam,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";

import { useEffect, useRef, useState } from "react";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";

const MessageInput = ({ onSendMessage }) => {
  const [text, setText] = useState("");
  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText("");
    }
  };
  return (
    <div className="p-4 border-t border-white/10">
      <Box
        component="form"
        sx={{ display: "flex", alignItems: "center" }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <IconButton sx={{ color: "white" }}>
          <Mood />
        </IconButton>
        <TextField
          fullWidth
          placeholder="Type a message..."
          variant="outlined"
          size="small"
          sx={{ mx: 1 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <IconButton
          type="submit"
          sx={{
            color: "white",
            bgcolor: "#5f36a0",
            "&:hover": { bgcolor: "#2c1857" },
          }}
        >
          <Send />
        </IconButton>
      </Box>
    </div>
  );
};

const ChatHeader = ({ user, onBack }) => (
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
      <IconButton sx={{ color: "white" }}>
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

const ChatWindow = ({
  user,
  isVisible,
  onBack,
  messages,
  onSendMessage,
  isLoading,
}) => {
  const glassStyle =
    "bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl rounded-2xl";
  const messagesEndRef = useRef(null);
  const fromUser = useSelector((store) => store.user?._id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages, isLoading]); 

  useEffect(() => { 

    if (user) {
      const socket = createSocketConnection();
      socket.on("connect", () => {
        console.log(
          "Successfully connected to server with socket ID:",
          socket.id
        );
        socket.emit("joinRoom", { fromUser, toUser: user._id });
      }); 
      return () => {
        socket.disconnect();
      };
    } 
  }, [user, fromUser]);
 
  if (!user) {
    return (
      <div
        className={`w-3/4 h-full p-4 hidden md:flex flex-col items-center justify-center text-center ${glassStyle}`}
      >
        <img
          src="https://www.gstatic.com/dynamite/images/hub/ic_empty_chat_dark.svg"
          alt="Select a chat"
          className="w-48 h-48 mb-4"
        />
        <h2 className="text-2xl text-white">Select a chat</h2>
        <p className="text-gray-300">Start a conversation.</p>
      </div>
    );
  }
 
  return (
    <div
      className={`w-full md:w-3/4 h-full flex flex-col ${glassStyle} absolute md:relative inset-0 transform transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-x-0" : "translate-x-full"
      } md:translate-x-0 z-10`}
    >
      <ChatHeader user={user} onBack={onBack} />
      <div
        className="flex-grow p-4 overflow-y-auto space-y-4"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.2,
        }}
      >
        {messages.map((msg, index) => (
          // Assuming MessageBubble is defined and imported elsewhere
          <MessageBubble key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <CircularProgress size={24} sx={{ color: "white" }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatWindow;