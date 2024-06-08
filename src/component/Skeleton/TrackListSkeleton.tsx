import { CollectionType } from "../../utils/enums";
import DivSkeleton from "./DivSkeleton";
import ImageSkeleton from "./ImageSkeleton";

interface Props {
  type: CollectionType;
}

function TrackListSkeleton({ type }: Props) {
  return (
    <div className='pr-4'>
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
          {[...new Array(6)].map((item, idx) => (
            <tr
              key={idx}
              className={`hover:bg-spotify-hover`}
            >
              <td className={`text-right rounded-l-md`}>
                <div className='pr-3'>{idx + 1}</div>
              </td>
              <td className='flex items-center py-2 gap-2'>
                {type === CollectionType.Playlist && (
                  <div className='w-10 min-w-10'>
                    <ImageSkeleton className='max-w-full max-h-full rounded-md' />
                  </div>
                )}
                <div className='flex-1'>
                  <DivSkeleton className='w-2/3 h-4 mb-1 rounded-lg' />
                  <DivSkeleton className='w-1/5 h-4 rounded-lg' />
                </div>
              </td>
              {type === CollectionType.Playlist && (
                <>
                  <td className='text-ellipsis overflow-hidden text-nowrap'>
                    <DivSkeleton className='w-2/3 h-4 rounded-lg' />
                  </td>
                  <td className='pr-2'>
                    <DivSkeleton className='w-2/3 h-4 rounded-lg' />
                  </td>
                </>
              )}
              <td className='rounded-r-md'>
                <DivSkeleton className='w-2/3 h-4 rounded-lg' />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TrackListSkeleton;
