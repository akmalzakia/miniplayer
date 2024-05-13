import WebPlayback from "../WebPlayback";
import Sidebar from "../component/Sidebar";
import { Outlet } from "react-router-dom";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import Topbar from "../component/Topbar";

function Home() {
  return (
    <>
      <div className='w-full flex flex-col h-full min-w-[800px] min-h-[600px]'>
        <div className='flex w-full h-full bg-spotify-black p-2 gap-2 overflow-hidden'>
          <Sidebar></Sidebar>
          <div
            className={`flex flex-col w-full h-full rounded-md to-spotify-black p-4 flex-1`}
          >
            <Topbar />
            <OverlayScrollbarsComponent
              className='gap-2 overlow-y p-2'
              options={{
                scrollbars: { autoHide: "leave", theme: "os-theme-light" },
              }}
            >
              {<Outlet></Outlet>}
            </OverlayScrollbarsComponent>
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
