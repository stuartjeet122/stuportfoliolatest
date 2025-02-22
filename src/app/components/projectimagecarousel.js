import Image from 'next/image';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const ImageCarousel = ({ images }) => {
  const settings = {
    dots: true,
    infinite: images.length > 1,
    speed: 1700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Automatically play the slider
    autoplaySpeed: 3000, // Time between slides
    fade: true, // Fade transition effect
  };

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-2xl overflow-hidden">
      {images.length > 0 ? (
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index} className="relative">
              <Image 
                src={image.secure_url} 
                alt={`Project Image ${index + 1}`} 
                width={600} 
                height={400} 
                layout="responsive" // Ensures responsive scaling
                className="transition-transform duration-700 transform rounded-lg shadow-lg hover:scale-105" // Slight scale effect on hover
              />
            </div>
          ))}
        </Slider>
      ) : (
        ''
      )}
    </div>
  );
};

export default ImageCarousel;
