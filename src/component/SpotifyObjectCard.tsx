import { useNavigate } from "react-router-dom";
import { CollectionImageResolution, SpotifyObjectType } from "../utils/enums";
import utils from "../utils/util";
import React, { forwardRef, useState } from "react";
import { isAlbum, isPlaylist } from "../utils/matchers";
import SpotifyImage from "./SpotifyImage";
import MajorPlayButton from "./Buttons/MajorPlayButton";
import style from './Buttons/QuickPlayButton.module.css'

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
  lazy?: boolean;
  playButton?: boolean;
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
    playButton,
    ...rest
  },
  ref
) {
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      className={`flex flex-col p-2 overflow-hidden hover:bg-spotify-hover rounded-sm cursor-pointer ${
        className ?? ""
      }`}
      onClick={() => {
        navigate(`/${type}/${data.id}`);
      }}
      ref={ref}
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
      }}
      {...rest}
    >
      <div className='relative'>
        <SpotifyImage
          className={`max-w-full max-h-full aspect-square object-cover ${
            rounded ? "rounded-full" : "rounded-md"
          }`}
          images={data.images}
          priority={imagePriority}
          resolution={imageResolution}
          lazy={lazy}
        ></SpotifyImage>
        {playButton && (
          <MajorPlayButton
            className={`absolute z-10 bottom-2 right-2 ${isHover ? style.appear : style.disappear}`}
            playableObjects={data}
          />
        )}
      </div>
      {!imageOnly && (
        <>
          <div className='text-base text-nowrap overflow-hidden text-ellipsis'>
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
