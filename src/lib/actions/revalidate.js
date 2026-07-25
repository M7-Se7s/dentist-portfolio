"use server";

import { revalidatePath } from "next/cache";

const LOCALES = ["en", "ar"];

function expandPaths(paths) {
  const pathsArray = Array.isArray(paths) ? paths : [paths];
  const expanded = [];

  for (const path of pathsArray) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    expanded.push(normalizedPath);

    if (normalizedPath.includes("/[locale]")) {
      for (const locale of LOCALES) {
        expanded.push(normalizedPath.replace("/[locale]", `/${locale}`));
      }
    }
  }

  return [...new Set(expanded)];
}

export async function triggerRevalidation(paths, type = "page") {
  try {
    const expandedPaths = expandPaths(paths);
    for (const path of expandedPaths) {
      revalidatePath(path, type);
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to revalidate paths:", error);
    return { success: false, error: error.message };
  }
}
