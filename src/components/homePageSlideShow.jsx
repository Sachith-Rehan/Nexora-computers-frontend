import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function HomeSlideShow() {
      const images = [
            "nexora-banner-03-premium-computing.svg",
            "asus-geforce-rtx40-super-series.jpg",
            "nexora-banner-01-power-your-next-setup.svg",
            "best-power-supplies-for-your-geforce-rtx-40-build.jpg",
            "rog-matrix-rtx-4090.jpg"
      ]
      const [currentIndex, setCurrentIndex] = useState(0);
      const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
      const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

      useEffect(() => {
            const interval = setInterval(() => {
                  setCurrentIndex((prev) => (prev + 1) % images.length);
            }, 5000);

            return () => clearInterval(interval)
      },[images.length])

      if(images.length == 0){
            return <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">No Images</div>;
      }

      return (
            <>
            <div className="relative w-full h-[300px] md:h-[450px] lg:h-[550px] overflow-hidden group bg-gray-900">
                  
                  {images.map((img, index) => (
                        <div key={index} className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
                        {/* object-cover ensures the image fills the wide banner space */}
                        <img src={img} alt={`Banner ${index}`} className="w-full h-full object-cover" />
                        </div>
                  ))}
                  
                  {/* Controls will go here */}
                  <button onClick={prevSlide} className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-gray-900 flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg">
                        <FiChevronLeft size={24} />
                  </button>

                  <button onClick={nextSlide} className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-gray-900 flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg">
                        <FiChevronRight size={24} />
                  </button>

                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                        {images.map((_, index) => (
                              <button 
                                    key={index} 
                                    onClick={() => setCurrentIndex(index)} 
                                    className={`rounded-full transition-all duration-300 ${index === currentIndex ? "w-8 h-2.5 bg-accent" : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"}`} 
                              />
                        ))}
                  </div>

            </div>
            
            </>
      );   

}