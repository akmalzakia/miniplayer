import { FiVolume, FiVolume1, FiVolume2, FiVolumeX } from "react-icons/fi";

interface Props {
  onVolumeChanged(e: React.ChangeEvent<HTMLInputElement>): void;
  value: number;
}

function VolumeBar({ onVolumeChanged, value }: Props) {
  return (
    <div className='flex gap-1 items-center text-xl'>
      {value > 60 ? (
        <FiVolume2></FiVolume2>
      ) : value > 15 ? (
        <FiVolume1></FiVolume1>
      ) : value === 0 ? (
        <FiVolumeX></FiVolumeX>
      ) : (
        <FiVolume></FiVolume>
      )}
      <input
        type='range'
        className='max-w-[40%] min-w-12 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
        onChange={(e) => {
          onVolumeChanged(e);
        }}
        value={value}
      />
    </div>
  );
}

export default VolumeBar;
