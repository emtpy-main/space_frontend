import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./component/Landing";  
import Login from "./component/Login";  
import Explore from "./component/Explore";
import Profile from "./component/Profile"
import Chat from "./component/Chat"
import appstore from "./component/store/appstore";
import { Provider } from "react-redux";
const App = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Explore />,
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path : "/explore",
      element : <Landing/>
    },
    {
      path : "/profile",
      element : <Profile/>
    },
    {
      path : "/chat",
      element : <Chat/>
    }
  ]);

  return (
    <Provider store={appstore} >
        <RouterProvider router={appRouter} />
    </Provider>
  );
};

export default App;