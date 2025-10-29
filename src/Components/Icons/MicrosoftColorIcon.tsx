"use client";

import React from "react";

type MicrosoftColorIconProps = {
  size?: number; // total square size in px
  gap?: number; // gap between tiles in px
  className?: string;
  style?: React.CSSProperties;
  "aria-hidden"?: boolean | "true" | "false";
};

export function MicrosoftColorIcon({
  size = 24,
  gap = 2,
  className,
  style,
  "aria-hidden": ariaHidden = true,
}: MicrosoftColorIconProps) {
  const tileSize = (size - gap) / 2; // simple calc for 2x2 with gap

  return (
    <span
      aria-hidden={ariaHidden}
      className={className}
      style={{ display: "inline-grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap, width: size, height: size, ...style }}
    >
      <span style={{ width: tileSize, height: tileSize, backgroundColor: "#F25022", borderRadius: 2 }} />
      <span style={{ width: tileSize, height: tileSize, backgroundColor: "#7FBA00", borderRadius: 2 }} />
      <span style={{ width: tileSize, height: tileSize, backgroundColor: "#00A4EF", borderRadius: 2 }} />
      <span style={{ width: tileSize, height: tileSize, backgroundColor: "#FFB900", borderRadius: 2 }} />
    </span>
  );
}

export default MicrosoftColorIcon;


