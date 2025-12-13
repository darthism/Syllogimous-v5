import { getSupabaseClient } from "@/supabase/client";
import { ensureSupabaseSession } from "@/supabase/session";

function dataUrlToBlob(dataUrl: string): { blob: Blob; contentType: string } {
  const [meta, b64] = dataUrl.split(",");
  const match = meta.match(/data:(.*?);base64/);
  const contentType = match?.[1] ?? "application/octet-stream";
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return { blob: new Blob([bytes], { type: contentType }), contentType };
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  const reader = new FileReader();
  return await new Promise((resolve, reject) => {
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

export async function storeImageCloud(id: string, dataUrl: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;
  const userId = await ensureSupabaseSession();
  if (!userId) return false;

  const { blob, contentType } = dataUrlToBlob(dataUrl);
  const { error } = await supabase.storage
    .from("images")
    .upload(`${userId}/${id}`, blob, { contentType, upsert: true });

  return !error;
}

export async function getImageCloud(id: string): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const userId = await ensureSupabaseSession();
  if (!userId) return null;

  const { data, error } = await supabase.storage.from("images").download(`${userId}/${id}`);
  if (error || !data) return null;
  return await blobToDataUrl(data);
}

export async function deleteImageCloud(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;
  const userId = await ensureSupabaseSession();
  if (!userId) return false;

  const { error } = await supabase.storage.from("images").remove([`${userId}/${id}`]);
  return !error;
}


