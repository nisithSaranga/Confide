import * as tf from "@tensorflow/tfjs";

interface LoadedModels {
  modelDeeper: tf.LayersModel;
  model35pct: tf.LayersModel;
  modelSkin: tf.LayersModel;
}

// Module-level variables — these persist for the whole browser tab's
// lifetime, independent of any React component mounting or unmounting.
// This is what makes it a genuine Singleton, not just cached state.
let cachedModels: LoadedModels | null = null;
let loadingPromise: Promise<LoadedModels> | null = null;

export async function getModels(): Promise<LoadedModels> {
  // Already loaded — return instantly, zero network calls.
  if (cachedModels) {
    return cachedModels;
  }

  // A load is already in progress (e.g., two components asked at once) —
  // join that same load instead of starting a second, wasteful one.
  if (loadingPromise) {
    return loadingPromise;
  }

  // First-ever call: do the real loading, cache the promise immediately.
  loadingPromise = (async () => {
    const [modelDeeper, model35pct, modelSkin] = await Promise.all([
      tf.loadLayersModel("/models/ensemble-deeper/model.json"),
      tf.loadLayersModel("/models/ensemble-35pct/model.json"),
      tf.loadLayersModel("/models/skin-detector/model.json"),
    ]);
    cachedModels = { modelDeeper, model35pct, modelSkin };
    return cachedModels;
  })();

  return loadingPromise;
}