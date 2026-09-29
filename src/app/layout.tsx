
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CropSense | Crop Health Intelligence",
  description:
    "Investigate crop stress using images, weather and field observations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}