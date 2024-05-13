import { formatTimeMinSecond } from "../utils/util";

function ProgressBar({ player, position, duration, className }) {
  function progressBarValue() {
    const progress = position / duration;
    return progress * 100;
  }

  function progressToPositionMs(progress) {
    const position = (progress / 100) * duration;
    return position;
  }


  return (
    <div className={`${className} flex justify-between gap-3`}>
      <div className='text-xs my-auto'>
        {formatTimeMinSecond(position)}
      </div>
      <input
        type='range'
        className='flex-1 bg-gray-700 rounded-lg'
        value={progressBarValue()}
        onChange={(e) => {
          const pos = progressToPositionMs(e.target.value);
          player.seek(pos);
        }}
      ></input>
      <div className='text-xs my-auto'>
        {formatTimeMinSecond(duration)}
      </div>
    </div>
  );
}

export default ProgressBar;
