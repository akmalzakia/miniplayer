import { formatTimeMinSecond } from "../utils/util";

interface Props {
  player: Spotify.Player | null;
  position: number;
  duration: number;
  className: string;
}

function ProgressBar({ player, position, duration, className }: Props) {
  function progressBarValue() {
    if (!position || !duration) return 0;
    const progress = position / duration;
    return progress * 100;
  }

  function progressToPositionMs(progress: number) {
    const position = (progress / 100) * duration;
    return position;
  }

  return (
    player && (
      <div className={`${className} flex justify-between gap-3`}>
        <div className='text-xs my-auto'>{formatTimeMinSecond(position)}</div>
        <input
          type='range'
          className='flex-1 bg-gray-700 rounded-lg'
          value={progressBarValue()}
          onChange={(e) => {
            const pos = progressToPositionMs(parseInt(e.target.value));
            player?.seek(pos);
          }}
        ></input>
        <div className='text-xs my-auto'>{formatTimeMinSecond(duration)}</div>
      </div>
    )
  );
}

export default ProgressBar;
