import { memo } from "react";
import { CollectionType } from "../../../../utils/enums";
import { isPlaylistTrack } from "../../../../utils/matchers";
import TrackItem from "./TrackItem";
import { v4 as uuidv4 } from "uuid";

interface Props {
  type?: CollectionType;
  collectionUri?: string;
  tracks: SpotifyApi.PlaylistTrackObject[] | SpotifyApi.TrackObjectSimplified[];
  matchContext?: boolean;
}

const TrackList = memo(function TrackList({
  type,
  tracks,
  collectionUri,
  matchContext,
}: Props) {
  return (
    <div className='px-4'>
      <table className='table-fixed w-full text-sm text-spotify-gray'>
        <thead className='border-b border-gray-500'>
          <tr className='text-left'>
            <th className='text-right pr-3 font-normal w-8'>#</th>
            <th className='font-normal'>Title</th>
            {type !== CollectionType.Album && (
              <>
                <th className='font-normal w-1/3'>Album</th>
                {type === CollectionType.Playlist && (
                  <th className='py-1 pr-2 font-normal w-32'>Date Added</th>
                )}
              </>
            )}
            <th className='font-normal w-20'>Duration</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((item, idx) => (
            <TrackItem
              key={`${
                isPlaylistTrack(item) ? item.track?.id : item.id
              }-${uuidv4()}`}
              idx={idx}
              collectionUri={collectionUri}
              item={item}
              matchContext={matchContext}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default TrackList;
