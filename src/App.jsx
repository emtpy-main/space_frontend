import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./component/Landing";
import Login from "./component/Login";
import Explore from "./component/Explore";
import Profile from "./component/Profile";
import Chat from "./component/Chat";
import appstore from "./component/store/appstore";
import { Provider } from "react-redux";
import { SocketProvider } from "./utils/socket"; // ✅ import provider (not useSocket)
import Room from "./component/Room";
import { PeerProvider } from "./utils/Peer";
const App = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Explore />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/explore",
      element: <Landing />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/chat",
      element: <Chat />,
    },
    {
      path: "/room/:roomId",
      element: (
        <PeerProvider>
          <Room />
        </PeerProvider>
      ),
    },
  ]);

  return (
    <Provider store={appstore}>
      <SocketProvider>
        <RouterProvider router={appRouter} />
      </SocketProvider>
    </Provider>
  );
};

export default App;
