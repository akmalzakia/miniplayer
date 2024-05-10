import { createBrowserRouter } from "react-router-dom";
import Home from "./Home";
import Featured from "./Featured";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import { TokenProvider } from "../context/tokenContext";
import requestToken from "../router/loaders/homeLoader";

const router = createBrowserRouter([
  {
    path: "/",
    loader: requestToken,
    element: (
      <ProtectedRoute>
        <TokenProvider>
          <Home></Home>
        </TokenProvider>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Featured />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
