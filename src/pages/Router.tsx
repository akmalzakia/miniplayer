import { createBrowserRouter } from "react-router-dom";
import Home from "./Home";
import Featured from "./Featured";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import requestToken from "../router/loaders/homeLoader";
import Playlist from "./Playlist";
import { TokenProvider } from "../context/tokenContext";
import { UserProvider } from "../context/userContext";
import Album from "./Album";
import Artist from "./Artist";

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
      {
        path: "/album/:id",
        element: <Album />,
      },
      {
        path: "/artist/:id",
        element: <Artist />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
