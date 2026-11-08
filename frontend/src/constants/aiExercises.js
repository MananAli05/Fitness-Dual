import bicepCurlImage from '../assets/images/ai/bicep-curl.webp'
import jumpingJacksImage from '../assets/images/ai/jumping-jacks.webp'
import lateralRaiseImage from '../assets/images/ai/lateral-raise.webp'
import shoulderPressImage from '../assets/images/ai/shoulder-press.webp'
import squatImage from '../assets/images/ai/squat.webp'

export const AI_EXERCISES = [
  { id: 'squat', image: squatImage, checks: 'How low you go and if your knees cave in' },
  { id: 'bicep-curl', image: bicepCurlImage, checks: 'Full curl up and down, elbows staying still' },
  { id: 'shoulder-press', image: shoulderPressImage, checks: 'Arms fully straight at the top' },
  { id: 'lateral-raise', image: lateralRaiseImage, checks: 'Both arms even and up to shoulder height' },
  { id: 'jumping-jacks', image: jumpingJacksImage, checks: 'Arms and legs opening together' },
]
