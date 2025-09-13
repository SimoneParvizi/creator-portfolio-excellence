import React, { useState } from 'react';

const Gallery3D: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const images = [
    {
      src: "/lovable-uploads/i_came_from_abruzzo.png",
      alt: "Abruzzo Heritage"
    },
    {
      src: "/lovable-uploads/fav_place_is_petralia.png", 
      alt: "Favorite Place"
    },
    {
      src: "/lovable-uploads/i_love_kickbox.png",
      alt: "Kickboxing"
    },
    {
      src: "/lovable-uploads/i_am_an_uncle.png",
      alt: "Uncle"
    },
    {
      src: "/lovable-uploads/love_for_ancient_civilization.png",
      alt: "Ancient Civilizations"
    },
    {
      src: "/lovable-uploads/fav_city.png",
      alt: "Favorite City"
    },
    {
      src: "/lovable-uploads/dream_house_future.png",
      alt: "Dream House Future"
    },
    {
      src: "/lovable-uploads/fav_painting.png",
      alt: "Favorite Painting"
    },
    {
      src: "/lovable-uploads/i_want_to_go_egypt.png",
      alt: "Egypt Travel Dream"
    },
  ];

  const handleImageClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
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
            onClick={() => handleImageClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery3D;