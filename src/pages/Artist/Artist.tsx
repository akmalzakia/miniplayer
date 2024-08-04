import { useParams } from "react-router-dom";
import useArtist from "../../hooks/Artist/useArtist";
import utils from "../../utils/util";
import { Textfit } from "react-textfit";
import { useContext, useRef } from "react";
import {
  CollectionImageResolution,
  SpotifyObjectType,
} from "../../utils/enums";
import SingleDisplay from "../../component/SingleDisplay";
import useTopTracks from "../../hooks/Artist/useTopTracks";
import useArtistAlbums from "../../hooks/Artist/useArtistAlbums";
import useRelatedArtists from "../../hooks/Artist/useRelatedArtists";
import usePlayerStateFetcher from "../../hooks/usePlayerStateFetcher";
import LoadingDots from "../../component/LoadingDots";
import SpotifyImage from "../../component/SpotifyImage";
import MajorPlayButton from "../../component/Buttons/MajorPlayButton";
import useElementIntersection from "../../hooks/useElementIntersection";
import { createPortal } from "react-dom";
import { ScrollbarContext } from "../../context/scrollbarContext";
import { TopbarContentContext } from "../../context/topbarContext";
import SimplifiedTrackList from "./components/SimplifiedTrackList";

function Artist() {
  const { id: artistId } = useParams();
  const scrollbar = useContext(ScrollbarContext);
  const [artist, isLoading] = useArtist(artistId || "");
  const [topTracks, isTrackLoading] = useTopTracks(artistId);
  const [albums, isAlbumsLoading] = useArtistAlbums(artistId || "", 10);
  const [relatedArtists, isRelatedArtistLoading] = useRelatedArtists(artistId);

  const contentRef = useRef<HTMLDivElement>(null);
  const portal = useContext(TopbarContentContext);
  const { observeElementVisibility } = useElementIntersection();

  usePlayerStateFetcher(artist);

  const isDataLoading =
    isLoading && isTrackLoading && isAlbumsLoading && isRelatedArtistLoading;

  if (isDataLoading) {
    return (
      <div className='w-full h-full flex'>
        <LoadingDots className='h-[15px] w-full m-auto' />
      </div>
    );
  }

  return (
    <>
      {portal &&
        artist &&
        createPortal(
          <div
            ref={contentRef}
            className={`flex invisible gap-4`}
          >
            <div>
              <MajorPlayButton playableObjects={artist}></MajorPlayButton>
            </div>
            <b className='text-xl my-auto'>{artist.name}</b>
          </div>,
          portal
        )}
      <div className='px-2'>
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
        >
          <div className='py-2 flex w-full gap-4'>
            <div className='w-40 shrink-0'>
              <SpotifyImage
                className='rounded-full shadow-md max-w-full max-h-full'
                images={artist?.images}
                resolution={CollectionImageResolution.Medium}
              ></SpotifyImage>
            </div>
            <div className='flex flex-col justify-between gap-4 w-[calc(100%-10.5rem)] flex-grow-0 h-[175px]'>
              <div className='font-bold flex-1'>
                <Textfit
                  mode='single'
                  min={36}
                  max={90}
                >
                  {artist?.name}
                </Textfit>
              </div>
              <div className='font-normal h-6'>
                <>
                  {utils.formatFollowers(artist?.followers.total || 0)} monthly
                  listeners
                </>
              </div>
            </div>
          </div>
          <div className='py-2 flex gap-2'>
            {artist && <MajorPlayButton playableObjects={artist} />}
          </div>
        </div>
        <div className='py-4'>
          <div className='font-bold text-xl'>Popular</div>
          {topTracks && (
            <SimplifiedTrackList
              tracks={topTracks}
              expandable={{ enabled: true, preview: 5 }}
              isNumbered={true}
              showArtist={false}
            ></SimplifiedTrackList>
          )}
        </div>
        <SingleDisplay
          title='Albums'
          data={albums}
          type={SpotifyObjectType.Album}
          isLoading={isAlbumsLoading}
          detailLink='discography/all'
          lazy
        />
        <SingleDisplay
          title='Related Artists'
          data={relatedArtists}
          type={SpotifyObjectType.Artist}
          isLoading={isRelatedArtistLoading}
          lazy
        />
      </div>
    </>
  );
}

export default Artist;
