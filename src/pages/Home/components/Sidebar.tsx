import { AiFillHome, AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import SidebarPlaylistLibrary from "./SidebarPlaylistLibrary";

function Sidebar() {
  return (
    <div className='w-24 h-full flex flex-col justify-between pr-2'>
      <div
        className={`flex flex-col gap-6 items-center rounded-md px-2 py-6 shadow-md bg-spotify-card`}
      >
        <NavLink
          to='/'
          className='text-2xl'
        >
          {({ isActive }) =>
            isActive ? (
              <AiFillHome></AiFillHome>
            ) : (
              <AiOutlineHome></AiOutlineHome>
            )
          }
        </NavLink>
        {/* <AiOutlineSearch className='text-xl'></AiOutlineSearch> */}
      </div>
      <SidebarPlaylistLibrary />
    </div>
  );
}

export default Sidebar;
