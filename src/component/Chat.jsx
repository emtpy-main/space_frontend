import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  ThemeProvider, 
  Avatar, 
} from "@mui/material";

import {
  Search, 
  Home,
} from "@mui/icons-material";

import { chatMuiTheme } from "./ui/muiTheme";
import { callGeminiAPI } from "./callGeminiAPI";
import { BaseUrl } from "../utils/constants";
import { addConnection } from "./store/connectionsSlice";
import ChatWindow from "./ChatWindow";

const initialContacts = [
  {
    id: "gemini-ai",
    name: "Gemini AI",
    dp: "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d6ebb19480d402631b87.svg",
    lastMessage: "Ask me anything!",
    time: "Online",
  },
  {
    id: 1,
    name: "Aria Sky",
    dp: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop",
    lastMessage: "See you tomorrow!",
    time: "10:42 PM",
  },
  {
    id: 2,
    name: "Leo Vance",
    dp: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop",
    lastMessage: "Sounds good!",
    time: "10:35 PM",
  },
  {
    id: 3,
    name: "Zara Night",
    dp: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=2587&auto=format&fit=crop",
    lastMessage: "Okay, I will check.",
    time: "9:15 PM",
  },
];

const glassStyle =
  "bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl rounded-2xl";

const ContactItem = ({ contact, onClick, selected }) => (
  <div
    onClick={onClick}
    className={`flex items-center p-3 cursor-pointer transition-all duration-300 rounded-xl ${
      selected ? "bg-[#5f36a0]/50" : "hover:bg-white/10"
    }`}
  >
    <Avatar
      src={contact.photoUrl}
      alt={contact.name}
      sx={{ width: 50, height: 50 }}
    />
    <div className="flex-grow ml-4 overflow-hidden">
      <h3 className="font-semibold text-white truncate">{`${contact.firstName} ${contact.lastName}`}</h3>
      <p className="text-sm text-gray-300 truncate">{contact?.lastMessage}</p>
    </div>
    <span className="text-xs text-gray-400 self-start mt-1">
      {contact?.time}
    </span>
  </div>
);

const ContactList = ({
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



const MessageBubble = ({ message }) => (
  <div
    className={`flex ${
      message.sender === "user" ? "justify-end" : "justify-start"
    }`}
  >
    <div
      className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
        message.sender === "user"
          ? "bg-[#2c1857] rounded-br-none"
          : "bg-[#5f36a0] rounded-bl-none"
      }`}
    >
      <p className="text-white">{message.text}</p>
    </div>
  </div>
);





export default function App() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [activeView, setActiveView] = useState("contacts");
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const contacts = useSelector((store) => store.connection);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchConnection = async () => {
    try {
      const res = await axios.get(BaseUrl + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnection(res?.data?.data));
    } catch (err) {
      console.error("Failed to fetch connections:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConnection();
    }
  }, [user]);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      const geminiContact = contacts.find((c) => c.id === "gemini-ai");
      setSelectedContact(geminiContact);
      setActiveView("chat");
    }
  }, [contacts]);
  if (!user) {
    return null;
  }

  const handleSendMessage = (text) => {
    const newMessage = { text, sender: "user" };
    const contactId = selectedContact.id;

    if (contactId === "gemini-ai") {
      const history = (messages["gemini-ai"] || []).map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));
      callGeminiAPI(text, history);
    } else {
      const currentMessages = messages[contactId] || [];
      setMessages((prev) => ({
        ...prev,
        [contactId]: [...currentMessages, newMessage],
      }));
    }
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setActiveView("chat");
  };

  const handleBack = () => {
    setActiveView("contacts");
  };

  return (
    <ThemeProvider theme={chatMuiTheme}>
      <div className="relative w-full h-screen font-sans overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=2755&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 w-full h-full bg-black/70" />
        <div className="relative w-full h-full flex p-4 md:p-6 gap-4">
          <ContactList
            contacts={contacts}
            onSelectContact={handleSelectContact}
            selectedContactId={selectedContact?._id}
            isVisible={activeView === "contacts"}
          />
          <ChatWindow
            user={selectedContact}
            isVisible={activeView === "chat"}
            onBack={handleBack}
            messages={messages[selectedContact?._id] || []}
            onSendMessage={handleSendMessage}
            isLoading={isLoading && selectedContact?._id === "gemini-ai"}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
