"use client";
import { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Image from "next/image";
import Link from "next/link";
import { getModels } from "../lib/modelSingleton";
import { CONDITION_INFO } from "../lib/conditionInfo";
import { ResultApiClient } from "../lib/resultApiClient";
import Toast from "../components/Toast";

const CLASS_NAMES = ["HPV", "HSV", "Syphilis"];
const SKIN_THRESHOLD = 0.05;
const CONFIDENCE_THRESHOLD = 0.60;
const MIN_RESOLUTION = 150;

type ResultState =
  | { status: "loading-models" }
  | { status: "ready" }
  | { status: "classifying" }
  | { status: "not-skin" }
  | { status: "invalid-image" }
  | { status: "inconclusive"; confidence: number }
  | { status: "result"; condition: string; confidence: number };
  

export default function Classify() {
  const [modelDeeper, setModelDeeper] = useState<tf.LayersModel | null>(null);
  const [model35pct, setModel35pct] = useState<tf.LayersModel | null>(null);
  const [modelSkin, setModelSkin] = useState<tf.LayersModel | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [state, setState] = useState<ResultState>({ status: "loading-models" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);
  
useEffect(() => {
  async function loadModels() {
    const { modelDeeper, model35pct, modelSkin } = await getModels();
    setModelDeeper(modelDeeper);
    setModel35pct(model35pct);
    setModelSkin(modelSkin);
    setState({ status: "ready" });
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  setIsLoggedIn(!!localStorage.getItem("token"));
  loadModels();
}, []);

  function preprocessResNet(img: HTMLImageElement): tf.Tensor {
    return tf.tidy(() => {
      const t = tf.browser.fromPixels(img).resizeBilinear([224, 224]).toFloat();
      const [r, g, b] = tf.split(t, 3, -1);
      const bgr = tf.concat([b, g, r], -1);
      const mean = tf.tensor1d([103.939, 116.779, 123.68]);
      return bgr.sub(mean).expandDims(0);
    });
  }

  function preprocessMobileNet(img: HTMLImageElement): tf.Tensor {
    return tf.tidy(() => {
      const t = tf.browser.fromPixels(img).resizeBilinear([160, 160]).toFloat().div(255.0);
      return t.mul(2).sub(1).expandDims(0);
    });
  }

  async function handleFile(file: File) {
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setState({ status: "classifying" });
    setSaved(false);

const img = new window.Image();
img.src = url;

const isValid = await new Promise<boolean>((resolve) => {
  img.onload = () => {
    const meetsResolution = img.naturalWidth >= MIN_RESOLUTION && img.naturalHeight >= MIN_RESOLUTION;
    resolve(meetsResolution);
  };
  img.onerror = () => resolve(false);
});

if (!isValid) {
  setState({ status: "invalid-image" });
  return;
}

if (!modelSkin || !modelDeeper || !model35pct) return;

    const skinInput = preprocessMobileNet(img);
    const skinPred = modelSkin.predict(skinInput) as tf.Tensor;
    const skinScore = (await skinPred.data())[0];
    skinInput.dispose();
    skinPred.dispose();

    if (skinScore < SKIN_THRESHOLD) {
      setState({ status: "not-skin" });
      return;
    }

    const resInput = preprocessResNet(img);
    const raw1 = modelDeeper.predict(resInput) as tf.Tensor;
    const raw2 = model35pct.predict(resInput) as tf.Tensor;
    const probs1 = tf.softmax(raw1);
    const probs2 = tf.softmax(raw2);
    const avgProbs = probs1.add(probs2).div(2);
    const probsArray = Array.from(await avgProbs.data());
    resInput.dispose();
    raw1.dispose();
    raw2.dispose();
    probs1.dispose();
    probs2.dispose();
    avgProbs.dispose();

    const maxIdx = probsArray.indexOf(Math.max(...probsArray));
    const confidence = probsArray[maxIdx];

    if (confidence < CONFIDENCE_THRESHOLD) {
      setState({ status: "inconclusive", confidence });
    } else {
      setState({ status: "result", condition: CLASS_NAMES[maxIdx], confidence });
    }
  }

  function resetForNewImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setSaved(false);
    setState({ status: "ready" });
  }

  const isTerminalState =
    state.status === "not-skin" || state.status === "inconclusive" || state.status === "result" || state.status === "invalid-image";

  return (
    <main className="min-h-screen bg-white">
      <nav className="bg-[#0A306D] px-47 py-4 flex items-center gap-3 w-full">
      <Link href={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Confide"
          width={100}
          height={100}
        />
      <span className="text-white font-bold text-lg">
        Confide - Private STI Screening for Men
      </span>
          </Link>
    </nav>

      <div className="max-w-lg mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-[#0A306D] mb-6">Let&apos;s check it</h1>

        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-slate-700">
            Confide checks for three conditions: <strong>HPV, HSV & Syphilis</strong>.
            Images outside this scope may produce unreliable results.
          </p>
        </div>

        {state.status === "loading-models" && (
          <div className="text-center py-8 text-slate-500 text-sm">Loading models…</div>
        )}

        {(state.status === "ready" || state.status === "classifying") && (
          <label className="block border-2 border-dashed border-slate-300 rounded-xl p-12 text-center mb-6 hover:border-[#0B4DA2] transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            />
            <div className="text-4xl mb-3">📷</div>
            <p className="text-slate-600 text-sm">
              {state.status === "classifying" ? "Analyzing…" : "Tap to upload a photo"}
            </p>
          </label>
        )}

        {imagePreview && (
          <div className="relative mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="Uploaded" className="w-full rounded-xl" />
            {isTerminalState && (
              <button
                onClick={resetForNewImage}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-slate-600 hover:bg-white text-lg leading-none"
                aria-label="Remove image"
              >
                ×
              </button>
            )}
          </div>
        )}

        {state.status === "not-skin" && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
            <p className="text-slate-700 text-sm">
              This doesn&apos;t appear to be a photo of skin. Please upload a clear image of the affected area.
            </p>
          </div>
        )}
        {state.status === "invalid-image" && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
            <p className="text-slate-700 text-sm">
            This image couldn&apos;t be processed — it may be corrupted or too small. Please upload a clear photo and try again.
            </p>
          </div>
        )}

        {state.status === "inconclusive" && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
            <p className="font-semibold text-amber-800 mb-1">Inconclusive</p>
            <p className="text-amber-700 text-sm">
              The image may fall outside the supported conditions, or may be unsuitable for reliable classification.
            </p>
          </div>
        )}

        {state.status === "result" && (
         <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
         <p className="font-semibold text-[#0A306D] mb-1">{state.condition}</p>
         <p className="text-[#0B4DA2] text-sm mb-3">
              {(state.confidence * 100).toFixed(1)}% confidence
            </p>
            <p className="text-sm font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3">
               ⚠️ This is a preliminary screening result, not a confirmed medical diagnosis.
            </p>
            <p className="text-sm text-slate-700 mt-4 text-left leading-relaxed">
              {CONDITION_INFO[state.condition]}
           </p>{saved ? (
            <p className="mt-3 text-xs text-green-700">✓ Result saved</p>
) : (
  <button
    onClick={async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setSaveError("Log in to save results.");
        return;
      }
      try {
        await ResultApiClient.saveResult(token, state.condition, state.confidence);
        setSaved(true);
        setShowSaveToast(true);
      } catch {
        setSaveError("Failed to save result.");
      }
    }}
    className="mt-3 text-xs text-green-700 underline hover:text-green-900 cursor-pointer"
  >
    Save this result
  </button>
)}
{saveError && <p className="text-red-600 text-xs mt-2">{saveError}</p>}
          </div>
        )}

        {isTerminalState && (
          <button
            onClick={resetForNewImage}
            className="w-full h-12 rounded-full border-2 border-[#0B4DA2] text-[#0B4DA2] font-semibold text-sm mt-4 hover:bg-blue-50 transition-colors cursor-pointer"
          >
            Try another photo
          </button>
        )}
      </div>
      {showSaveToast && (
  <Toast message="Result saved" onClose={() => setShowSaveToast(false)} />
  )}
    </main>
  );
}