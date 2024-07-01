import type React from "react";
import { useState } from "react";

import { ColumnsExample, MasonryExample, RowsExample } from "./components";
import "./App.css";

type LayoutType = "rows" | "columns" | "masonry";

export default function App() {
  const [layout, setLayout] = useState<LayoutType>("rows");
  const [batchSize, setBatchSize] = useState(20);
  const [maxBatches, setMaxBatches] = useState(0);
  const [fetchDelay, setFetchDelay] = useState(300);

  const settings = { batchSize, maxBatches, fetchDelay };

  let Example: React.ElementType | null = null;
  if (layout === "rows") Example = RowsExample;
  if (layout === "columns") Example = ColumnsExample;
  if (layout === "masonry") Example = MasonryExample;

  return (
    <>
      <div className="settings">
        <label htmlFor="layout">Layout:</label>
        <select id="layout" value={layout} onChange={(event) => setLayout(event.target.value as LayoutType)}>
          {["rows", "columns", "masonry"].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <label htmlFor="batchSize">Batch size:</label>
        <select
          id="batchSize"
          value={batchSize}
          onChange={(event) => setBatchSize(Number.parseInt(event.target.value))}
        >
          {[5, 10, 15, 20].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <label htmlFor="maxBatches">Max batches:</label>
        <select
          id="maxBatches"
          value={maxBatches}
          onChange={(event) => setMaxBatches(Number.parseInt(event.target.value))}
        >
          {[0, 10, 50, 100, 200].map((size) => (
            <option key={size} value={size}>
              {size > 0 ? size : "Infinite"}
            </option>
          ))}
        </select>

        <label htmlFor="fetchDelay">Fetch delay:</label>
        <select
          id="fetchDelay"
          value={fetchDelay}
          onChange={(event) => setFetchDelay(Number.parseInt(event.target.value))}
        >
          {[0, 300, 500, 1000, 2000, 3000, 5000].map((delay) => (
            <option key={delay} value={delay}>
              {delay}
            </option>
          ))}
        </select>
      </div>

      {Example && <Example key={JSON.stringify(settings)} {...settings} />}
    </>
  );
}
