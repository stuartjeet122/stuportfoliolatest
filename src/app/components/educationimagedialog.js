'use client';
import React from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
export default function ImageUploadPopup({
  isOpen,
  togglePopup,
  tempImage,
  handleFileChange,
  handleImageUpload,
  setTempImage,
  setSelectedFile,
  isUploading,
  selectedFile,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-lg z-50 transition-all duration-300 ease-in-out">
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl max-w-lg w-full transition-transform transform scale-95 hover:scale-100">
        {/* Header with close button */}
        <div className="flex justify-between items-center">
          <h3 className="text-white text-xl sm:text-2xl font-semibold tracking-wide">Upload or Remove Image</h3>
          <button onClick={togglePopup} className="text-white text-3xl hover:text-gray-300 transition-colors">
            &times;
          </button>
        </div>

        <div className="mt-6">
          {tempImage ? (
            <>
              {/* Image Preview */}
              <Image height={1500} width={1500} src={tempImage} alt="Preview" className="w-32 sm:w-40 h-32 sm:h-40 object-cover rounded-lg shadow-lg mx-auto transition-all duration-300 transform hover:scale-105" />
              <div className="flex flex-col sm:flex-row justify-between mt-4 gap-2 sm:gap-4">
                <button onClick={() => { setTempImage(null); setSelectedFile(null); }} className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg w-full sm:w-auto transition-all duration-200 ease-in-out">Cancel</button>
                <button onClick={handleImageUpload} disabled={isUploading} className={`bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg w-full sm:w-auto mt-2 sm:mt-0 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''} transition-all duration-200 ease-in-out`}>
                  {isUploading ? 'Uploading...' : 'Add Image'}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* File Input */}
              <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-white bg-gray-700 p-4 rounded-xl mt-4 border-none focus:ring-2 focus:ring-blue-500 transition-all duration-200" />
              <div className="flex flex-col sm:flex-row justify-between mt-4 gap-2 sm:gap-4">
                <button onClick={togglePopup} className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg w-full sm:w-auto transition-all duration-200 ease-in-out">Close</button>
                <button onClick={handleImageUpload} disabled={isUploading || !selectedFile} className={`bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg w-full sm:w-auto mt-2 sm:mt-0 ${isUploading || !selectedFile ? 'opacity-50 cursor-not-allowed' : ''} transition-all duration-200 ease-in-out`}>
                  Upload
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
