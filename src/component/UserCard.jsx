import { useState, useEffect } from "react";
import SwipeableUserCard from "./SwipeableUserCard";
import axios from "axios";
import { BaseUrl } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "./store/feedSlice";
import ActionButtons from "./ui/ActionButtons";
import {LoadingState,EmptyState} from './ui/Loading&EmptyState'
// --- Reusable Styles & Components ---

const glassStyle =
  "bg-[#2c1857]/30 border border-white/20 text-white backdrop-blur-lg shadow-2xl rounded-2xl";

const Header = () => (
  <header
    className={`p-3 md:p-4 text-center z-30 flex-shrink-0 flex justify-center items-center absolute top-0 left-0 right-0 ${glassStyle} rounded-none border-b`}
  >
    <h1 className="text-2xl md:text-3xl font-bold tracking-wider">Discover</h1>
  </header>
);

 
export default function App() {
  const dispatch = useDispatch(); 
  const feed = useSelector((store) => store.feed) || [];
  const [loading, setLoading] = useState(true); 
  const getFeed = async (force = false) => {
    try {
      if (!force && feed.length > 0) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const res = await axios.get(BaseUrl + "/feed", { withCredentials: true });
      dispatch(addFeed(res?.data?.users || []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }; 
  useEffect(() => {
    getFeed();
  }, []); 
  const handleRight = async (user) => { 
      console.log(user);
      try {
      const res = await axios.post(
        `${BaseUrl}/request/send/interested/${user._id}`,  
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(user._id));  
      console.log("Request response:", res.data);
    } catch (err) {
      console.error("Error sending request:", err);
    }
  }; 
  const handleLeft = async (user) => {
    try {
      const res = await axios.post(
        `${BaseUrl}/request/send/ignored/${user._id}`,  
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(user._id));  
      console.log("Request response:", res.data);
    } catch (err) {
      console.error("Error sending request:", err);
    }
  }; 
  const handleUp = (user) => {
    console.log(`${user.firstName} swiped up (Super Like)`);
    dispatch(removeUserFromFeed(user._id));
  }; 
  const handleDown = (user) => {
    console.log(`${user.firstName} swiped down (Dismiss)`);
    dispatch(removeUserFromFeed(user._id));
  }; 
  const handleSwipe = (direction, user) => {
    switch (direction) {
      case "right":
        handleRight(user);
        break;
      case "left":
        handleLeft(user);
        break;
      case "up":
        handleUp(user);
        break;
      case "down":
        handleDown(user);
        break;
      default:
        break;
    }
  }; 
  const currentUser = feed.length > 0 ? feed[feed.length - 1] : null; 
  return (
    <div className="relative w-full h-screen font-sans overflow-hidden"> 
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-500 bg-[url('/app_bg.jpeg')]"
        // style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=2755&auto=format&fit=crop')" }}
      />
      <div className="absolute inset-0 w-full h-full bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full h-full flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="relative w-[90vw] max-w-sm h-[75vh] max-h-[600px]">
            {loading ? (
              <LoadingState />
            ) : feed.length > 0 ? (
              [...feed].reverse().map((user, index) => {
                const isTopCard = index === feed.length - 1;
                return (
                  <SwipeableUserCard
                    key={user._id}
                    user={user}
                    onSwipe={isTopCard ? (dir) => handleSwipe(dir, user) : () => {}}
                    style={{
                      zIndex: index,
                      transform: `translateY(${-index * 12}px) scale(${1 - index * 0.05})`,
                      opacity: index < feed.length - 3 ? 0 : 1,
                    }}
                  />
                );
              })
            ) : (
              <EmptyState onRefresh={() => getFeed(true)} />
            )}
          </div> 
          { !loading && currentUser && (
             <ActionButtons
                onDislike={() => handleLeft(currentUser)}
                onSuperLike={() => handleRight(currentUser)}
                onLike={() => handleUp( currentUser)}
             />
          )} 
        </main>
      </div>
    </div>
  );
}