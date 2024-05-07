function PlaylistCard({ playlist }) {
  return (
    <div className='flex flex-col p-2 overflow-hidden hover:bg-slate-700'>
      <img
        className='w-44 h-44 '
        src={playlist.images[0].url}
      ></img>
      <div className='font-bold text-md'>{playlist.name}</div>
      <div className='font-light text-sm text-ellipsis line-clamp-2'>
        {playlist.description}
      </div>
    </div>
  );
}

export default PlaylistCard;
