import { useState } from "react";
import { FiImage } from "react-icons/fi";

export default function ProductImageSlideShow({ images = [], name = "Product" }) {
  const [selected, setSelected] = useState(0);

  if (!images.length) {
    return (
      <div className="flex aspect-square w-full flex-col items-center justify-center gap-3 text-zinc-400">
        <FiImage size={32} aria-hidden="true" />
        <p>No product photos available</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <div className="flex aspect-square max-h-[480px] w-full items-center justify-center overflow-hidden rounded-xl bg-white">
        <img src={images[selected]} alt={name + ", view " + (selected + 1)} className="h-full w-full object-contain p-4" />
      </div>
      {images.length > 1 && (
        <div role="group" aria-label="Product photos" className="mt-4 flex gap-2 overflow-x-auto p-1">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show photo ${index + 1} of ${images.length}`}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
              className={`size-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white focus-visible:outline-blue-400 sm:size-20 ${selected === index ? "border-blue-500" : "border-transparent"}`}
            >
              <img src={image} alt="" className="h-full w-full object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
