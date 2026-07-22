"use server";

import { revalidatePath } from 'next/cache';

export async function triggerRevalidation(paths, type = 'page') {
  try {
    const pathsArray = Array.isArray(paths) ? paths : [paths];
    for (const path of pathsArray) {
      revalidatePath(path, type);
      console.log(`Revalidated path: ${path} (type: ${type})`);
    }
    return { success: true };
  } catch (error) {
    console.error('Failed to revalidate paths:', error);
    return { success: false, error: error.message };
  }
}
