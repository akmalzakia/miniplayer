import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TokenContext } from "../context/tokenContext";
import { formatTimeMinSecond, millisToMinutesAndSeconds } from "../utils/util";
import Button from "../component/Button";
import { FiPlay } from "react-icons/fi";

function Playlist() {
  const [playlist, setPlaylist] = useState(null);
  const token = useContext(TokenContext);
  const playlistId = useParams();
  
  function calculateDuration(tracks) {
    if (!tracks) return;

    const totalDuration = tracks.reduce(
      (acc, obj) => acc + obj.track.duration_ms,
      0
    );
    return totalDuration;
  }

  function formatPlaylistDuration(duration) {
    if (!duration) return;

    const timeDetails = millisToMinutesAndSeconds(duration);
    let res = `${timeDetails.hours ? timeDetails.hours + " hr" : ""} `;
    res += `${timeDetails.minutes} min`;
    res += `${!timeDetails.hours ? timeDetails.seconds + " sec" : ""} `;

    return res;
  }

  function formatDateAdded(datetime) {
    if (!datetime) return;

    const date = new Date(datetime.split("T")[0]);
    const dateDifference = Math.floor(
      (Date.now() - date) / (1000 * 60 * 60 * 24)
    );

    const monthDifference = Math.floor(dateDifference / 30);
    const yearDifference = Math.floor(monthDifference / 12);

    if (yearDifference) {
      return `${yearDifference > 1 ? yearDifference + "years" : "a year"} ago`;
    } else if (monthDifference) {
      return `${
        monthDifference > 1 ? monthDifference + " months" : "a month"
      } ago`;
    } else {
      return `${dateDifference > 1 ? dateDifference + " days" : "a day"} ago`;
    }
  }

  function formatFollowers(total) {
    if (!total) return;

    let arr = [];
    while (total) {
      arr.push(total % 1000);
      total = Math.floor(total / 1000);
    }
    return arr.reverse().join(",");
  }

  useEffect(() => {
    async function requestPlaylist() {
      console.log("requesting playlist with id: ", playlistId.id);
      try {
        const { data } = await axios.get(
          `https://api.spotify.com/v1/playlists/${playlistId.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPlaylist(data);
      } catch (err) {
        console.log("error fetching playlist id: ", playlistId);
      }
    }

    if (playlist?.id !== playlistId.id) {
      requestPlaylist();
    }
  }, [playlist, playlistId, token]);

  return (
    playlist && (
      <>
        <div className='w-full flex gap-2'>
          <div className='w-[30%] max-w-fit min-w-36'>
            <img
              className='max-w-full max-h-full rounded-md shadow-md'
              src={playlist.images[0].url}
            ></img>
          </div>
          <div className='flex flex-col justify-end text-sm gap-2'>
            <div className=''>
              {playlist.public ? "Public" : "Private"} Playlist
            </div>
            <div className='font-bold sm:text-2xl md:text-6xl lg:text-8xl text-nowrap'>
              {playlist.name}
            </div>
            <div className='text-gray-400'>{playlist.description}</div>
            <div className='flex text-gray-400'>
              <div className='font-bold text-white'>
                {playlist.owner.display_name}
              </div>
              <div className='mx-1'>&#xb7;</div>
              {playlist.followers && playlist.followers.total !== 0 && (
                <>
                  <div className=''>
                    {formatFollowers(playlist.followers.total)} likes
                  </div>
                  <div className='mx-1'>&#xb7;</div>
                </>
              )}
              <div className=''>
                {playlist.tracks.total} songs,{" "}
                {formatPlaylistDuration(
                  calculateDuration(playlist.tracks.items)
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='flex mt-4'>
          <Button className='p-3'>
            <FiPlay className='text-xl'></FiPlay>
          </Button>
        </div>
        <table className='table-fixed w-full text-sm text-gray-400'>
          <thead className='border-b'>
            <tr className='text-left'>
              <th className='text-right pr-3 font-normal w-8'>#</th>
              <th className='font-normal w-1/3'>Title</th>
              <th className='font-normal w-1/3'>Album</th>
              <th className='py-1 pr-2 font-normal'>Date Added</th>
              <th className='font-normal'>Duration</th>
            </tr>
          </thead>
          <tbody>
            {playlist.tracks.items.map((item, idx) => (
              <tr
                key={item.track.id}
                className='hover:bg-slate-800'
              >
                <td className='text-right pr-3'>{idx + 1}</td>
                <td className='flex items-center py-2 gap-2'>
                  <div className='w-10 min-w-10'>
                    <img
                      className='max-w-full max-h-full rounded-md'
                      src={item.track.album.images[0].url}
                    />
                  </div>
                  <div>
                    <div className='text-white'>{item.track.name}</div>
                    <div className=''>
                      {item.track.artists
                        .map((artist) => artist.name)
                        .join(", ")}
                    </div>
                  </div>
                </td>
                <td className='text-ellipsis overflow-hidden text-nowrap'>
                  {item.track.album.name}
                </td>
                <td className='pr-2'>{formatDateAdded(item.added_at)}</td>
                <td>{formatTimeMinSecond(item.track.duration_ms)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )
  );
}

export default Playlist;
