import { useContext, useEffect, useState } from "react";
import { AiFillHome, AiOutlineSearch } from "react-icons/ai";
import { TokenContext } from "../context/tokenContext";
import axios from "axios";
import PlaylistCard from "./PlaylistCard";
import "overlayscrollbars/overlayscrollbars.css";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

function Sidebar() {
  const [playlists, setPlaylists] = useState([]);
  const token = useContext(TokenContext);

  useEffect(() => {
    async function requestPlaylists() {
      console.log("requesting user playlists...");
      await axios
        .get("https://api.spotify.com/v1/me/playlists", {
          params: {
            limit: 10,
            offset: 0,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setPlaylists(res.data.items);
        });
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
        <AiFillHome className='text-2xl'></AiFillHome>
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
