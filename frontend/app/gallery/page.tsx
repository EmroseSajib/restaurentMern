// components/RestaurantGallery.jsx
"use client";

import { Gift } from "lucide-react";
import { useState } from "react";

const photos = [
  {
    src: "/butter-chicken-indian-dish-creamy-tomato.jpg",
    alt: "Signature curry served with basmati rice",
    label: "Signature Curry",
    type: "Dish",
  },
  {
    src: "/butter-chicken-indian-dish-creamy-tomato.jpg",
    alt: "Tandoori grilled platter",
    label: "Tandoori Platter",
    type: "Grill",
  },
  {
    src: "/butter-chicken-indian-dish-creamy-tomato.jpg",
    alt: "Cozy interior of De Kleine Man",
    label: "Cozy Interior",
    type: "Ambience",
  },
  {
    src: "/butter-chicken-indian-dish-creamy-tomato.jpg",
    alt: "Selection of vegetarian Indian dishes",
    label: "Veg Selection",
    type: "Vegetarian",
  },
  {
    src: "/butter-chicken-indian-dish-creamy-tomato.jpg",
    alt: "Table setup with warm lighting",
    label: "Table Setup",
    type: "Dining",
  },
  {
    src: "/butter-chicken-indian-dish-creamy-tomato.jpg",
    alt: "Chef preparing Indian food in the kitchen",
    label: "In the Kitchen",
    type: "Behind the scenes",
  },
];

export default function RestaurantGallery() {
  const [active, setActive] = useState(photos[0]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-24 lg:pt-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-orange-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Gift className="h-16 w-16 mx-auto mb-4 text-amber-300" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
          {/* <p className="text-xl text-amber-100/80">{t.giftVoucher.subtitle}</p> */}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <section className="flex justify-center items-center" id="gallery">
          <h2 className="font-semibold md:text-4xl">Page Not Found</h2>
        </section>
      </div>
    </div>
  );
}
