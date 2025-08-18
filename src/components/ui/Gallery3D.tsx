import React from 'react';

const Gallery3D: React.FC = () => {
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
      src: "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?q=80&w=2070&auto=format&fit=crop",
      alt: "Data Pipeline Architecture"
    },
    {
      src: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop",
      alt: "Containerization"
    },
    {
      src: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop",
      alt: "DevOps Culture"
    },
    {
      src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
      alt: "Data Science"
    },
  ];

  return (
    <div className="gallery-3d-wrapper">
      <div className="gallery-3d-items">
        {images.map((image, index) => (
          <div
            key={index}
            className="gallery-3d-item"
            tabIndex={0}
            style={{
              backgroundImage: `url(${image.src})`,
            }}
            aria-label={image.alt}
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery3D;