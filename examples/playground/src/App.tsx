import * as React from "react";
import Box from "@mui/material/Box";
import { PhotoAlbum, RenderPhotoProps } from "react-photo-album";

import Settings, { useSettings } from "./Settings";

function Playground() {
  const { photos, layout, columns, targetRowHeight, spacing, padding, width } = useSettings();

  const renderPhoto = React.useCallback(
    ({ imageProps: { alt, style, ...rest } }: RenderPhotoProps) => (
      <img
        alt={alt}
        style={{
          ...style,
          borderRadius: padding > 2 ? "4px" : 0,
          boxShadow:
            spacing > 0
              ? "0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)"
              : "none",
          transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        }}
        {...rest}
      />
    ),
    [spacing, padding],
  );

  return (
    <Box sx={{ width: `${width}%`, mx: "auto" }}>
      <PhotoAlbum
        photos={photos}
        layout={layout}
        columns={columns}
        spacing={spacing}
        padding={padding}
        targetRowHeight={targetRowHeight}
        renderPhoto={renderPhoto}
      />
    </Box>
  );
}

export default function App() {
  return (
    <Settings>
      <Playground />
    </Settings>
  );
}
