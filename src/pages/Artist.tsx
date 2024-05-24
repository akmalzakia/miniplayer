import { useParams } from "react-router-dom";
import useArtist from "../hooks/useArtist";
import { formatFollowers, formatTimeMinSecond } from "../utils/util";
import { Textfit } from "react-textfit";
import { FiPlay } from "react-icons/fi";
import Button from "../component/Button";
import { useContext, useEffect, useState } from "react";
import { spotifyAPI } from "../api/spotifyAxios";
import { TokenContext } from "../context/tokenContext";
import { AlbumGroup, SpotifyObjectType } from "../utils/enums";
import SingleDisplay from "../component/SingleDisplay";

function Artist() {
  const { id: artistId } = useParams();
  const [artist, isLoading] = useArtist(artistId || "");
  const [topTracks, setTopTracks] = useState<
    SpotifyApi.TrackObjectFull[] | null
  >(null);
  const [albums, setAlbums] = useState<SpotifyApi.ArtistsAlbumsResponse | null>(
    null
  );
  const [relatedArtists, setRelatedArtists] = useState<
    SpotifyApi.ArtistObjectFull[] | null
  >(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const token = useContext(TokenContext);

  useEffect(() => {
    async function requestTopTracks() {
      if (!artistId) return;

      try {
        const res = await spotifyAPI.getArtistTopTracks(artistId, token);
        setTopTracks(res);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }

    requestTopTracks();
  }, [artistId, token]);

  useEffect(() => {
    async function requestAlbums() {
      if (!artistId) return;

      try {
        const params = {
          include_groups: [AlbumGroup.Album, AlbumGroup.Single],
          limit: 10,
          offset: 0,
        };
        const res = await spotifyAPI.getArtistAlbums(artistId, params, token);
        setAlbums(res);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }

    requestAlbums();
  }, [artistId, token]);

  useEffect(() => {
    async function requestRelatedArtists() {
      if (!artistId) return;

      try {
        const res = await spotifyAPI.getRelatedArtists(artistId, token);
        setRelatedArtists(res);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }

    requestRelatedArtists();
  }, [artistId, token]);

  return (
    <div className='px-2'>
      <div className='py-2 flex w-full gap-4'>
        <div className='w-40 shrink-0'>
          <img
            className='rounded-full shadow-md max-w-full max-h-full'
            height={artist?.images[0].height}
            width={artist?.images[0].width}
            src={artist?.images[0].url}
          ></img>
        </div>
        <div className='flex flex-col justify-between gap-4 w-[calc(100%-10.5rem)] flex-grow-0'>
          <div></div>
          <div className='font-bold'>
            <Textfit
              mode='single'
              min={36}
              max={90}
            >
              {artist?.name}
            </Textfit>
          </div>
          <div className='font-normal'>
            {formatFollowers(artist?.followers.total || 0)} monthly listeners
          </div>
        </div>
      </div>
      <div className='py-2 flex gap-2'>
        <Button className='p-3'>
          <FiPlay></FiPlay>
        </Button>
      </div>
      <div className='py-4'>
        <div className='font-bold text-xl'>Popular</div>
        <div className='py-2'>
          {topTracks
            ?.slice(0, isExpanded ? topTracks.length : topTracks.length / 2)
            .map((track, idx) => (
              <div
                key={track.id}
                className='flex justify-between p-2 gap-2 hover:bg-white hover:bg-opacity-5 text-sm text-gray-400 rounded-md'
              >
                <div className='flex gap-2'>
                  <div className='p-2'>{idx + 1}</div>
                  <div className='w-10 min-w-10'>
                    <img
                      className='max-w-full max-h-full rounded-md'
                      src={track.album.images[0].url}
                    ></img>
                  </div>

                  <div className='flex flex-col justify-center'>
                    <div className={`text-white`}>{track.name}</div>
                    {track.explicit && <div>Explicit</div>}
                  </div>
                </div>
                <div className='self-center'>
                  {formatTimeMinSecond(track.duration_ms)}
                </div>
              </div>
            ))}
        </div>
        <button
          className='text-sm font-bold text-gray-600 pointer hover:text-white'
          onClick={() => setIsExpanded((s) => !s)}
        >
          {isExpanded ? "See less" : "See more"}
        </button>
      </div>
      {albums && (
        <SingleDisplay
          title='Albums'
          data={albums.items}
          type={SpotifyObjectType.Album}
        />
      )}
      {relatedArtists && (
        <SingleDisplay
          title='Related Artists'
          data={relatedArtists}
          type={SpotifyObjectType.Artist}
        />
      )}
    </div>
  );
}

export default Artist;
