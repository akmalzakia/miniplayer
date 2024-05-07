function Button({ onClick, children }) {
  return (
    <button
      className='inline-block text-white p-2 rounded-full border border-solid border-[#18ab29] no-underline bg-spotify-green'
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
