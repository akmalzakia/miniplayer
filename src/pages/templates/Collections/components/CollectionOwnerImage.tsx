import { useContext, useEffect, useState } from "react";
import { TokenContext } from "../../../../context/tokenContext";
import { spotifyAPI } from "../../../../api/spotifyAxios";
import { CollectionType } from "../../../../utils/enums";

interface Props {
  type: CollectionType;
  ownerId: string;
}

function CollectionOwnerImage({ type, ownerId }: Props) {
  const [imageUrl, setImageUrl] = useState("");
  const token = useContext(TokenContext);
  useEffect(() => {
    async function fetchOwnerImageUrl() {
      try {
        const res = await spotifyAPI.getUserById(ownerId, token);
        setImageUrl((res.images && res.images[0].url) || "");
      } catch (error) {
        console.log(error);
      }
    }

    async function fetchArtistImageUrl() {
      try {
        const res = await spotifyAPI.getArtistById(ownerId, token);
        setImageUrl((res.images && res.images[0].url) || "");
      } catch (error) {
        console.log(error);
      }
    }

    if (!ownerId) return;

    if (type === CollectionType.Playlist) {
      fetchOwnerImageUrl();
    } else {
      fetchArtistImageUrl();
    }
  }, [token, ownerId, type]);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        className='w-6 h-6 rounded-full'
      ></img>
    );
  } else {
    return <></>;
  }
}

export default CollectionOwnerImage;
