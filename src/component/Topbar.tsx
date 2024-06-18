import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { HiChevronLeft, HiOutlineBell, HiOutlineUsers } from "react-icons/hi2";
import UserProfileCircle from "./UserProfileCircle";

function Topbar() {
  const navigate = useNavigate();
  return (
    <div className='flex sticky top-0 items-center px-4 py-2 justify-between z-10 text-lg'>
      <Button
        className='!bg-black w-10 h-10'
        onClick={() => {
          navigate(-1);
        }}
      >
        <HiChevronLeft className='m-auto' />
      </Button>
      <div className='flex items-center gap-2'>
        {/* <Button className='!bg-black w-10 h-10 hover:text-xl text-gray-400 hover:text-white'>
          <HiOutlineBell className='m-auto' />
        </Button>
        <Button className='!bg-black w-10 h-10 hover:text-xl text-gray-400 hover:text-white'>
          <HiOutlineUsers className='m-auto' />
        </Button> */}
        <UserProfileCircle />
      </div>
    </div>
  );
}

export default Topbar;
