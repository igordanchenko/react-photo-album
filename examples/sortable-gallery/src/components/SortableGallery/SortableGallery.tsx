import { ComponentProps, ComponentType, JSX, useRef, useState } from "react";
import { ColumnsPhotoAlbumProps, MasonryPhotoAlbumProps, Photo, RowsPhotoAlbumProps } from "react-photo-album";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import Sortable from "./Sortable";
import Overlay from "./Overlay";

import classes from "./SortableGallery.module.css";

type SortablePhoto<TPhoto extends Photo> = TPhoto & {
  id: string;
};

type ActivePhoto<TPhoto extends Photo> = {
  photo: SortablePhoto<TPhoto>;
  width: number;
  height: number;
  padding?: string;
};

type GalleryProps<TPhoto extends Photo> = {
  rows: RowsPhotoAlbumProps<TPhoto>;
  columns: ColumnsPhotoAlbumProps<TPhoto>;
  masonry: MasonryPhotoAlbumProps<TPhoto>;
};

type SortableGalleryProps<
  TPhoto extends Photo,
  TGalleryType extends keyof GalleryProps<TPhoto>,
> = GalleryProps<TPhoto>[TGalleryType] & {
  gallery: ComponentType<GalleryProps<TPhoto>[TGalleryType]>;
  movePhoto: (oldIndex: number, newIndex: number) => void;
};

export default function SortableGallery<TPhoto extends Photo, TGalleryType extends keyof GalleryProps<TPhoto>>({
  gallery: Gallery,
  photos: photoSet,
  movePhoto,
  render,
  ...rest
}: SortableGalleryProps<TPhoto, TGalleryType>) {
  const ref = useRef<HTMLDivElement>(null);
  const [activePhoto, setActivePhoto] = useState<ActivePhoto<TPhoto>>();

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 10 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const photos = photoSet.map((photo) => ({ ...photo, id: photo.key ?? photo.src }));

  const handleDragStart = ({ active }: DragStartEvent) => {
    const photo = photos.find((item) => item.id === active.id);

    const image = ref.current?.querySelector(`img[src="${photo?.src}"]`);
    const padding = image?.parentElement ? getComputedStyle(image.parentElement).padding : undefined;
    const { width, height } = image?.getBoundingClientRect() || {};

    if (photo !== undefined && width !== undefined && height !== undefined) {
      setActivePhoto({ photo, width, height, padding });
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      movePhoto(
        photos.findIndex((photo) => photo.id === active.id),
        photos.findIndex((photo) => photo.id === over.id),
      );
    }

    setActivePhoto(undefined);
  };

  const renderSortable = <T extends keyof Pick<JSX.IntrinsicElements, "div" | "button" | "a">>(
    Component: T,
    index: number,
    photo: TPhoto,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props: ComponentProps<any>,
  ) => (
    <Sortable key={index} id={(photo as SortablePhoto<TPhoto>).id}>
      <Component {...props} />
    </Sortable>
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      collisionDetection={closestCenter}
    >
      <SortableContext items={photos}>
        <div className={classes.gallery}>
          <Gallery
            ref={ref}
            photos={photos}
            render={{
              ...render,
              link: (props, { index, photo }) => renderSortable("a", index, photo, props),
              wrapper: (props, { index, photo }) => renderSortable("div", index, photo, props),
              button: (props, { index, photo }) => renderSortable("button", index, photo, props),
            }}
            {...rest}
          />
        </div>
      </SortableContext>

      <DragOverlay>{activePhoto && <Overlay className={classes.overlay} {...activePhoto} />}</DragOverlay>
    </DndContext>
  );
}
