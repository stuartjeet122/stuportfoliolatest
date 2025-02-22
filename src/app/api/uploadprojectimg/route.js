import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { addImageToProject } from '../../components/projectfirebase'; // Firebase utility

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'dlpzpiewm',
  api_key: '298997145115615',
  api_secret: 'VK7RZWrzoZNIf2kP2v8kEb6QqFk',
});

export async function POST(request) {
  try {
    console.log('Received request to upload image.');

    const data = await request.formData();
    const projectId = data.get('projectId');
    const files = data.getAll('file'); // Handle multiple files, but we'll only allow one

    console.log('Form data:', { projectId, files: files.length });

    if (!files.length || !projectId) {
      console.error('Missing file(s) or project ID');
      return NextResponse.json({ error: 'Missing file(s) or project ID' }, { status: 400 });
    }

    // Ensure only one file is uploaded
    if (files.length > 1) {
      console.error('Too many files uploaded. Only one image can be uploaded.');
      return NextResponse.json({ error: 'Only one image can be uploaded at a time' }, { status: 400 });
    }

    const file = files[0]; // Only the first file
    console.log('Processing file:', file.name);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload the single file to Cloudinary
    console.log('Uploading to Cloudinary...');
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          public_id: `project_${projectId}/carousel_image_${Date.now()}`, // Unique ID for the image
          overwrite: true,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload result:', result);
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer); // End the upload stream
    });

    // Save the image URL and public ID to Firebase
    const imageData = {
      projectId,
      secure_url: uploadResult.secure_url, // Cloudinary URL of the uploaded image
      public_id: uploadResult.public_id, // Cloudinary public ID for the image
    };

    console.log('Saving image data to Firebase:', imageData);
    // Update Firebase with the image data
    const firebaseUpdate = await addImageToProject(projectId, imageData);

    console.log('Firebase update result:', firebaseUpdate);
    return NextResponse.json({ success: true, result: firebaseUpdate }, { status: 200 });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
