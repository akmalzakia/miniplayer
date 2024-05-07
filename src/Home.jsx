import { FaHome, FaSearch } from "react-icons/fa";
import WebPlayback from "./WebPlayback";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { TokenContext } from "./context/tokenContext";
import PlaylistCard from "./component/PlaylistCard";

function Home() {
  const [featured, setFeatured] = useState([]);
  const token = useContext(TokenContext);

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

    requestFeatured();
  }, [token]);
  return (
    <>
      <div className='w-full flex flex-col h-full'>
        <div className='flex w-full h-full bg-black p-2 gap-2 overflow-hidden'>
          <div className='w-20 h-full'>
            <div className='flex flex-col gap-6 items-center rounded-md bg-gray-800 px-2 py-4 shadow-md'>
              <FaHome className='text-2xl'></FaHome>
              <FaSearch className='text-xl'></FaSearch>
            </div>
          </div>
          <div className='w-full h-full rounded-md bg-gray-800 p-4 flex-1 overflow-auto'>
            <div className='font-bold text-xl'>Featured for you</div>
            <div
              className='grid'
              style={{
                gridTemplateColumns: "repeat(auto-fill, 12em)",
                gridTemplateRows: "repeat(2, 16em)",
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
