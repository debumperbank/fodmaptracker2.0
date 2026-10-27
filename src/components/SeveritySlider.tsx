"use client";

import { useState } from "react";

export function SeveritySlider({ defaultValue = 3 }: { defaultValue?: number }) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <input
        className="range"
        id="severity"
        name="severity"
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(event) => setValue(Number(event.currentTarget.value))}
        aria-label="Ernst van de klacht"
      />
      <output className="pill" htmlFor="severity" aria-label={`Gekozen ernst: ${value} van 10`}>
        {value}/10
      </output>
    </div>
  );
}
