import { createBrowserRouter } from "react-router-dom";
import Home from "./Home";
import Featured from "./Featured";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import { TokenProvider } from "../context/tokenContext";
import requestToken from "../router/loaders/homeLoader";
import Playlist from "./Playlist";
import { UserProvider } from "../context/userContext";

const router = createBrowserRouter([
  {
    path: "/",
    loader: requestToken,
    element: (
      <ProtectedRoute>
        <TokenProvider>
          <UserProvider>
            <Home></Home>
          </UserProvider>
        </TokenProvider>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Featured />,
      },
      {
        path: "/playlist/:id",
        element: <Playlist />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
