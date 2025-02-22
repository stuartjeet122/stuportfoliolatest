import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp'; // Image compression library

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

    // Compress the image using sharp
    console.log('Compressing image...');
    const compressedBuffer = await sharp(buffer)
      .resize({ width: 800 }) // Resize the image to a maximum width of 800px (for example)
      .jpeg({ quality: 80 }) // Compress the image to 80% quality (for JPEG)
      .toBuffer();

    // Upload the compressed image to Cloudinary
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
      uploadStream.end(compressedBuffer); // End the upload stream with the compressed image buffer
    });

    // Prepare the response with only the secure_url and public_id
    const imageData = {
      secure_url: uploadResult.secure_url, // Cloudinary URL of the uploaded image
      public_id: uploadResult.public_id, // Cloudinary public ID for the image
    };

    console.log('Returning image data:', imageData);
    return NextResponse.json({ success: true, result: imageData }, { status: 200 });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    console.log('Received request to delete image.');

    const data = await request.json();
    const { public_id } = data;

    if (!public_id) {
      console.error('Missing public_id');
      return NextResponse.json({ error: 'Missing public_id' }, { status: 400 });
    }

    // 1. Delete the image from Cloudinary
    console.log('Deleting image from Cloudinary...');
    const cloudinaryResult = await cloudinary.uploader.destroy(public_id, { resource_type: 'image' });

    if (cloudinaryResult.result !== 'ok') {
      console.error('Cloudinary deletion failed:', cloudinaryResult);
      return NextResponse.json({ error: 'Failed to delete image from Cloudinary' }, { status: 500 });
    }
    console.log('Image successfully deleted from Cloudinary:', cloudinaryResult);

    // Return success response only after Cloudinary deletion
    return NextResponse.json({ success: true, message: 'Image deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}