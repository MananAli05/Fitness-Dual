import bicepCurlImage from '../assets/images/ai/bicep-curl.webp'
import jumpingJacksImage from '../assets/images/ai/jumping-jacks.webp'
import lateralRaiseImage from '../assets/images/ai/lateral-raise.webp'
import shoulderPressImage from '../assets/images/ai/shoulder-press.webp'
import squatImage from '../assets/images/ai/squat.webp'
import bicepCurlVideo from '../assets/videos/ai/bicep-curl.mp4'
import jumpingJacksVideo from '../assets/videos/ai/jumping-jacks.mp4'
import lateralRaiseVideo from '../assets/videos/ai/lateral-raise.mp4'
import shoulderPressVideo from '../assets/videos/ai/shoulder-press.mp4'
import squatVideo from '../assets/videos/ai/squat.mp4'

export const AI_EXERCISES = [
  {
    id: 'squat',
    image: squatImage,
    video: squatVideo,
    checks: 'How low you go and if your knees cave in',
    steps: ['Feet shoulder width apart', 'Sit back until thighs are level with the floor', 'Keep your chest up and push back up'],
  },
  {
    id: 'bicep-curl',
    image: bicepCurlImage,
    video: bicepCurlVideo,
    checks: 'Full curl up and down, elbows staying still',
    steps: ['Elbows close to your body', 'Curl the weights up to your shoulders', 'Lower them all the way down'],
  },
  {
    id: 'shoulder-press',
    image: shoulderPressImage,
    video: shoulderPressVideo,
    checks: 'Arms fully straight at the top',
    steps: ['Start with weights at shoulder height', 'Press straight up until arms are straight', 'Lower slowly back to your shoulders'],
  },
  {
    id: 'lateral-raise',
    image: lateralRaiseImage,
    video: lateralRaiseVideo,
    checks: 'Both arms even and up to shoulder height',
    steps: ['Arms by your sides, elbows soft', 'Raise both arms out to shoulder height', 'Lower slowly, do not swing'],
  },
  {
    id: 'jumping-jacks',
    image: jumpingJacksImage,
    video: jumpingJacksVideo,
    checks: 'Arms and legs opening together',
    steps: ['Stand tall, feet together', 'Jump feet out and raise arms overhead', 'Jump back to the start, keep a steady pace'],
  },
]
