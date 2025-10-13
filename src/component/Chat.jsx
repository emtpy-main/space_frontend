import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { createSocketConnection } from "../utils/socket";
import {
  ThemeProvider,
  createTheme,
} from "@mui/material"; 
import { BaseUrl } from "../utils/constants";
import { addConnection } from "./store/connectionsSlice";
import { ContactList } from "./ChatWindow";
import ChatWindow from "./ChatWindow";
const chatMuiTheme = createTheme({
  palette: { primary: { main: "#5f36a0" }, mode: "dark" },
});



 

export default function Chat() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [activeView, setActiveView] = useState("contacts");
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(false); 
  const user = useSelector((store) => store.user);
  const contacts = useSelector((store) => store.connection);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  useEffect(() => {
    if (user?._id) {
      // Create a single socket connection when the user is available
      if (!socketRef.current) {
        socketRef.current = createSocketConnection();
        console.log("Socket connection established.");

        socketRef.current.on("receiveMessage", (newMessage) => {
          // Determine the correct chat to place the message in
          const contactId =
            newMessage.senderId === user._id
              ? selectedContact?._id
              : newMessage.senderId;
          if (contactId) {
            setMessages((prev) => {
              const existingMsgs = prev[contactId] || [];
              // Prevent duplicates if an optimistic message exists
              if (existingMsgs.some((msg) => msg._id === newMessage._id)) {
                return prev;
              }
              // Replace the optimistic message with the real one from the server
              const nonOptimistic = existingMsgs.filter(
                (msg) => !msg._id.startsWith("optimistic-")
              );
              return { ...prev, [contactId]: [...nonOptimistic, newMessage] };
            });
          }
        }); 
        socketRef.current.on("chatHistory", (history) => {
          if (selectedContact) {
            setMessages((prev) => ({
              ...prev,
              [selectedContact._id]: history,
            }));
          }
        });
      } 
      if (selectedContact) {
        socketRef.current.emit("joinRoom", {
          fromUser: user._id,
          toUser: selectedContact._id,
        });
      }
 
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [user, selectedContact]);  
  const handleSendMessage = (text) => {
    if (!selectedContact || !socketRef.current || !user?._id) return;

    const messagePayload = {
      content: text,
      from: user._id,
      to: selectedContact._id,
    };
 
    socketRef.current.emit("sendMessage", messagePayload);
 
    const optimisticMessage = {
      ...messagePayload,
      _id: `optimistic-${Date.now()}`,  
      senderId: user._id, 
    };

    setMessages((prev) => ({
      ...prev,
      [selectedContact._id]: [
        ...(prev[selectedContact._id] || []),
        optimisticMessage,
      ],
    }));
  };

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
    } else {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setActiveView("chat");
  };

  const handleBack = () => {
    setActiveView("contacts");
    setSelectedContact(null);
  };

  if (!user) {
    return null;
  }

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
            isLoading={isLoading}
            loginUserId={user?._id}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
