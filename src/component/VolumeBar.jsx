import { FiVolume2 } from "react-icons/fi";

function VolumeBar({ onVolumeChanged, value }) {
  return (
    <div className='flex gap-1 items-center text-xl'>
      <FiVolume2></FiVolume2>
      <input
        type='range'
        className='max-w-[40%] min-w-12 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
        onInput={(e) => {
          onVolumeChanged(e);
        }}
        value={value}
      />
    </div>
  );
}

export default VolumeBar;
