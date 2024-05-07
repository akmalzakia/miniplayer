import Login from "./Login";
import "./App.css";
import { useContext } from "react";
import { TokenContext } from "./context/tokenContext";
import Home from "./Home";

function App() {
  const token = useContext(TokenContext);
  return <>{token === "" || token === null ? <Login /> : <Home />}</>;
}

export default App;
