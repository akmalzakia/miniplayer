import WebPlayback from "../WebPlayback";
import Sidebar from "../component/Sidebar";
import { Outlet } from "react-router-dom";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import Topbar from "../component/Topbar";
import { useUserContext } from "../context/userContext";
import { PlayerProvider } from "../context/playerContext";
import { useEffect, useState } from "react";

function Home() {
  const [isLoaded, setLoaded] = useState(false);

  const { user, isLoading } = useUserContext();

  useEffect(() => {
    const isPremium = user?.product === "premium";
    if (!isPremium || isLoaded) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    setLoaded(true);
  }, [isLoaded, user, isLoading]);

  return (
    <PlayerProvider>
      <div className='w-full flex flex-col h-full min-w-[800px] min-h-[600px]'>
        <div className='flex w-full h-full bg-spotify-black py-2 gap-2 overflow-hidden'>
          <Sidebar></Sidebar>
          <div
            className={`flex flex-col h-full rounded-md to-spotify-black py-4 pl-4 w-[calc(100%-6rem)]`}
          >
            <Topbar />
            <OverlayScrollbarsComponent
              className='gap-2 overlow-y'
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
    </PlayerProvider>
  );
}

export default Home;
