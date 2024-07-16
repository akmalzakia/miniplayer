import { OverlayScrollbarsComponentRef } from "overlayscrollbars-react";
import { createContext } from "react";

export const ScrollbarContext = createContext<OverlayScrollbarsComponentRef<"div"> | null>(
  null
);
