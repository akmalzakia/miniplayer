import { useNavigate } from "react-router-dom";
import { CollectionImageResolution, SpotifyObjectType } from "../utils/enums";
import utils from "../utils/util";
import React, { forwardRef } from "react";
import { isAlbum, isPlaylist } from "../utils/matchers";
import SpotifyImage from "./SpotifyImage";

interface Props extends React.ComponentPropsWithRef<"div"> {
  type: SpotifyObjectType;
  data:
    | SpotifyApi.PlaylistObjectFull
    | SpotifyApi.PlaylistObjectSimplified
    | SpotifyApi.ArtistObjectFull
    | SpotifyApi.AlbumObjectSimplified;
  imageOnly?: boolean;
  rounded?: boolean;
  imageResolution: CollectionImageResolution;
  imagePriority?: "high" | "low" | "auto";
  lazy?: boolean
}

const SpotifyObjectCard = forwardRef<
  HTMLDivElement,
  Props & React.PropsWithChildren
>(function SpotifyObjectCard(
  {
    type,
    data,
    imageOnly,
    rounded,
    className,
    imagePriority,
    imageResolution,
    lazy,
    ...rest
  },
  ref
) {
  const navigate = useNavigate();

  return (
    <div
      className={`flex flex-col p-2 overflow-hidden hover:bg-spotify-hover rounded-sm cursor-pointer ${
        className ?? ""
      }`}
      onClick={() => {
        navigate(`/${type}/${data.id}`);
      }}
      ref={ref}
      {...rest}
    >
      <SpotifyImage
        className={`max-w-full max-h-full aspect-square object-cover ${
          rounded ? "rounded-full" : "rounded-md"
        }`}
        images={data.images}
        priority={imagePriority}
        resolution={imageResolution}
        lazy={lazy}
      ></SpotifyImage>
      {!imageOnly && (
        <>
          <div className='text-base text-nowrap overflow-hidden text-ellipsis font-sans'>
            {data.name}
          </div>
          {isPlaylist(data) ? (
            <div className='text-spotify-gray text-sm text-ellipsis line-clamp-2'>
              {data.description}
            </div>
          ) : isAlbum(data) ? (
            <div className='flex gap-2 text-sm text-spotify-gray'>
              <div>{data.release_date.split("-")[0]}</div>
              <div>&#xb7;</div>
              <div>{utils.upperFirstLetter(data.album_group)}</div>
            </div>
          ) : (
            <div className='text-spotify-gray text-sm'>
              {utils.upperFirstLetter(data.type)}
            </div>
          )}
        </>
      )}
    </div>
  );
});

export default SpotifyObjectCard;
