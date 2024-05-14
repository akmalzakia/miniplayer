import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { FaAngleLeft, FaBell, FaUsers } from "react-icons/fa";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

function Topbar() {
  const { user, isLoading } = useContext(UserContext)
  const navigate = useNavigate()
  return (
    <div className='flex items-center p-4 justify-between'>
      <Button
        className='!bg-black'
        onClick={() => {
          navigate(-1);
        }}
      >
        <FaAngleLeft />
      </Button>
      <div className='flex items-center gap-2'>
        <Button className='!bg-black'>
          <FaBell />
        </Button>
        <Button className='!bg-black'>
          <FaUsers />
        </Button>
        <Button className='!bg-black !p-0'>
          {!isLoading && (
            <img
              className='rounded-full w-8'
              src={user?.images[0].url}
            ></img>
          )}
        </Button>
      </div>
    </div>
  );
}

export default Topbar;
