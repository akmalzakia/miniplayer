import TrackList from "./components/TrackList";
import {
  CollectionImageResolution,
  CollectionType,
} from "../../../utils/enums";
import CollectionOwnerImage from "./components/CollectionOwnerImage";
import { Textfit } from "react-textfit";
import utils from "../../../utils/util";
import { isPlaylist, isPlaylistTrack } from "../../../utils/matchers";
import usePlayerStateFetcher from "../../../hooks/usePlayerStateFetcher";
import LoadingDots from "../../../component/LoadingDots";
import SpotifyImage from "../../../component/SpotifyImage";
import MajorPlayButton from "../../../component/Buttons/MajorPlayButton";
import { useContext, useRef } from "react";
import { createPortal } from "react-dom";
import useElementIntersection from "../../../hooks/useElementIntersection";
import { ScrollbarContext } from "../../../context/scrollbarContext";
import { TopbarContentContext } from "../../../context/topbarContext";

interface Props {
  type: CollectionType;
  collection: SpotifyApi.AlbumObjectFull | SpotifyApi.PlaylistObjectFull | null;
  isDataLoading: boolean;
}

function CollectionsTemplate({ type, collection, isDataLoading }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollbar = useContext(ScrollbarContext);
  const portal = useContext(TopbarContentContext);

  const { observeElementVisibility } = useElementIntersection();

  function calculateDuration(
    tracks:
      | SpotifyApi.PlaylistTrackObject[]
      | SpotifyApi.TrackObjectSimplified[]
  ) {
    if (!tracks) return;

    const totalDuration = tracks.reduce((acc, obj) => {
      if (isPlaylistTrack(obj)) {
        if (obj.track) {
          return acc + obj.track.duration_ms;
        } else {
          return acc + 0;
        }
      } else {
        if (obj) {
          return acc + obj.duration_ms;
        } else {
          return acc + 0;
        }
      }
    }, 0);
    return totalDuration;
  }

  usePlayerStateFetcher(collection);

  function formatCollectionDuration(duration: number) {
    if (!duration) return;

    const timeDetails = utils.millisToMinutesAndSeconds(duration);
    let res = `${timeDetails.hours ? timeDetails.hours + " hr" : ""} `;
    res += `${timeDetails.minutes} min `;
    res += `${!timeDetails.hours ? timeDetails.seconds + " sec" : ""} `;

    return res;
  }

  if (isDataLoading) {
    return (
      <div className='w-full h-full flex'>
        <LoadingDots className='h-[15px] w-full m-auto' />
      </div>
    );
  }

  return (
    collection && (
      <>
        {portal &&
          createPortal(
            <div
              ref={contentRef}
              className={`flex invisible gap-4`}
            >
              <div>
                <MajorPlayButton playableObjects={collection}></MajorPlayButton>
              </div>
              <b className='text-xl my-auto'>{collection.name}</b>
            </div>,
            portal
          )}
        <div
          ref={(node) => {
            if (node) {
              observeElementVisibility(
                node,
                () => {
                  contentRef.current?.classList.add("invisible");
                },
                () => {
                  contentRef.current?.classList.remove("invisible");
                },
                {
                  root: scrollbar?.osInstance()?.elements().viewport,
                  threshold: 0.05,
                }
              );
            }
          }}
          className='p-4'
        >
          <div className='w-full flex gap-6'>
            <div className='w-[30%] min-w-36 max-w-72'>
              <SpotifyImage
                className='max-w-full max-h-full rounded-md shadow-md'
                images={collection.images}
                resolution={CollectionImageResolution.Medium}
              ></SpotifyImage>
            </div>
            <div className='flex flex-col justify-end gap-2 w-[70%] min-w-[calc(100%-19.5rem)] max-w-[calc(100%-10.5rem)]'>
              {isPlaylist(collection) && (
                <div className=''>
                  {collection.public ? "Public" : "Private"} Playlist
                </div>
              )}

              <div className='font-bold'>
                <Textfit
                  mode='single'
                  min={36}
                  max={90}
                >
                  {collection?.name}
                </Textfit>
              </div>

              <div className='text-spotify-gray mt-1'>
                {isPlaylist(collection) && collection.description}
              </div>
              <div className='flex text-spotify-gray items-center gap-1'>
                <div className='w-6 h-6'>
                  <CollectionOwnerImage
                    type={type}
                    ownerId={
                      isPlaylist(collection)
                        ? collection.owner.id
                        : collection.artists[0].id
                    }
                  />
                </div>
                <div className='font-bold text-white'>
                  {isPlaylist(collection)
                    ? collection.owner.display_name
                    : collection.artists[0].name}
                </div>
                <div>&#xb7;</div>
                {isPlaylist(collection) &&
                  collection.followers &&
                  collection.followers.total !== 0 && (
                    <>
                      <div className=''>
                        {utils.formatFollowers(collection.followers.total)}{" "}
                        likes
                      </div>
                      <div>&#xb7;</div>
                    </>
                  )}
                <div className=''>
                  {collection.tracks.total} songs,{" "}
                  {formatCollectionDuration(
                    calculateDuration(collection.tracks.items) || 0
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className='flex mt-4'>
            <MajorPlayButton playableObjects={collection} />
          </div>
        </div>
        <TrackList
          type={type}
          tracks={collection.tracks.items}
          collectionUri={collection.uri}
        ></TrackList>
      </>
    )
  );
}

export default CollectionsTemplate;
