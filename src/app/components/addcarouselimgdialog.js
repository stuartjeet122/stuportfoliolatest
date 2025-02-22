import { useState } from 'react';
import { toast } from 'react-hot-toast';

const AddCarouselImageModal = ({ open, onClose, projectId, setRefresh }) => {
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState([]); // Track progress for each image

  const handleAddClick = async () => {
    if (imageFiles.length === 0) {
      toast.error('Please select at least one image.');
      return;
    }

    setUploading(true);

    // Create a new progress array
    const progressArray = new Array(imageFiles.length).fill(0);
    setUploadProgress(progressArray);

    // Upload images one by one
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectId);

      const xhr = new XMLHttpRequest();

      xhr.open('POST', '/api/uploadprojectimg', true);

      // Track the upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          progressArray[i] = progress; // Update the progress for the specific image
          setUploadProgress([...progressArray]);
        }
      };

      // Handle the response after the upload is complete
      xhr.onload = () => {
        if (xhr.status === 200) {
          toast.success(`Image ${file.name} added successfully!`);
        } else {
          toast.error(`Failed to add image ${file.name}. Please try again.`);
        }
      };

      // Handle error
      xhr.onerror = () => {
        toast.error(`Failed to add image ${file.name}. Please try again.`);
      };

      xhr.send(formData);

      // Wait for the current upload to finish before starting the next
      await new Promise((resolve) => {
        xhr.onloadend = resolve;
      });
    }

    setUploading(false);
    setRefresh((prev) => !prev); // Trigger a refresh in the parent component
    onClose(); // Close the modal after all uploads
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-black bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-lg mx-4 p-8 border border-gray-700">
        <button
          className="absolute top-3 right-3 text-gray-300 hover:text-gray-100"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <h3 className="text-2xl font-semibold text-center text-white mb-4">Add Carousel Images</h3>
        <div className="space-y-4">
          <input
            type="file"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400"
            accept="image/*"
            multiple
            onChange={(e) => setImageFiles(Array.from(e.target.files))}
          />
        </div>

        {/* Progress bars */}
        <div className="space-y-2 mt-4">
          {uploadProgress.map((progress, index) => (
            <div key={index}>
              <div className="text-white mb-1">{imageFiles[index]?.name}</div>
              <div className="w-full bg-gray-600 rounded-full">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex mt-6 gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleAddClick}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Add Carousel Images'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCarouselImageModal;
