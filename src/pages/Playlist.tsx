import { useParams } from "react-router-dom";
import usePlaylist from "../hooks/usePlaylist";
import CollectionsTemplate from "./templates/Collections/CollectionsTemplate";
import { CollectionType } from "../utils/enums";

function Playlist() {
  const { id: playlistId } = useParams();

  const [playlist, isLoading] = usePlaylist(playlistId || "");

  return (
    <CollectionsTemplate
      type={CollectionType.Playlist}
      collection={playlist}
    />
  );
}

export default Playlist;
