import WebPlayback from "../component/WebPlayback/WebPlayback";
import Sidebar from "../component/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import {
  OverlayScrollbarsComponent,
  OverlayScrollbarsComponentRef,
} from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import Topbar from "../component/Topbar";
import { PlayerProvider } from "../context/playerContext";
import { useEffect, useRef, useState } from "react";
import useUserContext from "../hooks/useUserContext";
import { ModalProvider } from "../context/modalContext";

function Home() {
  const [isLoaded, setLoaded] = useState(false);

  const { user, isLoading } = useUserContext();
  const location = useLocation();
  const scrollRef = useRef<OverlayScrollbarsComponentRef>(null);

  useEffect(() => {
    console.log("location changes");

    function scrollToTop() {
      const { viewport } = scrollRef.current?.osInstance()?.elements() || {};

      if (viewport) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        viewport.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    if (!scrollRef.current) return;

    scrollToTop();
  }, [location]);

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
      <ModalProvider>
        <div className='w-full flex flex-col bg-spotify-black h-full min-w-[800px] min-h-[600px] font-sans'>
          <div className='flex w-full h-full py-2 gap-2 overflow-hidden p-1'>
            <Sidebar></Sidebar>
            <div
              className={`flex flex-col h-full rounded-md w-[calc(100%-6rem)] bg-spotify-card`}
            >
              <Topbar />
              <OverlayScrollbarsComponent
                className='gap-2 overlow-y p-4 flex-1'
                options={{
                  scrollbars: { autoHide: "leave", theme: "os-theme-light" },
                }}
                ref={scrollRef}
              >
                <Outlet></Outlet>
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
      </ModalProvider>
    </PlayerProvider>
  );
}

export default Home;
