import { useContext, useEffect, useState } from "react";
import { AiFillHome, AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import { TokenContext } from "../context/tokenContext";
import PlaylistCard from "./PlaylistCard";
import "overlayscrollbars/overlayscrollbars.css";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { NavLink } from "react-router-dom";
import { spotifyAPI } from "../api/spotifyAxios";

function Sidebar() {
  const [playlists, setPlaylists] = useState([]);
  const token = useContext(TokenContext);

  useEffect(() => {
    async function requestPlaylists() {
      console.log("requesting user playlists...");
      try {
        const params = {
          limit: 10,
          offset: 0,
        };
        const data = await spotifyAPI.getUserPlaylists(token, params);
        setPlaylists(data.items);
      } catch (err) {
        console.log(err)
      }
    }

    if (playlists.length === 0) {
      requestPlaylists();
    }
  }, [token, playlists]);

  return (
    <div className='w-20 h-full flex flex-col justify-between'>
      <div
        className={`flex flex-col gap-6 items-center rounded-md px-2 py-4 shadow-md mr-3`}
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
        <AiOutlineSearch className='text-xl'></AiOutlineSearch>
      </div>
      <OverlayScrollbarsComponent
        className='gap-2 overlow-y h-3/4 p-2'
        options={{
          scrollbars: { autoHide: "leave", theme: "os-theme-light" },
        }}
      >
        {playlists.map((playlist, idx) => (
          <PlaylistCard
            key={idx}
            className={"min-w-14 min-h-14 p-1"}
            playlist={playlist}
            imageOnly={true}
            onMouseEnter={() => {}}
          ></PlaylistCard>
        ))}
      </OverlayScrollbarsComponent>
    </div>
  );
}

export default Sidebar;
