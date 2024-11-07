// /utils/cloudinary.ts
import { env } from "@/environment";

export const uploadImageToCloudinary = async (file: File): Promise<{ secure_url: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", env.CLOUDINARY_UPLOAD_PRESET);
  formData.append("cloud_name", env.CLOUDINARY_CLOUD_NAME);
  formData.append("folder", "content-compunet");

  console.log("Uploading image to Cloudinary...");
  console.log("Cloudinary API URL:", `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`);
  console.log("FormData:", formData);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Error response from Cloudinary:", errorBody);
      throw new Error(`Error al subir la imagen a Cloudinary: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Cloudinary response:", data);
    return { secure_url: data.secure_url };
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};