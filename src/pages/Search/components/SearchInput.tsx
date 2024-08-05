import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaXmark } from "react-icons/fa6";
import utils from "../../../utils/util";

interface InputProps {
  className?: string;
  onDebouncedInput?: (input: string) => void;
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function SearchInput({ className, onDebouncedInput, onInput }: InputProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [style, setStyle] = useState({});
  const [input, setInput] = useState("");

  const isInputFilled = input.length > 0;

  useLayoutEffect(() => {
    if (!wrapperRef.current || !iconRef.current) return;
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const iconRect = iconRef.current.getBoundingClientRect();

    const iconStyle = {
      top: wrapperRect.height / 2 - iconRect.height / 2,
    };

    setStyle(iconStyle);
  }, []);

  function clearInput() {
    if (!inputRef.current) return;

    setInput("");
    inputRef.current.value = "";
  }

  const debouncedInput = useMemo(
    () =>
      utils.debounce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (input: string, onDebouncedInput: (...args: any[]) => any) => {
          onDebouncedInput?.(input);
        },
        400
      ),
    []
  );

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
    onInput?.(e);
    debouncedInput(e.target.value, onDebouncedInput);
  }

  return (
    <div
      ref={wrapperRef}
      className={`relative ${className}`}
    >
      <input
        ref={inputRef}
        type='text'
        className={`h-full w-full bg-[#2a2a2a] rounded-full text-sm py-1 px-10 placeholder:text-[#6f6f6f]`}
        placeholder='What do you want to play?'
        onChange={handleInput}
      ></input>
      <div
        ref={iconRef}
        style={style}
        className='absolute top-1/3 left-3'
      >
        <AiOutlineSearch className='text-xl' />
      </div>
      {isInputFilled && (
        <div
          style={style}
          className='absolute top-1/3 right-3'
          onClick={clearInput}
        >
          <FaXmark className='text-xl' />
        </div>
      )}
    </div>
  );
}

export default SearchInput;
