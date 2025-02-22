import { getDatabase, ref, push, update, remove, get, child, set } from "firebase/database";
import { db } from "../firebase"; // Ensure your Firebase configuration is correct

const database = getDatabase();

/**
 * Fetch a single project by ID
 * @param {string} id - The ID of the project to fetch
 * @returns {Object|null} The project data if found, or null if not found
 */
export const fetchProjectById = async (id) => {
  try {
    const dbRef = ref(database, `projects/${id}`);
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      return { id, ...snapshot.val() }; // Return project data with ID
    } else {
      console.warn(`Project with ID ${id} does not exist.`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    throw error;
  }
};

/**
 * Fetch all projects
 * @returns {Array} An array of all project objects
 */
export const fetchProjects = async () => {
  try {
    const dbRef = ref(database, "projects");
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map((id) => ({ id, ...data[id] })); // Convert to array
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

/**
 * Add a new project
 * @param {Object} project - The project data to add
 * @returns {Object} The newly added project with its generated ID
 */
export const addProject = async (project) => {
  try {
    const projectRef = ref(database, "projects");
    const newProjectRef = await push(projectRef, project);
    return { id: newProjectRef.key, ...project };
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
};

/**
 * Update an existing project by ID
 * @param {string} id - The ID of the project to update
 * @param {Object} updatedProject - The updated project data
 * @returns {Object} The updated project data with its ID
 */
export const updateProject = async (id, updatedProject) => {
  try {
    const projectRef = ref(database, `projects/${id}`);
    await update(projectRef, updatedProject);
    return { id, ...updatedProject };
  } catch (error) {
    console.error(`Error updating project with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a project by ID
 * @param {string} id - The ID of the project to delete
 */
export const deleteProject = async (id) => {
  try {
    const projectRef = ref(database, `projects/${id}`);
    await remove(projectRef);
  } catch (error) {
    console.error(`Error deleting project with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Add a YouTube video URL to an existing project by ID
 * @param {string} projectId - The ID of the project to update
 * @param {Object} videoData - The video data object containing video details
 * @returns {Object} The updated project data with the new video added
 */
export const addVideoToProject = async (projectId, videoData) => {
  if (!projectId || !videoData) {
    throw new Error('Project ID and video data are required');
  }

  try {
    const projectRef = ref(database, `projects/${projectId}`);
    const updates = {
      [`videos/${videoData.id}`]: videoData, // Add the video to the videos object
    };

    await update(projectRef, updates);
    return fetchProjectById(projectId); // Return the updated project data
  } catch (error) {
    console.error("Error adding video to project:", error);
    throw error;
  }
};

/**
 * Update a YouTube video URL in a specific project
 * @param {string} projectId - The ID of the project to update
 * @param {number} videoIndex - The index of the video to update
 * @param {string} videoUrl - The new YouTube video URL
 * @returns {Object} The updated project data with the updated video URL
 */
export const updateVideoInProject = async (projectId, videoIndex, videoUrl) => {
  try {
    const projectRef = ref(database, `projects/${projectId}/videos`);
    const snapshot = await get(projectRef);

    let videos = snapshot.exists() ? snapshot.val() : [];

    // Update the specific video URL
    if (videos[videoIndex]) {
      videos[videoIndex].url = videoUrl;
    }

    // Update the project with the new video list
    await update(projectRef, videos);

    // Return the updated project
    return fetchProjectById(projectId);
  } catch (error) {
    console.error(`Error updating video for project with ID ${projectId}:`, error);
    throw error;
  }
};

/**
 * Delete a YouTube video URL from a specific project
 * @param {string} projectId - The ID of the project
 * @param {number} videoIndex - The index of the video to delete
 * @returns {Object} The updated project data after the video deletion
 */
export const deleteVideoFromProject = async (projectId, videoId) => {
  try {
    // Get a reference to the video node in Firebase
    const videoRef = ref(database, `projects/${projectId}/videos/${videoId}`);

    // Remove the video using the videoId as a key
    await remove(videoRef);

    // Optionally, fetch the updated project details (if you need the updated project state)
    return fetchProjectById(projectId); // Assuming this refetches the updated project data
  } catch (error) {
    console.error(`Error deleting video with ID ${videoId} for project ${projectId}:`, error);
    throw error;
  }
};

export const fetchVideoByProjectId = async (id) => {
  try {
    const dbRef = ref(database, `projects/${id}/videos`); // Adjust path to where videos are stored
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      return { id, ...snapshot.val() }; // Return video data with project ID
    } else {
      console.warn(`No videos found for project with ID ${id}.`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching video by project ID:", error);
    throw error;
  }
};

/**
 * Add a PDF to an existing project by ID with sequential numbering
 * @param {string} projectId - The ID of the project to update
 * @param {Object} pdfData - The PDF data object containing `title`, `secure_url`, and `public_id`
 * @returns {Object} The updated project data with the new PDF added
 */
export const addPDFToProject = async (projectId, pdfData) => {
  if (!projectId || !pdfData || !pdfData.public_id || !pdfData.secure_url || !pdfData.title) {
    throw new Error('Project ID and complete PDF data (title, secure_url, public_id) are required');
  }

  try {
    // Fetch current PDFs for the project to find the highest sequential ID
    const currentPDFs = await fetchPDFsByProjectId(projectId);
    let newId = 1;

    // If there are already PDFs, get the next sequential ID
    if (currentPDFs) {
      const existingIds = Object.keys(currentPDFs).map(id => parseInt(id, 10));
      newId = Math.max(...existingIds) + 1; // Get the next available ID
    }

    const projectRef = ref(database, `projects/${projectId}/pdfs/${newId}`);
    await update(projectRef, {
      id: newId,  // Add the ID to the update
      title: pdfData.title,
      secure_url: pdfData.secure_url,
      public_id: pdfData.public_id
    });

    return fetchProjectById(projectId); // Return the updated project data
  } catch (error) {
    console.error("Error adding PDF to project:", error);
    throw error;
  }
};



/**
 * Fetch all PDFs associated with a project by ID
 * @param {string} projectId - The ID of the project to fetch PDFs from
 * @returns {Object|null} The PDFs data if found, or null if no PDFs exist
 */
export const fetchPDFsByProjectId = async (projectId) => {
  try {
    const pdfRef = ref(database, `projects/${projectId}/pdfs`);
    const snapshot = await get(pdfRef);

    if (snapshot.exists()) {
      return snapshot.val(); // Return all PDFs as an object
    } else {
      console.warn(`No PDFs found for project with ID ${projectId}.`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching PDFs for project with ID ${projectId}:`, error);
    throw error;
  }
};


export const addCoverImageToProject = async (projectId, imageData) => {
  if (!projectId || !imageData?.secure_url || !imageData?.public_id || !imageData?.title) {
    throw new Error('Project ID and complete image data are required');
  }

  try {
    const projectRef = ref(database, `projects/${projectId}/cover_image`);
    await update(projectRef, {
      title: imageData.title,
      secure_url: imageData.secure_url,
      public_id: imageData.public_id,
    });

    return fetchProjectById(projectId); // Assume this function exists to fetch updated project
  } catch (error) {
    console.error('Error updating cover image in Firebase:', error);
    throw error;
  }
};

/**
 * Fetch the cover image associated with a project by ID
 * @param {string} projectId - The ID of the project to fetch the cover image from
 * @returns {Object|null} The cover image data if found, or null if no cover image exists
 */
export const fetchCoverImageByProjectId = async (projectId) => {
  try {
    // Reference to the cover image of the project
    const coverImageRef = ref(database, `projects/${projectId}/cover_image`);
    
    // Fetch the cover image data from the database
    const snapshot = await get(coverImageRef);

    if (snapshot.exists()) {
      return snapshot.val(); // Return cover image data as an object
    } else {
      console.warn(`No cover image found for project with ID ${projectId}.`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching cover image for project with ID ${projectId}:`, error);
    throw error;
  }
};

/**
 * Fetch images for a specific project by projectId
 * @param {string} projectId - The ID of the project
 * @returns {Object|null} The images for the project or null if not found
 */
export const fetchCarouselImagesByProjectId = async (projectId) => {
  try {
    const imagesRef = ref(database, `projects/${projectId}/images`);
    const snapshot = await get(imagesRef);

    if (snapshot.exists()) {
      return snapshot.val(); // Return images data as an object
    } else {
      console.warn(`No images found for project with ID ${projectId}.`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching images for project with ID ${projectId}:`, error);
    throw error;
  }
};

/**
 * Add a new image to an existing project by ID with sequential numbering
 * @param {string} projectId - The ID of the project to update
 * @param {Object} imageData - The image data containing `secure_url` and `public_id`
 * @returns {Object} The updated project data with the new image added
 */
export const addImageToProject = async (projectId, imageData) => {
  if (!projectId || !imageData || !imageData.public_id || !imageData.secure_url) {
    throw new Error('Project ID and complete image data (secure_url, public_id) are required');
  }

  try {
    const currentImages = await fetchCarouselImagesByProjectId(projectId);
    let newId = 1;

    if (currentImages) {
      const existingIds = Object.keys(currentImages).map(id => parseInt(id, 10));
      newId = Math.max(...existingIds) + 1;
    }

    const imageRef = ref(database, `projects/${projectId}/images/${newId}`);
    await update(imageRef, {
      id: newId,
      secure_url: imageData.secure_url,
      public_id: imageData.public_id
    });

    return await fetchCarouselImagesByProjectId(projectId); // Return the updated image list
  } catch (error) {
    console.error("Error adding image to project:", error);
    throw error;
  }
};

/**
 * Delete an image from the project by image `id`
 * @param {string} projectId - The ID of the project
 * @param {string} imageId - The ID of the image to be deleted
 * @returns {Object|null} The updated image list after deletion
 */
export const deleteImageFromProject = async (projectId, imageId) => {
  if (!projectId || !imageId) {
    throw new Error('Project ID and image ID are required');
  }

  try {
    const imageRef = ref(database, `projects/${projectId}/images/${imageId}`);
    await remove(imageRef);

    return await fetchCarouselImagesByProjectId(projectId); // Return updated image list
  } catch (error) {
    console.error('Error deleting image from Firebase:', error);
    throw error;
  }
};

export const addEducationToProject = async (educationData) => {
  if (!educationData || educationData.order === undefined) {
    throw new Error('Education data and order are required');
  }

  try {
    const educationRef = ref(database, 'educations'); // Save to the global 'educations' node
    const newEducationRef = push(educationRef); // Automatically generate a new ID

    const newEducationId = newEducationRef.key; // Get the auto-generated ID

    const educationWithId = {
      id: newEducationId,
      ...educationData, // Add the education data, including the generated ID
    };

    await update(newEducationRef, educationWithId); // Save to Firebase
    return newEducationId; // Return the new education ID
  } catch (error) {
    console.error("Error adding education:", error);
    throw error;
  }
};

export const fetchEducationSorted = async () => {
  try {
    const educationRef = ref(database, 'educations'); // Fetch from the global 'educations' node
    const snapshot = await get(educationRef);

    if (snapshot.exists()) {
      const educationEntries = snapshot.val();
      const sortedEducationEntries = Object.values(educationEntries)
        .sort((a, b) => a.order - b.order); // Sort by order

      return sortedEducationEntries;
    }

    return [];
  } catch (error) {
    console.error("Error fetching education entries:", error);
    throw error;
  }
};

export const deleteEducationFromProject = async (educationId) => {
  if (!educationId) {
    throw new Error('Education ID is required');
  }

  try {
    const db = getDatabase();
    const educationRef = ref(db, `educations/${educationId}`);
    const snapshot = await get(educationRef);

    if (snapshot.exists()) {
      // Remove education entry from Firebase
      await set(educationRef, null);
      return true;
    } else {
      throw new Error('Education entry not found');
    }
  } catch (error) {
    console.error("Error deleting education entry:", error);
    throw error;
  }
};




export const updateEducationInProject = async (educationId, updatedEducationData) => {
  if (!educationId || !updatedEducationData) {
    throw new Error('Education ID and updated data are required');
  }

  try {
    const educationRef = ref(database, `educations/${educationId}`); // Get the reference to the specific education using its ID

    // Merge the updated data with the existing education record
    const updatedEducation = {
      ...updatedEducationData,
      id: educationId, // Ensure the ID is kept in the updated record
    };

    await update(educationRef, updatedEducation); // Update the data in Firebase
    return true; // Return true to indicate success
  } catch (error) {
    console.error("Error updating education:", error);
    throw error;
  }
};

// Update education order in Firebase
export const updateEducationOrderInProject = async (updatedItems) => {
  if (!updatedItems || updatedItems.length === 0) {
    throw new Error('No education items provided to update');
  }

  try {
    const updates = {};
    updatedItems.forEach((education) => {
      const educationRef = ref(database, `educations/${education.id}`); // Get reference to specific education
      updates[educationRef] = {
        ...education,
        order: education.order.toString(), // Ensure order is a string
      };
    });

    await update(ref(database), updates); // Perform batch update in Firebase
    console.log("Education order updated successfully");
    return true; // Return true to indicate success
  } catch (error) {
    console.error("Error updating education order:", error);
    throw error;
  }
};


export const addImageToEducation = async (educationId, public_id, secure_url) => {
  if (!educationId || !public_id || !secure_url) {
    throw new Error('Education ID, public_id, and secure_url are required');
  }

  try {
    // Get a reference to the Realtime Database
    const database = getDatabase();
    const educationRef = ref(database, `educations/${educationId}`);

    // Fetch the current education data
    const snapshot = await get(educationRef);
    const currentEducation = snapshot.val();

    // Check if an image already exists for the education entry
    if (currentEducation && currentEducation.image) {
      // Overwrite the old image if one exists
      console.log('Overwriting existing image for education ID:', educationId);
    }

    // Create an object with the new image data under the 'image' key
    const imageData = {
      image: {  // Nesting under 'image' key
        public_id,  // Cloudinary public ID
        secure_url,  // Cloudinary secure URL
      },
    };

    // Update the education entry with the new image data
    await update(educationRef, imageData);

    // Get the updated education data (to return the complete response if needed)
    const updatedEducation = await get(educationRef);
    return updatedEducation.val(); // Return the updated education object with the new image data
  } catch (error) {
    console.error("Error adding image to education:", error);
    throw error;
  }
};

export const removeImageFromEducation = async (educationId) => {
  if (!educationId) {
    throw new Error('Education ID is required');
  }

  try {
    // Get a reference to the Realtime Database
    const database = getDatabase();
    const educationRef = ref(database, `educations/${educationId}`);

    // Fetch the current education data
    const snapshot = await get(educationRef);
    const currentEducation = snapshot.val();

    // Check if an image exists to be removed
    if (currentEducation && currentEducation.image) {
      // Log removal and proceed to remove the image data
      console.log('Removing image for education ID:', educationId);

      // Remove the image from the education entry
      await update(educationRef, {
        image: null, // Set the image field to null to effectively remove it
      });

      // Optionally, you can also delete any associated Cloudinary resources here if needed
      // For example, you could call the Cloudinary API to delete the image by its `public_id`

      // Return the updated education data
      const updatedEducation = await get(educationRef);
      return updatedEducation.val(); // Return the updated education object without the image
    } else {
      throw new Error('No image found for the provided education ID');
    }
  } catch (error) {
    console.error("Error removing image from education:", error);
    throw error;
  }
};