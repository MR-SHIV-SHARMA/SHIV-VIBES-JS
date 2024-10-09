"use client";
import React from "react";
import { HeroParallax } from "./ui/hero-parallax";

function HeroParallaxDemo() {
  return (
    <HeroParallax
      products={products.map((product) => ({ ...product, link: "/NavComponent/courses" }))}
    />
  );
}

export const products = [
  {
    title: "Moonbeam",
    thumbnail:
      "https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "Cursor",
    thumbnail:
      "https://images.pexels.com/photos/33597/guitar-classical-guitar-acoustic-guitar-electric-guitar.jpg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "Rogue",
    thumbnail:
      "https://images.pexels.com/photos/248510/pexels-photo-248510.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "Editorially",
    thumbnail:
      "https://images.pexels.com/photos/167491/pexels-photo-167491.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "Editrix AI",
    thumbnail:
      "https://images.pexels.com/photos/45243/saxophone-music-gold-gloss-45243.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "Pixel Perfect",
    thumbnail:
      "https://images.pexels.com/photos/196652/pexels-photo-196652.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "Algochurn",
    thumbnail:
      "https://images.pexels.com/photos/34221/violin-musical-instrument-music-sound.jpg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "Aceternity UI",
    thumbnail:
      "https://images.pexels.com/photos/2147029/pexels-photo-2147029.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "Tailwind Master Kit",
    thumbnail:
      "https://images.pexels.com/photos/3971985/pexels-photo-3971985.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "SmartBridge",
    thumbnail:
      "https://images.pexels.com/photos/210854/pexels-photo-210854.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "Renderwork Studio",
    thumbnail:
      "https://images.pexels.com/photos/2272854/pexels-photo-2272854.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "Creme Digital",
    thumbnail:
      "https://images.pexels.com/photos/1619779/pexels-photo-1619779.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "Golden Bells Academy",
    thumbnail:
      "https://images.pexels.com/photos/462510/pexels-photo-462510.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "Invoker Labs",
    thumbnail:
      "https://images.pexels.com/photos/2118046/pexels-photo-2118046.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "E Free Invoice",
    thumbnail:
      "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

export default HeroParallaxDemo;
