interface Props extends React.PropsWithChildren {
  onClick?(): void;
  className?: string;
}

function Button({ onClick, children, className }: Props) {
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
