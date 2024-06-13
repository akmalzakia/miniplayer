import { useContext, useEffect, useState } from "react";
import { TokenContext } from "../../../../context/tokenContext";
import { spotifyAPI } from "../../../../api/spotifyAxios";
import {
  CollectionImageResolution,
  CollectionType,
} from "../../../../utils/enums";
import SpotifyImage from "../../../../component/SpotifyImage";

interface Props {
  type: CollectionType;
  ownerId: string;
}

function CollectionOwnerImage({ type, ownerId }: Props) {
  const [imageUrls, setImageUrls] = useState<SpotifyApi.ImageObject[]>();
  const token = useContext(TokenContext);
  useEffect(() => {
    async function fetchOwnerImageUrl() {
      try {
        const res = await spotifyAPI.getUserById(ownerId, token);
        setImageUrls(res.images);
      } catch (error) {
        console.log(error);
      }
    }

    async function fetchArtistImageUrl() {
      try {
        const res = await spotifyAPI.getArtistById(ownerId, token);
        setImageUrls(res.images);
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

  if (imageUrls) {
    return (
      <SpotifyImage
        images={imageUrls}
        resolution={CollectionImageResolution.Low}
        className='rounded-full'
      ></SpotifyImage>
    );
  } else {
    return <></>;
  }
}

export default CollectionOwnerImage;
