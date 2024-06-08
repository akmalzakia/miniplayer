import { useParams } from "react-router-dom";
import useAlbum from "../hooks/useAlbum";
import CollectionsTemplate from "./templates/Collections/CollectionsTemplate";
import { CollectionType } from "../utils/enums";

function Album() {
  const { id: albumId } = useParams();
  const [album, isLoading] = useAlbum(albumId || "");

  console.log(album);

  return (
    <CollectionsTemplate
      type={CollectionType.Album}
      collection={album}
      isDataLoading={isLoading}
    />
  );
}

export default Album;
