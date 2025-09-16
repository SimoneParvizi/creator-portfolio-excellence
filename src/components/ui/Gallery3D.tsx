import React, { useState } from 'react';

const Gallery3D: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const images = [
    {
      src: "/lovable-uploads/i_came_from_abruzzo.png",
      alt: "Abruzzo Heritage",
      description: "I come from this beautiful region in Italy, Abruzzo"
    },
    {
      src: "/lovable-uploads/fav_place_is_petralia.png",
      alt: "Favorite Place",
      description: "My favourite place"
    },
    {
      src: "/lovable-uploads/i_love_kickbox.png",
      alt: "Kickboxing",
      description: "I train to be a kickboxer"
    },
    {
      src: "/lovable-uploads/i_am_an_uncle.png",
      alt: "Uncle",
      description: "I'm an uncle"
    },
    {
      src: "/lovable-uploads/love_for_ancient_civilization.png",
      alt: "Ancient Civilizations",
      description: "I am fascinated by ancient civilizations"
    },
    {
      src: "/lovable-uploads/fav_city.png",
      alt: "Favorite City",
      description: "Rome is by far the most beautiful city I've seen"
    },
    {
      src: "/lovable-uploads/dream_house_future.png",
      alt: "Dream House Future",
      description: "My dream is to live in a farm house in Italy with my wife and kids"
    },
    {
      src: "/lovable-uploads/fav_painting.png",
      alt: "Favorite Painting",
      description: "\"The Fall of the Damned\". Masterpiece."
    },
    {
      src: "/lovable-uploads/i_want_to_go_egypt.png",
      alt: "Egypt Travel Dream",
      description: "Most fascinating human creation on Earth. I have to visit them"
    },
  ];

  const handleImageClick = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    // Force state update with a small delay to ensure proper re-render
    setTimeout(() => {
      setActiveIndex(current => current === index ? null : index);
    }, 0);
  };

  return (
    <div className="gallery-3d-wrapper">
      <div className="gallery-3d-items">
        {images.map((image, index) => (
          <div
            key={index}
            className={`gallery-3d-item ${activeIndex === index ? 'active' : ''}`}
            tabIndex={0}
            style={{
              backgroundImage: `url(${image.src})`,
            }}
            aria-label={image.alt}
            onClick={(e) => handleImageClick(e, index)}
            onTouchEnd={(e) => handleImageClick(e, index)}
          >
            {activeIndex === index && (
              <div
                className="absolute bottom-0 left-0 right-0 p-4 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-white text-sm font-lora italic" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)'}}>
                  {image.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery3D;