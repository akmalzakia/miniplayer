import { CollectionType } from "../../../../utils/enums";
import { isPlaylistTrack } from "../../../../utils/matchers";
import TrackItem from "./TrackItem";

interface Props {
  type: CollectionType;
  collectionUri: string;
  tracks: SpotifyApi.PlaylistTrackObject[] | SpotifyApi.TrackObjectSimplified[];
}

function TrackList({ type, tracks, collectionUri }: Props) {
  return (
    <div className='px-4'>
      <table className='table-fixed w-full text-sm text-spotify-gray'>
        <thead className='border-b border-gray-500'>
          <tr className='text-left'>
            <th className='text-right pr-3 font-normal w-8'>#</th>
            <th className='font-normal'>Title</th>
            {type === CollectionType.Playlist && (
              <>
                <th className='font-normal w-1/3'>Album</th>
                <th className='py-1 pr-2 font-normal w-32'>Date Added</th>
              </>
            )}
            <th className='font-normal w-20'>Duration</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((item, idx) => (
            <TrackItem
              key={isPlaylistTrack(item) ? item.track?.id : item.id}
              idx={idx}
              collectionUri={collectionUri}
              item={item}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TrackList;
