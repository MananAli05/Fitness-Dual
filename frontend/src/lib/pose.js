import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision'

const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.3/wasm'
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'

let loading = null

async function createLandmarker(delegate) {
  const vision = await FilesetResolver.forVisionTasks(WASM_URL)
  return PoseLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: MODEL_URL, delegate },
    runningMode: 'VIDEO',
    numPoses: 1,
  })
}

export function loadPoseModel() {
  if (!loading) {
    loading = createLandmarker('GPU').catch(() => createLandmarker('CPU'))
    loading.catch(() => {
      loading = null
    })
  }
  return loading
}
