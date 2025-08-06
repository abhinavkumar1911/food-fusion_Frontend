// src/utils/storage.js
import { get, set, del } from 'idb-keyval';

const CACHE_KEY = 'exploreData';
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

export async function getCachedExploreData() {
  const cached = await get(CACHE_KEY);
  if (!cached) return null;

  const isValid = Date.now() - cached.timestamp < CACHE_DURATION;
  if (isValid) return cached.data;

  await del(CACHE_KEY); // Expired
  return null;
}

export async function cacheExploreData(data) {
  await set(CACHE_KEY, {
    timestamp: Date.now(),
    data
  });
}
