import { NavLink } from "react-router-dom";

interface FilterTagsProps {
  type: "All" | "Songs" | "Artists" | "Playlists" | "Albums";
  link: string;
}

function FilterTags({ type, link }: FilterTagsProps) {
  return (
    <NavLink
      to={link}
      className={({ isActive }) =>
        `px-3.5 py-1.5 rounded-full ${
          isActive ? "bg-white text-black" : "bg-[#2a2a2a] text-white"
        }`
      }
      end
    >
      <span>{type}</span>
    </NavLink>
  );
}

export default FilterTags;
