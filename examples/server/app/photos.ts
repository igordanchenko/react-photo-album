import type { Photo } from "react-photo-album";

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

function imageLink(path: string, width: number, height: number, size: number, extension: string) {
  return `https://images.react-photo-album.com/hiking/${path}.${width}x${height}.${size}w.${extension}`;
}

const photos = [
  { src: "image01.0822d131.2400x1734.jpg", alt: "Hiking boots" },
  { src: "image02.7561b5a4.2400x3600.jpg", alt: "Purple petaled flowers near a mountain" },
  { src: "image03.334d8e07.2400x1600.jpg", alt: "A person pointing at a beige map" },
  { src: "image04.635260bf.2400x1601.jpg", alt: "Two hikers walking toward a snow-covered mountain" },
  { src: "image05.9962a853.2400x3600.jpg", alt: "A silver and black coffee mug on a brown wooden table" },
  { src: "image06.607b0ab6.2400x1349.jpg", alt: "A worm's eye view of trees at night" },
  { src: "image07.7a68edb7.2400x1350.jpg", alt: "A pine tree forest near a mountain at sunset" },
  { src: "image08.2c9f5784.2400x1600.jpg", alt: "Silhouette photo of three hikers near tall trees" },
  { src: "image09.6a8477e9.2400x3443.jpg", alt: "A person sitting near a bonfire surrounded by trees" },
  { src: "image10.5536924a.2400x1600.jpg", alt: "Green moss on gray rocks in a river" },
  { src: "image11.fddf96d5.2400x1543.jpg", alt: "Landscape photography of mountains" },
  { src: "image12.761f839b.2400x3600.jpg", alt: "A pathway between green trees during daytime" },
  {
    src: "image13.5f09a6e5.2400x1600.jpg",
    alt: "A man wearing a black jacket and backpack standing on a grass field during sunset",
  },
  { src: "image14.0341af8e.2400x3200.jpg", alt: "Green pine trees under white clouds during the daytime" },
  { src: "image15.6a693017.2400x3600.jpg", alt: "A hiker sitting near the cliff" },
  { src: "image16.38feb9dc.2400x1800.jpg", alt: "A tall mountain with a waterfall running down its side" },
  { src: "image17.5010dd5c.2400x1322.jpg", alt: "Blue mountains" },
  {
    src: "image18.f533ed48.2400x356.jpg",
    alt: "Green trees on a brown mountain under a blue sky during the daytime",
  },
  { src: "image19.7afeb6fd.2400x1800.jpg", alt: "A red flower on a green grass field during the daytime" },
  { src: "image20.027297a5.2400x1600.jpg", alt: "A sign warning people not to disturb nature" },
  { src: "image21.3b170653.2400x3200.jpg", alt: "A small creek in Yosemite National Park" },
].map(({ src, ...rest }) => {
  const matcher = src.match(/^(.*)\.(\d+)x(\d+)\.(.*)$/)!;

  const path = matcher[1];
  const width = Number.parseInt(matcher[2], 10);
  const height = Number.parseInt(matcher[3], 10);
  const extension = matcher[4];

  return {
    src: imageLink(path, width, height, width, extension),
    width,
    height,
    srcSet: breakpoints.map((breakpoint) => ({
      src: imageLink(path, width, height, breakpoint, extension),
      width: breakpoint,
      height: Math.round((height / width) * breakpoint),
    })),
    ...rest,
  } as Photo;
});

export default photos;
