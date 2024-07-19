import type { Photo } from "react-photo-album";

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

function assetLink(asset: string, width: number) {
  return `https://assets.react-photo-album.com/_next/image?url=${encodeURIComponent(`/_next/static/media/${asset}`)}&w=${width}&q=75`;
}

const photos = [
  {
    asset: "image01.018d1d35.jpg",
    width: 1080,
    height: 780,
    alt: "Hiking boots",
  },
  {
    asset: "image02.cf33eff7.jpg",
    width: 1080,
    height: 1620,
    alt: "Purple petaled flowers near a mountain",
  },
  {
    asset: "image03.cdc32b45.jpg",
    width: 1080,
    height: 720,
    alt: "A person pointing at a beige map",
  },
  {
    asset: "image04.9a1f6335.jpg",
    width: 1080,
    height: 720,
    alt: "Two hikers walking toward a snow-covered mountain",
  },
  {
    asset: "image05.d7ef12b4.jpg",
    width: 1080,
    height: 1620,
    alt: "A silver and black coffee mug on a brown wooden table",
  },
  {
    asset: "image06.4ab952e3.jpg",
    width: 1080,
    height: 607,
    alt: "A worm's eye view of trees at night",
  },
  {
    asset: "image07.ac608196.jpg",
    width: 1080,
    height: 608,
    alt: "A pine tree forest near a mountain at sunset",
  },
  {
    asset: "image08.95e095b5.jpg",
    width: 1080,
    height: 720,
    alt: "Silhouette photo of three hikers near tall trees",
  },
  {
    asset: "image09.fa6c4764.jpg",
    width: 1080,
    height: 1549,
    alt: "A person sitting near a bonfire surrounded by trees",
  },
  {
    asset: "image10.411ea655.jpg",
    width: 1080,
    height: 720,
    alt: "Green moss on gray rocks in a river",
  },
  {
    asset: "image11.f3ea483a.jpg",
    width: 1080,
    height: 694,
    alt: "Landscape photography of mountains",
  },
  {
    asset: "image12.5a9347ea.jpg",
    width: 1080,
    height: 1620,
    alt: "A pathway between green trees during daytime",
  },
  {
    asset: "image13.ce46dd98.jpg",
    width: 1080,
    height: 720,
    alt: "A man wearing a black jacket and backpack standing on a grass field during sunset",
  },
  {
    asset: "image14.68b2812c.jpg",
    width: 1080,
    height: 1440,
    alt: "Green pine trees under white clouds during the daytime",
  },
  {
    asset: "image15.4461facf.jpg",
    width: 1080,
    height: 1620,
    alt: "A hiker sitting near the cliff",
  },
  {
    asset: "image16.5ad17d8b.jpg",
    width: 1080,
    height: 810,
    alt: "A tall mountain with a waterfall running down its side",
  },
  {
    asset: "image17.a242e897.jpg",
    width: 1080,
    height: 595,
    alt: "Blue mountains",
  },
  {
    asset: "image18.0479bde8.jpg",
    width: 1080,
    height: 160,
    alt: "Green trees on a brown mountain under a blue sky during the daytime",
  },
  {
    asset: "image19.ab7b61f4.jpg",
    width: 1080,
    height: 810,
    alt: "A red flower on a green grass field during the daytime",
  },
  {
    asset: "image20.f62571df.jpg",
    width: 1080,
    height: 720,
    alt: "A sign warning people not to disturb nature",
  },
  {
    asset: "image21.14c9bee0.jpg",
    width: 1080,
    height: 1440,
    alt: "A small creek in Yosemite National Park",
  },
  {
    asset: "image01.018d1d35.jpg",
    width: 1080,
    height: 780,
    alt: "Hiking boots",
  },
  {
    asset: "image02.cf33eff7.jpg",
    width: 1080,
    height: 1620,
    alt: "Purple petaled flowers near a mountain",
  },
  {
    asset: "image03.cdc32b45.jpg",
    width: 1080,
    height: 720,
    alt: "A person pointing at a beige map",
  },
  {
    asset: "image04.9a1f6335.jpg",
    width: 1080,
    height: 720,
    alt: "Two hikers walking toward a snow-covered mountain",
  },
  {
    asset: "image05.d7ef12b4.jpg",
    width: 1080,
    height: 1620,
    alt: "A silver and black coffee mug on a brown wooden table",
  },
  {
    asset: "image06.4ab952e3.jpg",
    width: 1080,
    height: 607,
    alt: "A worm's eye view of trees at night",
  },
  {
    asset: "image07.ac608196.jpg",
    width: 1080,
    height: 608,
    alt: "A pine tree forest near a mountain at sunset",
  },
  {
    asset: "image08.95e095b5.jpg",
    width: 1080,
    height: 720,
    alt: "Silhouette photo of three hikers near tall trees",
  },
  {
    asset: "image09.fa6c4764.jpg",
    width: 1080,
    height: 1549,
    alt: "A person sitting near a bonfire surrounded by trees",
  },
  {
    asset: "image10.411ea655.jpg",
    width: 1080,
    height: 720,
    alt: "Green moss on gray rocks in a river",
  },
  {
    asset: "image11.f3ea483a.jpg",
    width: 1080,
    height: 694,
    alt: "Landscape photography of mountains",
  },
  {
    asset: "image12.5a9347ea.jpg",
    width: 1080,
    height: 1620,
    alt: "A pathway between green trees during daytime",
  },
  {
    asset: "image13.ce46dd98.jpg",
    width: 1080,
    height: 720,
    alt: "A man wearing a black jacket and backpack standing on a grass field during sunset",
  },
  {
    asset: "image14.68b2812c.jpg",
    width: 1080,
    height: 1440,
    alt: "Green pine trees under white clouds during the daytime",
  },
  {
    asset: "image15.4461facf.jpg",
    width: 1080,
    height: 1620,
    alt: "A hiker sitting near the cliff",
  },
  {
    asset: "image16.5ad17d8b.jpg",
    width: 1080,
    height: 810,
    alt: "A tall mountain with a waterfall running down its side",
  },
  {
    asset: "image17.a242e897.jpg",
    width: 1080,
    height: 595,
    alt: "Blue mountains",
  },
  {
    asset: "image18.0479bde8.jpg",
    width: 1080,
    height: 160,
    alt: "Green trees on a brown mountain under a blue sky during the daytime",
  },
  {
    asset: "image19.ab7b61f4.jpg",
    width: 1080,
    height: 810,
    alt: "A red flower on a green grass field during the daytime",
  },
  {
    asset: "image20.f62571df.jpg",
    width: 1080,
    height: 720,
    alt: "A sign warning people not to disturb nature",
  },
  {
    asset: "image21.14c9bee0.jpg",
    width: 1080,
    height: 1440,
    alt: "A small creek in Yosemite National Park",
  },
].map(
  ({ asset, alt, width, height }) =>
    ({
      src: assetLink(asset, width),
      alt,
      width,
      height,
      srcSet: breakpoints.map((breakpoint) => ({
        src: assetLink(asset, breakpoint),
        width: breakpoint,
        height: Math.round((height / width) * breakpoint),
      })),
    }) as Photo,
);

export default photos;
