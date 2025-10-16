import React, { useMemo } from "react";
import { io } from "socket.io-client";
import { BaseUrl } from "./constants"; 

const SocketContext = React.createContext(null);

export const useSocket = () => {
  return React.useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useMemo(() => { 
    const newSocket = io(BaseUrl, {
      path: "/my-custom-path/",
    });
    console.log("Socket connected via context to:", BaseUrl);  
    return newSocket;
  }, []);  
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;