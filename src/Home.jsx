import WebPlayback from "./WebPlayback";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { TokenContext } from "./context/tokenContext";
import PlaylistCard from "./component/PlaylistCard";
import Sidebar from "./component/Sidebar";

function Home() {
  const [featured, setFeatured] = useState([]);
  const token = useContext(TokenContext);
  // please check how token refresh affect children components by investigating each component re-renders

  useEffect(() => {
    async function requestFeatured() {
      console.log("requesting featured playlists...");
      await axios
        .get("https://api.spotify.com/v1/browse/featured-playlists", {
          params: {
            locale: "en_EN",
            limit: 10,
            offset: 0,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setFeatured(res.data.playlists.items);
          console.log(res.data.playlists.items);
        });
    }

    if (featured.length === 0) {
      requestFeatured();
    }
  }, [token, featured]);

  return (
    <>
      <div className='w-full flex flex-col h-full'>
        <div className='flex w-full h-full bg-spotify-black p-2 gap-2 overflow-hidden'>
          <Sidebar></Sidebar>
          <div className={`w-full h-full rounded-md to-spotify-black p-4 flex-1`}>
            <div className='font-bold text-xl px-2 mb-1'>Featured for you</div>
            <div
              className='grid'
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(10em, 1fr))",
                gridTemplateRows: "repeat(auto-fill, minmax(14em, 1fr))",
              }}
            >
              {featured.map((playlist, idx) => (
                <PlaylistCard
                  key={idx}
                  playlist={playlist}
                ></PlaylistCard>
              ))}
            </div>
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
