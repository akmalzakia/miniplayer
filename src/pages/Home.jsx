import WebPlayback from "../WebPlayback";
import Sidebar from "../component/Sidebar";
import { Outlet } from "react-router-dom";

function Home() {
  // please check how token refresh affect children components by investigating each component re-renders

  return (
    <>
      <div className='w-full flex flex-col h-full'>
        <div className='flex w-full h-full bg-spotify-black p-2 gap-2 overflow-hidden'>
          <Sidebar></Sidebar>
          <div
            className={`w-full h-full rounded-md to-spotify-black p-4 flex-1`}
          >
            {<Outlet></Outlet>}
          </div>
          {/* <div className='w-1/3'>
            <div className='flex w-full h-full rounded-md bg-gray-800 px-2 py-4'>
              d
            </div>
          </div> */}
        </div>
        <WebPlayback></WebPlayback>
      </div>
    </>
  );
}

export default Home;
