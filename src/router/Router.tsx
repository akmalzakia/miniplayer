import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Featured from "../pages/Featured";
import Login from "../pages/Login";
import ProtectedRoute from "../pages/ProtectedRoute";
import requestToken from "./loaders/homeLoader";
import Playlist from "../pages/Playlist";
import { TokenProvider } from "../context/tokenContext";
import { UserProvider } from "../context/userContext";
import Album from "../pages/Album";
import Artist from "../pages/Artist/Artist";
import AlbumList from "../pages/AlbumList/AlbumList";
import Search from "../pages/Search/Search";
import SearchSummary from "../pages/Search/SearchSummary";
import SearchSongs from "../pages/Search/SearchSongs";

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
      {
        path: "/artist/:id/discography/all",
        element: <AlbumList />,
      },
      {
        path: "/search",
        element: <Search />,
        children: [
          {
            path: "/search/:query",
            element: <SearchSummary />,
          },
          {
            path: "/search/:query/songs",
            element: <SearchSongs />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
