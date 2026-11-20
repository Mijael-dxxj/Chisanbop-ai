import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

// Estos recursos se sirven desde public/ para que el modelo nunca dependa de red.
const WASM = '/mediapipe/wasm';
const MODEL = '/models/hand_landmarker.task';

export async function createHandDetector() {
  const vision = await FilesetResolver.forVisionTasks(WASM);
  return HandLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: MODEL, delegate: 'GPU' },
    runningMode: 'VIDEO', numHands: 2,
    minHandDetectionConfidence: 0.55, minHandPresenceConfidence: 0.55, minTrackingConfidence: 0.55
  });
}

export function detectHands(detector, video, timestamp) {
  return detector.detectForVideo(video, timestamp);
}
