import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";

import {
  ArrowBack,
  Call,
  Mood,
  MoreVert,
  Send,
  Videocam,
  Home,
  Search,
} from "@mui/icons-material";
import ChatHeader from './ChatHeader.jsx'
const glassStyle =
  "bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl rounded-2xl";

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
 

 
const MessageBubble = ({ message, loginUserId }) => {
  const isSentByUser = message.senderId === loginUserId;
 
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";

    const messageDate = new Date(timestamp); 

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        month: 'short', // "Feb"
        day: '2-digit',   // "14"
        year: '2-digit',  // "23"
    });
 
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }); 
    const datePart = dateFormatter.format(messageDate).replace(/ /g, '-').replace(',', ''); // "Feb-14-23"
    const timePart = timeFormatter.format(messageDate).toLowerCase(); // "1:50 pm"

    return `On ${datePart} at ${timePart}`;
  };

  const time = formatTimestamp(message.createdAt);

  return (
    <div className={`flex items-end ${isSentByUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isSentByUser ? "bg-[#2c1857] text-white rounded-br-none" : "bg-[#412B6B] text-white rounded-bl-none"}`}>
        <p className="text-base break-words">{message.content}</p> 
        {time && (
          <div className={`text-xs mt-1 ${isSentByUser ? 'text-gray-400' : 'text-gray-500'} text-right`}>
            {time}
          </div>
        )}
      </div>
    </div>
  );
};
 
const ContactItem = ({ contact, onClick, selected }) => (
  <div
    onClick={onClick}
    className={`flex items-center p-3 cursor-pointer transition-all duration-300 rounded-xl ${
      selected ? "bg-[#5f36a0]/50" : "hover:bg-white/10"
    }`}
  >
    <Avatar
      src={contact.photoUrl}
      alt={`${contact.firstName} ${contact.lastName}`}
      sx={{ width: 50, height: 50 }}
    />
    <div className="flex-grow ml-4 overflow-hidden">
      <h3 className="font-semibold text-white truncate">{`${contact.firstName} ${contact.lastName}`}</h3>
      <p className="text-sm text-gray-300 truncate">{contact?.lastMessage}</p>
    </div>
  </div>
);
 
export const ContactList = ({
  contacts,
  onSelectContact,
  selectedContactId,
  isVisible,
}) => (
  <div
    className={`w-full md:w-1/4 h-full p-4 flex flex-col ${glassStyle} absolute md:relative inset-0 transform transition-transform duration-300 ease-in-out ${
      isVisible ? "translate-x-0" : "-translate-x-full"
    } md:translate-x-0 z-20`}
  >
    <div className="flex items-center gap-3 mb-4">
      <Link to="/">
        <Home
          className="text-white cursor-pointer hover:text-gray-300"
          fontSize="large"
        />
      </Link>
      <h1 className="text-3xl font-bold text-white">Chats</h1>
    </div>

    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search chats..."
        className="w-full bg-black/20 text-white placeholder-gray-400 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#5f36a0]"
      />
    </div>

    <div className="flex-grow overflow-y-auto pr-2 space-y-2">
      {contacts.map((contact) => (
        <ContactItem
          key={contact._id}
          contact={contact}
          onClick={() => onSelectContact(contact)}
          selected={contact._id === selectedContactId}
        />
      ))}
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
  loginUserId,
  loginEmail,
}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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
      <ChatHeader user={user} onBack={onBack}  loginUserId = {loginUserId} loginEmail = {loginEmail} />
      <div
        className="flex-grow p-4 overflow-y-auto space-y-4"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {messages.map((msg) => (
          <MessageBubble
            key={msg._id || Date.now()}
            message={msg}
            loginUserId={loginUserId}
          />
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
