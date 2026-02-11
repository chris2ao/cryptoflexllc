import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CryptoFlex LLC | Chris Johnson",
    short_name: "CryptoFlex",
    description:
      "Personal tech blog and portfolio of Chris Johnson — veteran, engineer, and cybersecurity professional.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f12",
    theme_color: "#0f0f12",
    icons: [
      {
        src: "/CFLogo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
