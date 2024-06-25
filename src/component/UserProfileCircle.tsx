import { useLayoutEffect, useRef, useState } from "react";
import useUserContext from "../hooks/Context/useUserContext";
import { CollectionImageResolution } from "../utils/enums";
import Button from "./Buttons/Button";
import ImageSkeleton from "./Skeleton/ImageSkeleton";
import SpotifyImage from "./SpotifyImage";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

function UserProfileCircle() {
  const { user, isLoading } = useUserContext();
  const [popupWidth, setPopupWidth] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const rect = buttonRef.current?.getBoundingClientRect();
  const root = document.getElementById("root");
  const margin = 5; //px

  useLayoutEffect(() => {
    if (!popupRef.current || !showPopup) return;

    const tooltipRect = popupRef.current.getBoundingClientRect();
    const w = tooltipRect.width;

    setPopupWidth(w);
  }, [showPopup]);

  function handleClicksOutside(ev: MouseEvent) {
    if (!popupRef.current || !buttonRef.current) return;

    if (
      !popupRef.current.contains(ev.target as HTMLElement) &&
      !buttonRef.current.contains(ev.target as HTMLElement)
    ) {
      setShowPopup(false);
      document.removeEventListener("click", handleClicksOutside);
    }
  }

  function togglePopup() {
    if (showPopup) {
      setShowPopup(false);
      document.removeEventListener("click", handleClicksOutside);
    } else {
      setShowPopup(true);
      document.addEventListener("click", handleClicksOutside);
    }
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <>
      <Button
        className='!bg-black !p-0 w-10 h-10 border border-gray-400'
        tooltipContent={!showPopup ? user?.display_name : null}
        innerRef={buttonRef}
        onClick={togglePopup}
      >
        {isLoading ? (
          <ImageSkeleton className='rounded-full' />
        ) : (
          <SpotifyImage
            className='rounded-full'
            images={user?.images}
            priority='low'
            resolution={CollectionImageResolution.Low}
          ></SpotifyImage>
        )}
      </Button>
      {showPopup &&
        root &&
        rect &&
        createPortal(
          <div
            ref={popupRef}
            className={`fixed bg-spotify-tooltip text-sm p-1.5 rounded-md shadow-lg text-nowrap z-10 flex flex-col font-sans w-40 gap-2`}
            style={{
              top: rect.top + rect.height + margin,
              left: rect.left + rect.width - popupWidth,
            }}
          >
            <button
              className='p-2 bg-spotify-tooltip rounded-sm hover:bg-[#3e3e3e] text-left'
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>,
          root
        )}
    </>
  );
}

export default UserProfileCircle;
