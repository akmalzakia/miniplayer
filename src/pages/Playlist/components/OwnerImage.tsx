import { useContext, useEffect, useState } from "react";
import { TokenContext } from "../../../context/tokenContext";
import { spotifyAPI } from "../../../api/spotifyAxios";

interface Props {
  userId: string;
}

function OwnerImage({ userId }: Props) {
  const [imageUrl, setImageUrl] = useState("");
  const token = useContext(TokenContext);
  useEffect(() => {
    async function fetchOwnerImageUrl() {
      if (!userId) return;

      try {
        const res = await spotifyAPI.getUserById(userId, token);
        setImageUrl((res.images && res.images[0].url) || "");
      } catch (error) {
        console.log(error);
      }
    }

    fetchOwnerImageUrl();
  }, [token, userId]);

  if (imageUrl) {
    return <img src={imageUrl} className="w-6 h-6 rounded-full"></img>;
  } else {
    return <></>;
  }
}

export default OwnerImage;
