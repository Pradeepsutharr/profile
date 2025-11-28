// lib/storage.js
import { supabase } from "./supabaseClient";

/**
 * Uploads a File (from <input type="file">) to the specified bucket path.
 * Returns { publicUrl, error } where publicUrl is a string you can put in an <img>.
 *
 * For public bucket: use .getPublicUrl(path).publicUrl
 * For private bucket: use createSignedUrl (requires server side / service role or use the client)
 */
export async function uploadFileToBucket({ bucket = "public", path, file }) {
  // path example: `projects/164234234_image.png`
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (error) return { error };

    // For public bucket:
    const { publicUrl } = supabase.storage.from(bucket).getPublicUrl(path);
    return { publicUrl, error: null };
  } catch (err) {
    return { error: err };
  }
}

/**
 * Delete a file from bucket
 */
export async function deleteFileFromBucket({ bucket = "public", path }) {
  const { data, error } = await supabase.storage.from(bucket).remove([path]);
  return { data, error };
}
