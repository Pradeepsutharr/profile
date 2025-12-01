// /lib/storage.js
import { supabase } from "./supabaseClient";

/**
 * Return a usable URL for a given bucket/path.
 * If bucket is public this will return the public URL,
 * otherwise it will create a signed URL (temporary).
 */
export async function getUrlForPath(bucket, path, expiresInSeconds = 60 * 60) {
  if (!bucket || !path) return null;
  try {
    // first try public url
    const { data: pubData, error: pubErr } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    // supabase v2 returns { publicURL } under data.publicURL or { publicURL } depending on SDK
    // safe-check both shapes:
    const publicURL =
      pubData?.publicURL ?? pubData?.publicUrl ?? pubData?.public_path ?? null;
    if (publicURL) return publicURL;

    // fallback to signed url for private buckets
    const { data: signedData, error: signedErr } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresInSeconds);
    if (signedErr) {
      console.warn("createSignedUrl error", signedErr);
      return null;
    }
    return signedData?.signedURL ?? signedData?.signed_url ?? null;
  } catch (err) {
    console.error("getUrlForPath unexpected error", err);
    return null;
  }
}

/**
 * Upload a file and return an object { publicUrl, raw, error }.
 * - raw is the upload response (contains path).
 * - publicUrl will be either a publicURL or a signed URL (if private bucket).
 */
export async function uploadFileToBucket({
  bucket,
  path,
  file,
  expiresInSeconds = 60 * 60,
}) {
  if (!bucket || !path || !file) {
    return {
      publicUrl: null,
      raw: null,
      error: new Error("missing bucket/path/file"),
    };
  }

  try {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.warn("storage.upload error", uploadError);
      return { publicUrl: null, raw: uploadData ?? null, error: uploadError };
    }

    // uploadData will have { path, id, name, ... } — derive url from the returned path
    // Note: some SDK versions return uploadData.key or uploadData.path; handle both
    const pathVal =
      uploadData?.path ?? uploadData?.Key ?? uploadData?.fullPath ?? null;
    const pathToUse = pathVal || path; // fallback to the path we asked to upload

    // get usable URL (public or signed)
    const publicUrl = await getUrlForPath(bucket, pathToUse, expiresInSeconds);

    return { publicUrl, raw: uploadData ?? { path: pathToUse }, error: null };
  } catch (err) {
    console.error("uploadFileToBucket unexpected error", err);
    return { publicUrl: null, raw: null, error: err };
  }
}

/**
 * Delete file from bucket
 */
export async function deleteFileFromBucket({ bucket, path }) {
  if (!bucket || !path) return { error: new Error("missing bucket or path") };
  try {
    const { data, error } = await supabase.storage.from(bucket).remove([path]);
    if (error) return { error, data };
    return { error: null, data };
  } catch (err) {
    console.error("deleteFileFromBucket unexpected", err);
    return { error: err };
  }
}
