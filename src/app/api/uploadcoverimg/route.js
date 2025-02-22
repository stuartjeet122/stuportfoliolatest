import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { addCoverImageToProject } from '../../components/projectfirebase';
import sharp from 'sharp';

cloudinary.config({
  cloud_name: 'dlpzpiewm',
  api_key: '298997145115615',
  api_secret: 'VK7RZWrzoZNIf2kP2v8kEb6QqFk',
});

export async function POST(request) {
  try {
    const data = await request.formData();
    
    // Extract fields
    const title = data.get('title'); // Optional: Title of the cover image
    const projectId = data.get('projectId');
    const file = data.get('file');

    if (!file || !projectId) {
      return NextResponse.json({ error: 'Missing file or project ID' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Compress image using sharp to create a thumbnail
    const compressedBuffer = await sharp(buffer)
      .resize({ width: 300, height: 300, fit: 'inside' })  // Resize to thumbnail (max 300x300px)
      .jpeg({ quality: 80 })  // Compress to a JPEG with 80% quality
      .toBuffer();

    // Check the file size after compression
    if (compressedBuffer.length > 4 * 1024 * 1024) {  // Check if file exceeds 4MB
      return NextResponse.json({ error: 'Image is too large. Maximum size is 4MB.' }, { status: 400 });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          resource_type: 'image', 
          public_id: `project_${projectId}/cover_image`, 
          overwrite: true
        },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      uploadStream.end(compressedBuffer);
    });
    

    // Prepare image data for Firebase
    const imageData = {
      title: title || 'Cover Image',  // Optional: Default to 'Cover Image' if no title is provided
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    };

    // Add the cover image data to Firebase
    const updatedProject = await addCoverImageToProject(projectId, imageData);

    // Return the response with projectId, title, and image URL
    return NextResponse.json({ 
      projectId,
      title: imageData.title,
      imageUrl: uploadResult.secure_url,
      updatedProject 
    }, { status: 200 });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
