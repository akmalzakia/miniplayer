import { useContext, useEffect, useState } from "react";
import PlaylistCard from "../component/PlaylistCard";
import { TokenContext } from "../context/tokenContext";
import { spotifyAPI } from "../api/spotifyAxios";
import PlaylistCardSkeleton from "../component/PlaylistCardSkeleton";

function Featured() {
  const [featured, setFeatured] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = useContext(TokenContext);
  useEffect(() => {
    async function requestFeatured() {
      console.log("requesting featured playlists...");
      try {
        const params = {
          locale: "en_EN",
          limit: 10,
          offset: 0,
        };
        const data = await spotifyAPI.getFeaturedPlaylists(token, params);
        setFeatured(data.playlists.items);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(true);
      }
    }

    if (featured.length === 0) {
      requestFeatured();
    } else {
      setIsLoading(false);
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
        {isLoading ? [...Array(6)].map((x, i) => <PlaylistCardSkeleton key={i}/>) : (
          featured &&
          featured.map((playlist, idx) => (
            <PlaylistCard
              key={idx}
              playlist={playlist}
            ></PlaylistCard>
          ))
        )}
      </div>
    </>
  );
}

export default Featured;
