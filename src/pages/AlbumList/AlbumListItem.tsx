import utils from "../../utils/util";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import TrackList from "../templates/Collections/components/TrackList";
import { CollectionImageResolution, CollectionType } from "../../utils/enums";
import { spotifyAPI } from "../../api/spotifyAxios";
import { TokenContext } from "../../context/tokenContext";
import TrackListSkeleton from "../../component/Skeleton/TrackListSkeleton";
import SpotifyImage from "../../component/SpotifyImage";
import MajorPlayButton from "../../component/Buttons/MajorPlayButton";

interface Props {
  album: SpotifyApi.AlbumObjectSimplified;
}

function AlbumListItem({ album }: Props) {
  const [tracks, setTracks] = useState<
    SpotifyApi.TrackObjectSimplified[] | null
  >(null);
  const [isTracksLoading, setIsTrackLoading] = useState(true);
  const token = useContext(TokenContext);
  const loaderRef = useRef(null);

  const fetchTracks = useCallback(async () => {
    setIsTrackLoading(true);
    try {
      const res = await spotifyAPI.getAlbumTracks(album.id, token);
      setTracks(res.items);
      setIsTrackLoading(false);
    } catch (error) {
      console.log(error);
      setIsTrackLoading(true);
    }
  }, [album, token]);

  useEffect(() => {
    let observerRefValue = null;
    const observer = new IntersectionObserver((entries, observer) => {
      const target = entries[0];
      if (target.isIntersecting) {
        fetchTracks();
        observer.unobserve(target.target);
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
      observerRefValue = loaderRef.current;
    }

    return () => {
      if (observerRefValue) {
        observer.unobserve(observerRefValue);
      }
    };
  }, [fetchTracks]);

  return (
    <div
      className='my-10'
      ref={loaderRef}
    >
      <div className='flex gap-5 mb-5'>
        <div className='w-32'>
          <SpotifyImage
            className='max-w-full max-h-full rounded-md shadow-md'
            images={album.images}
            resolution={CollectionImageResolution.Medium}
          ></SpotifyImage>
        </div>
        <div className='flex-1 flex flex-col justify-between'>
          <div>
            <div className='font-bold text-ellipsis line-clamp-2 text-xl'>
              {album?.name}
            </div>
            <div className='text-sm text-spotify-gray flex gap-1'>
              <div>{utils.upperFirstLetter(album.album_group)}</div>
              <div>&#xb7;</div>
              <div>{album.release_date.split("-")[0]}</div>
              <div>&#xb7;</div>
              <div>{album.total_tracks} songs</div>
            </div>
          </div>
          <div>
            <MajorPlayButton playableObjects={album} />
          </div>
        </div>
      </div>
      {isTracksLoading ? (
        <TrackListSkeleton type={CollectionType.Album} />
      ) : (
        tracks && (
          <TrackList
            type={CollectionType.Album}
            tracks={tracks}
            collectionUri={album.uri}
          />
        )
      )}
    </div>
  );
}

export default AlbumListItem;
