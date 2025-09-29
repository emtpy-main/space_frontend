import {io} from "socket.io-client";
import { BaseUrl } from "./constants";

export const createSocketConnection = () => {
    const socket = io(BaseUrl, {
  path: "/space/" 
});
    console.log("Socket connected to:", BaseUrl);
    return socket;
};
 