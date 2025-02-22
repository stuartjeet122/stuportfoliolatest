import React, { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { toast } from 'react-hot-toast';
import ImageUploadPopup from './educationimagedialog'; // Adjust the path based on your structure
import { addImageToEducation, removeImageFromEducation, deleteEducationFromProject } from './projectfirebase'; // Import the Firebase API functions
import Image from "next/image";

export default function EducationCard({ education, onEdit }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [image, setImage] = useState(education.image?.secure_url || null);

  // Handle file selection and validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setTempImage(URL.createObjectURL(file));
      setSelectedFile(file);
    } else {
      toast.error("Please select an image file.");
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast.error("No file selected for upload.");
      return;
    }
  
    setIsUploading(true);
    const uploadToast = toast.loading("Uploading image...");
  
    try {
      const formData = new FormData();
      formData.append('projectId', education.id);
      formData.append('file', selectedFile);
  
      // Upload image to Cloudinary
      const response = await fetch('/api/uploadeducationcloudinary', { method: 'POST', body: formData });
      const result = await response.json();
  
      if (result.success) {
        const { public_id, secure_url } = result.result; // Extract Cloudinary result data
        setImage(secure_url);  // Update state with the new image URL
        toast.success("Image uploaded and saved!");
  
        // Call Firebase function to save the image data
        await addImageToEducation(education.id, public_id, secure_url);
        setTempImage(null);
        setSelectedFile(null);
        togglePopup();
      } else {
        toast.error("Image upload failed.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image.");
    } finally {
      setIsUploading(false);
      toast.dismiss(uploadToast);
    }
  };
  

  const handleRemoveImage = async () => {
    if (!education.image?.public_id) {
      toast.error("No image to remove.");
      return;
    }
  
    setIsUploading(true);
    const removeToast = toast.loading("Removing image...");
  
    try {
      // Send DELETE request to Cloudinary to remove the image
      const response = await fetch('/api/uploadeducationcloudinary', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_id: education.image.public_id,
        }),
      });
  
      const result = await response.json();
  
      // Remove the image from Firebase as well
      await removeImageFromEducation(education.id); // Call Firebase function to remove image
  
      setImage(null);  // Ensure image state is cleared
      toast.success("Image removed successfully!");
  
      // Notify parent component to refresh the education list
      if (onRemoveImage) {
        onRemoveImage(education.id);  // Pass the ID of the education to be removed
      }
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Error removing image.");
    } finally {
      setIsUploading(false);
      toast.dismiss(removeToast);
    }
  };
  
  

  const handleDeleteEducation = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this education?");
    if (!confirmDelete) return;
  
    handleRemoveImage()
      .then(() => {
        return deleteEducationFromProject(education.id);
      })
      .then((success) => {
        if (success) {
          toast.success("Education deleted successfully!");
        } else {
          toast.error("Failed to delete education.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.message === "Failed to delete image.") {
          toast.error("Failed to delete image.");
        } else {
          toast.error("Error deleting education.");
        }
      });
  };
  

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div className="container mx-auto bg-black bg-opacity-40 backdrop-blur-lg border border-gray-700 rounded-3xl shadow-xl mb-8 p-8 overflow-hidden">
      {/* Education Card Content */}
      <div className="flex items-start justify-between">
        {/* Order Number */}
        <div className="flex items-center justify-center w-24 h-24 bg-white bg-opacity-10 text-white font-extrabold text-6xl rounded-full shadow-lg mr-8">
          {education.order}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Card header with buttons */}
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-white font-bold text-3xl">{education.degree}</h5>
            <div className="flex space-x-4">
              <button onClick={onEdit} className="text-blue-400 hover:text-blue-600 transition-all">
                <AiOutlineEdit fontSize="1.8rem" />
              </button>
              <button onClick={handleDeleteEducation} className="text-red-400 hover:text-red-600 transition-all">
                <AiOutlineDelete fontSize="1.8rem" />
              </button>
            </div>
          </div>

          {/* Display educational information */}
          <p className="text-gray-300 mb-2 text-lg">{education.description}</p>
          <p className="text-gray-400 text-sm mb-1">Institution: <span className="font-semibold text-gray-200">{education.institution}</span></p>
          <p className="text-sm text-gray-400">
            <span className="font-semibold text-gray-300">Graduation:</span> {education.graduation}
          </p>

          {/* Display image */}
          {image ? (
            <div className="mt-6">
            <Image src={image} alt="Thumbnail" className="w-32 h-32 object-cover rounded-xl shadow-md" height={1500} width={1500}/>
              <button onClick={handleRemoveImage} className="mt-2 text-red-400 hover:text-red-600">
                Remove Image
              </button>
            </div>
          ) : (
            <button onClick={togglePopup} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-lg transition-all">
              Choose Image
            </button>
          )}
        </div>
      </div>

      {/* Image upload popup */}
      <ImageUploadPopup
        isOpen={isPopupOpen}
        togglePopup={togglePopup}
        tempImage={tempImage}
        handleFileChange={handleFileChange}
        handleImageUpload={handleImageUpload}
        setTempImage={setTempImage}
        setSelectedFile={setSelectedFile}
        isUploading={isUploading}
        selectedFile={selectedFile}
      />
    </div>
  );
}
