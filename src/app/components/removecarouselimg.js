import { ref, remove, getDatabase } from 'firebase/database';
import { v2 as cloudinary } from 'cloudinary';
import { fetchProjectById } from './projectfirebase'; // Adjust the path accordingly
import { NextResponse } from 'next/server';

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dlpzpiewm',
  api_key: '298997145115615',
  api_secret: 'VK7RZWrzoZNIf2kP2v8kEb6QqFk',
});

/**
 * Deletes carousel image data from Firebase and Cloudinary.
 * @param {string} projectId - The ID of the project.
 * @param {string} imageId - The ID of the image to delete.
 */
export async function removeCarouselImage(projectId, imageId) {
  const database = getDatabase();

  // Fetch the project data from Firebase
  const projectData = await fetchProjectById(projectId);
  const imageData = projectData?.images?.[imageId];

  if (!imageData) {
    throw new Error('Image not found in project');
  }

  try {
    // Delete the image reference from Firebase
    const imageRef = ref(database, `projects/${projectId}/images/${imageId}`);
    await remove(imageRef);

    // Delete the image from Cloudinary using its public_id
    const cloudinaryResponse = await cloudinary.uploader.destroy(imageData.public_id, { resource_type: 'image' });

    if (cloudinaryResponse.result !== 'ok') {
      throw new Error('Failed to delete image from Cloudinary');
    }
  } catch (error) {
    console.error('Error removing carousel image:', error);
    throw error;
  }
}

export async function POST(request) {
  try {
    const { projectId, imageId } = await request.json();

    if (!projectId || !imageId) {
      return NextResponse.json({ error: 'Missing projectId or imageId' }, { status: 400 });
    }

    // Call the function to remove the image from Firebase and Cloudinary
    await removeCarouselImage(projectId, imageId);

    return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error removing image:', error);
    return NextResponse.json({ error: error.message || 'Failed to remove image' }, { status: 500 });
  }
}
