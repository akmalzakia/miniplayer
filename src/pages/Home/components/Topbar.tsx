import { useNavigate } from "react-router-dom";
import Button from "../../../component/Buttons/Button";
import { HiChevronLeft } from "react-icons/hi2";
import UserProfileCircle from "../../../component/UserProfileCircle";

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
        <UserProfileCircle />
      </div>
    </div>
  );
}

export default Topbar;
