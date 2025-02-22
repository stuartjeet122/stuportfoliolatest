import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

const AddCoverImageModal = ({ open, onClose, projectId, setRefresh }) => {
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => (document.body.style.overflow = 'auto');
  }, [open]);

  const handleAddClick = async () => {
    if (!imageFile) {
      toast.error('Please select an image file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('projectId', projectId);

    setUploading(true);

    try {
      const response = await fetch('/api/uploadcoverimg', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Cover image added successfully!');
        setRefresh((prev) => !prev);
        onClose();
      } else {
        toast.error(data?.error || 'Failed to add cover image. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to add cover image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setCoverImageUrl(URL.createObjectURL(file));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="relative bg-gray-900 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-xl mx-6 p-6 border border-gray-700">
        <button
          className="absolute top-4 right-4 text-gray-300 hover:text-gray-100 text-3xl"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <h3 className="text-2xl font-semibold text-center text-white mb-6">Add Cover Image</h3>
        <div className="space-y-4">
          <input
            type="file"
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept="image/*"
            onChange={handleFileChange}
          />
          {coverImageUrl && (
            <div className="mt-4 text-center">
              <Image
                src={coverImageUrl}
                alt="Cover Image Preview"
                className="w-full h-60 object-cover rounded-lg border border-gray-600"
                width={1500}
                height={1500}
              />
            </div>
          )}
        </div>
        <div className="flex mt-6 gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddClick}
            className="flex-1 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Add Cover Image'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCoverImageModal;
