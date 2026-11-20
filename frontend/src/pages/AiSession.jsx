import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Card from '../components/common/Card.jsx'
import { AI_EXERCISES } from '../constants/aiExercises.js'
import { findExercise } from '../constants/exercises.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useProfile } from '../context/ProfileContext.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import { loadPoseModel } from '../lib/pose.js'
import { saveWorkout } from '../lib/workouts.js'
import { BONES, SquatCounter, readSquat, smoothPoints } from '../utils/squat.js'
import { getTarget } from '../utils/workouts.js'

const isReady = (id) => AI_EXERCISES.some((item) => item.id === id && item.ready)

const MESSAGES = {
  loading: 'Loading the AI model...',
  position: 'Step back until your whole body is in the frame',
  good: 'Good rep',
  shallow: 'Go lower',
  knees: 'Push your knees out',
  hidden: 'Show your full body',
}

function speak(text) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))
}

function drawBody(canvas, joints) {
  const context = canvas.getContext('2d')
  context.clearRect(0, 0, canvas.width, canvas.height)
  if (!joints) return

  const toPixel = (point) => [point.x * canvas.width, point.y * canvas.height]

  context.strokeStyle = '#c6ff3d'
  context.lineWidth = 6
  context.lineCap = 'round'
  BONES.forEach(([from, to]) => {
    context.beginPath()
    context.moveTo(...toPixel(joints[from]))
    context.lineTo(...toPixel(joints[to]))
    context.stroke()
  })

  context.fillStyle = '#ffffff'
  Object.values(joints).forEach((point) => {
    context.beginPath()
    context.arc(...toPixel(point), 7, 0, Math.PI * 2)
    context.fill()
  })
}

export default function AiSession() {
  const { exerciseId } = useParams()
  const { user } = useAuth()
  const { goal, level } = useProfile()
  const exercise = findExercise(exerciseId)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const phaseRef = useRef('loading')
  const counterRef = useRef(new SquatCounter())
  const startedAtRef = useRef(null)

  const [phase, setPhase] = useState('loading')
  const [countdown, setCountdown] = useState(3)
  const [message, setMessage] = useState(MESSAGES.loading)
  const [reps, setReps] = useState(0)
  const [noReps, setNoReps] = useState(0)
  const [error, setError] = useState('')
  const [saveError, setSaveError] = useState('')

  const target = exercise ? getTarget(exercise, goal, level).reps : 0

  function changePhase(next) {
    phaseRef.current = next
    setPhase(next)
  }

  useEffect(() => {
    if (!isReady(exerciseId)) return

    let stream = null
    let frameId = null
    let stopped = false
    let points = null
    let lastTime = -1

    function handleFrame(landmarker) {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas) return

      if (video.currentTime !== lastTime) {
        lastTime = video.currentTime
        const result = landmarker.detectForVideo(video, performance.now())
        const raw = result.landmarks[0]
        points = raw ? smoothPoints(points, raw) : null

        const reading = points ? readSquat(points) : null
        drawBody(canvas, reading?.joints)

        if (phaseRef.current === 'position' && reading) {
          changePhase('countdown')
        }

        if (phaseRef.current === 'live') {
          if (!reading) {
            setMessage(MESSAGES.hidden)
          } else {
            const event = counterRef.current.update(reading)
            if (event) {
              setMessage(MESSAGES[event])
              setReps(counterRef.current.reps)
              setNoReps(counterRef.current.noReps)
              speak(event === 'good' ? String(counterRef.current.reps) : MESSAGES[event])
            }
          }
        }
      }

      frameId = requestAnimationFrame(() => handleFrame(landmarker))
    }

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: false })
        const landmarker = await loadPoseModel()
        if (stopped) return

        const video = videoRef.current
        video.srcObject = stream
        await video.play()
        canvasRef.current.width = video.videoWidth
        canvasRef.current.height = video.videoHeight

        changePhase('position')
        setMessage(MESSAGES.position)
        handleFrame(landmarker)
      } catch (err) {
        if (stopped) return
        if (err.name === 'NotAllowedError') {
          setError('Camera access was blocked. Allow the camera in your browser settings and try again.')
        } else if (err.name === 'NotFoundError' || err.name === 'NotReadableError') {
          setError('Could not start the camera. Check that no other app is using it.')
        } else {
          setError('Could not load the AI model. Check your internet and try again.')
        }
      }
    }

    start()

    return () => {
      stopped = true
      cancelAnimationFrame(frameId)
      stream?.getTracks().forEach((track) => track.stop())
      window.speechSynthesis?.cancel()
    }
  }, [exerciseId])

  useEffect(() => {
    if (phase !== 'countdown') return

    let value = 3
    speak('3')

    const timer = setInterval(() => {
      value -= 1
      if (value > 0) {
        setCountdown(value)
        speak(String(value))
        return
      }
      clearInterval(timer)
      startedAtRef.current = new Date().toISOString()
      changePhase('live')
      setMessage('Go')
      speak('Go')
    }, 1000)

    return () => clearInterval(timer)
  }, [phase])

  async function finish() {
    changePhase('saving')
    videoRef.current?.srcObject?.getTracks().forEach((track) => track.stop())

    if (reps > 0) {
      const { error: saveFailed } = await saveWorkout({
        userId: user.id,
        title: `AI ${exercise.name}`,
        goal,
        startedAt: startedAtRef.current,
        finishedAt: new Date().toISOString(),
        sets: [{ exercise_id: exercise.id, exercise_name: exercise.name, position: 0, set_number: 1, reps }],
      })
      if (saveFailed) setSaveError(saveFailed)
    }

    changePhase('done')
  }

  if (!exercise || !isReady(exerciseId)) return <Navigate to="/ai-coach" replace />

  if (phase === 'done') {
    return (
      <AppLayout>
        <div className="mx-auto max-w-xl px-4 py-10 sm:px-8">
          <Card>
            <p className="text-xs font-semibold tracking-wider text-volt uppercase">Set complete</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{exercise.name}</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-4xl font-semibold tabular-nums">{reps}</p>
                <p className="mt-1 text-sm text-mute">Good reps</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-4xl font-semibold tabular-nums">{noReps}</p>
                <p className="mt-1 text-sm text-mute">Not counted</p>
              </div>
            </div>
            <p className={`mt-5 text-sm ${saveError ? 'text-danger' : 'text-soft'}`}>
              {saveError
                ? `Could not save: ${saveError}`
                : reps > 0
                  ? 'Saved to your workout history.'
                  : 'No reps counted, so nothing was saved.'}
            </p>
            <Link
              to="/ai-coach"
              className="mt-6 flex h-12 items-center justify-center rounded-full bg-volt text-sm font-semibold text-ink"
            >
              Back to AI Coach
            </Link>
          </Card>
        </div>
      </AppLayout>
    )
  }

  const isLive = phase === 'live'

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-8 lg:py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wider text-volt uppercase">AI Coach</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{exercise.name}</h1>
          </div>
          <Link to="/ai-coach" className="text-sm text-mute hover:text-paper">
            Cancel
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="relative overflow-hidden rounded-3xl bg-charcoal">
            <video ref={videoRef} muted playsInline className="aspect-video w-full -scale-x-100 object-cover" />
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full -scale-x-100 object-cover" />

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink/90 p-6 text-center text-sm text-danger">
                {error}
              </div>
            )}

            {!error && phase === 'countdown' && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink/40">
                <span className="text-8xl font-semibold text-volt tabular-nums">{countdown}</span>
              </div>
            )}

            {!error && !isLive && phase !== 'countdown' && (
              <p className="absolute inset-x-4 bottom-4 rounded-full bg-ink/80 px-4 py-2 text-center text-sm text-paper backdrop-blur">
                {message}
              </p>
            )}
          </div>

          <Card className="flex flex-col">
            <p className="text-sm text-mute">Reps</p>
            <p className="mt-1 text-7xl font-semibold tabular-nums">
              {reps}
              <span className="text-2xl text-mute"> / {target}</span>
            </p>
            <p className="mt-2 text-sm text-mute">Not counted: {noReps}</p>

            <p
              className={`mt-6 rounded-2xl px-4 py-3 text-center text-lg font-semibold ${
                message === MESSAGES.good || message === 'Go' ? 'bg-volt/15 text-volt' : 'bg-white/5 text-paper'
              }`}
            >
              {isLive ? message : 'Get ready'}
            </p>
            {reps >= target && <p className="mt-3 text-center text-sm text-teal">Target done. Finish when you are ready.</p>}

            <button
              type="button"
              onClick={finish}
              disabled={!isLive}
              className="mt-auto h-12 w-full rounded-full bg-volt text-sm font-semibold text-ink disabled:opacity-40 max-lg:mt-6"
            >
              {phase === 'saving' ? 'Saving...' : 'Finish set'}
            </button>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
