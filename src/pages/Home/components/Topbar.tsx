import { useNavigate } from "react-router-dom";
import Button from "../../../component/Buttons/Button";
import { HiChevronLeft } from "react-icons/hi2";
import UserProfileCircle from "../../../component/UserProfileCircle";
import { forwardRef } from "react";

const Topbar = forwardRef<HTMLDivElement, unknown>(function Topbar(
  _: unknown,
  contentRef
) {
  const navigate = useNavigate();
  return (
    <div className='flex sticky top-0 items-center px-4 py-2 justify-between z-10 text-lg gap-4'>
      <Button
        className='!bg-black w-10 h-10'
        onClick={() => {
          navigate(-1);
        }}
      >
        <HiChevronLeft className='m-auto' />
      </Button>
      <div
        ref={contentRef}
        id='topbar-content-wrapper'
        className='flex-1'
      >
      </div>
      <div className='flex items-center gap-2'>
        <UserProfileCircle />
      </div>
    </div>
  );
});

export default Topbar;
