import { useEffect } from "react";
import { Navigate, Outlet, useSearchParams } from "react-router-dom";

const ProtectedRoute = ({ redirectPath = "/login", children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = localStorage.getItem("access_token");
  console.log("protected route");
  useEffect(() => {
    if (searchParams.has("code")) {
      searchParams.delete("code");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  if (!token) {
    return (
      <Navigate
        to={redirectPath}
        replace
      />
    );
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
