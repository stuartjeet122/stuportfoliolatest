import { useState, useEffect } from 'react';
import { FaUpload, FaTrash } from 'react-icons/fa'; // Import FaTrash for the remove button
import { toast } from 'react-hot-toast';
import AddCarouselImageModal from './addcarouselimgdialog';
import ImageCarousel from './projectimagecarousel';
import { fetchCarouselImagesByProjectId, removeCarouselImage } from './projectfirebase'; // Adjust the import based on your file structure
import Image from 'next/image';
const CarouselImageManager = ({ projectId }) => {
  const [loading, setLoading] = useState(false);
  const [carouselImages, setCarouselImages] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchCarouselImages = async () => {
      setError(null);
      try {
        setLoading(true);
        const data = await fetchCarouselImagesByProjectId(projectId);
        setCarouselImages(data || []);
      } catch (error) {
        console.error('Error fetching carousel images:', error);
        setError('Failed to load carousel images');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchCarouselImages();
  }, [projectId, refresh]);

  const handleRemoveImage = async (imageId, projectId) => {
  
    try {
      const response = await fetch('/api/removecarouselimg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId, imageId }),
      });
  
      const result = await response.json();  // Parse the JSON response
  
      if (response.ok) {
        toast.success(result.message || 'Image deleted successfully');
        setRefresh(prev => !prev); // Refresh image list
      } else {
        toast.error(result.message || 'Failed to remove image.');
      }
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image.');
    }
  };
  
  
  
  

  return (
    <div className="bg-gray-900 bg-opacity-50 container mx-auto backdrop-blur-sm p-6">
      <div className="my-5 text-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Carousel Images
        </button>
      </div>

      {carouselImages.length > 0 ? (
        <div className="flex flex-col items-center space-y-4">
          <ImageCarousel images={carouselImages.map((img) => img.secure_url)} />
          <div className="flex flex-wrap gap-4">
            {carouselImages.map((image) => (
              <div key={image.id} className="relative group">
                <Image height={1500} width={1500} src={image.secure_url} alt="carousel" className="w-32 h-32 object-cover rounded" />
                <button
                  onClick={() => handleRemoveImage(image.id,projectId)}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-center">No carousel images available</div>
      )}

      <AddCarouselImageModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={projectId}
        setRefresh={setRefresh}
      />
    </div>
  );
};

export default CarouselImageManager;
