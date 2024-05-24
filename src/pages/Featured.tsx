import { useContext, useEffect, useState } from "react";
import SpotifyObjectCard from "../component/SpotifyObjectCard";
import { TokenContext } from "../context/tokenContext";
import { spotifyAPI } from "../api/spotifyAxios";
import SpotifyObjectCardSkeleton from "../component/SpotifyObjectCardSkeleton";
import { SpotifyObjectType } from "../utils/enums";
import SingleDisplay from "../component/SingleDisplay";

function Featured() {
  const [featured, setFeatured] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);
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
      <SingleDisplay
        title='Featured'
        data={featured}
        type={SpotifyObjectType.Playlist}
        isLoading={isLoading}
      />
    </>
  );
}

export default Featured;
