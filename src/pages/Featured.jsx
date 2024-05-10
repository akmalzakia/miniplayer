import { useContext, useEffect, useState } from "react";
import PlaylistCard from "../component/PlaylistCard";
import axios from "axios";
import { TokenContext } from "../context/tokenContext";

function Featured() {
  const [featured, setFeatured] = useState([]);
  const token = useContext(TokenContext);
  useEffect(() => {
    async function requestFeatured() {
      console.log("requesting featured playlists...");
      try {
        const { data } = await axios.get(
          "https://api.spotify.com/v1/browse/featured-playlists",
          {
            params: {
              locale: "en_EN",
              limit: 10,
              offset: 0,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFeatured(data.playlists.items);
      } catch (err) {
        console.log(err);
      }
    }

    if (featured.length === 0) {
      requestFeatured();
    }
  }, [featured, token]);

  return (
    <>
      <div className='font-bold text-xl px-2 mb-1'>Featured for you</div>
      <div
        className='grid'
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(10em, 1fr))",
          gridTemplateRows: "repeat(auto-fill, minmax(14em, 1fr))",
        }}
      >
        {featured &&
          featured.map((playlist, idx) => (
            <PlaylistCard
              key={idx}
              playlist={playlist}
            ></PlaylistCard>
          ))}
      </div>
    </>
  );
}

export default Featured;
