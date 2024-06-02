import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { FaAngleLeft, FaBell, FaUsers } from "react-icons/fa";
import useUserContext from "../hooks/useUserContext";

function Topbar() {
  const { user, isLoading } = useUserContext();
  const navigate = useNavigate();
  return (
    <div className='flex sticky top-0 items-center px-4 py-2 justify-between z-10'>
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
              src={user?.images?.[0].url}
            ></img>
          )}
        </Button>
      </div>
    </div>
  );
}

export default Topbar;
