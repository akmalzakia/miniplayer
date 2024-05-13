function Button({ onClick, children, className }) {

  return (
    <button
      className={`text-white p-2 rounded-full border border-solid no-underline bg-spotify-green ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
