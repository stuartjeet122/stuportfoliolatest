import { useState } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Image from 'next/image';
const Videos = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [open, setOpen] = useState(false);

  // If there are no videos, return null (do not render anything)
  if (!videos || videos.length === 0) {
    return null;
  }

  const handleVideoClick = (video) => {
    video = video.url;
    let videoId;

    // Check if the video URL is from 'youtu.be'
    if (video.includes('youtu.be')) {
      videoId = video.split('youtu.be/')[1]?.split('?')[0];
    } else {
      videoId = video.split('v=')[1]?.split('&')[0];
    }

    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      setSelectedVideo(embedUrl);
      setOpen(true);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedVideo(null);
    document.body.style.overflow = 'auto'; // Re-enable background scrolling
  };

  const handleBackdropClick = (e) => {
    // Close the modal only if the backdrop (not the modal content) is clicked
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <div className="bg-gray-900 bg-opacity-80 p-6 rounded-lg shadow-lg my-8 mx-auto max-w-6xl backdrop-blur-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((video, index) => {
          let videoId;
          // Extract thumbnail URL
          if (video.url.includes('youtu.be')) {
            videoId = video.url.split('youtu.be/')[1]?.split('?')[0];
          } else {
            videoId = video.url.split('v=')[1]?.split('&')[0];
          }
          const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

          return (
            <div
              className="bg-gray-800 bg-opacity-80 rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer relative"
              key={index}
              onClick={() => handleVideoClick(video)}
            >
              <Image
                src={thumbnailUrl}
                alt={`Video Thumbnail ${index + 1}`}
                className="w-full h-auto"
                width={1000}
                height={1000}
              />
              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                onClick={() => handleVideoClick(video)}
              >
                <div className="bg-white rounded-full p-2">
                  <PlayArrowIcon className="text-red-500 text-6xl" />
                </div>
              </div>
              <div className="p-4">
                <h5 className="text-lg font-semibold mb-2 text-white shadow-lg">YouTube Video {index + 1}</h5>
                <button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-900 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 ease-in-out rounded-full transform hover:scale-105 shadow-lg text-white p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVideoClick(video);
                  }}
                >
                  Watch Video
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tailwind Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-70"
          onClick={handleBackdropClick} // Handle clicks on the backdrop
        >
          <div className="bg-gray-900 rounded-lg max-w-lg w-full mx-4 sm:mx-0" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-white">Watch Video</h3>
              <button onClick={handleCloseModal} className="text-white text-lg">&times;</button>
            </div>
            <div className="relative pb-9/16">
              <iframe
                className="absolute top-0 left-0 w-full h-60 sm:h-80"
                src={selectedVideo}
                title="YouTube Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="flex justify-end p-4 border-t border-gray-700">
              <button onClick={handleCloseModal} className="bg-red-600 text-white px-4 py-2 rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;
