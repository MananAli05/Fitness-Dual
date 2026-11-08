const STANDING = {
  head: [100, 22],
  shoulders: [[85, 42], [115, 42]],
  elbows: [[80, 65], [120, 65]],
  wrists: [[78, 88], [122, 88]],
  hips: [[90, 85], [110, 85]],
  knees: [[90, 115], [110, 115]],
  ankles: [[90, 148], [110, 148]],
}

export const AI_EXERCISES = [
  {
    id: 'squat',
    checks: 'How low you go and if your knees cave in',
    poses: [
      {
        head: [100, 22],
        shoulders: [[100, 42], [100, 42]],
        elbows: [[100, 65], [100, 65]],
        wrists: [[100, 88], [100, 88]],
        hips: [[100, 85], [100, 85]],
        knees: [[100, 115], [100, 115]],
        ankles: [[100, 148], [100, 148]],
      },
      {
        head: [98, 44],
        shoulders: [[92, 62], [92, 62]],
        elbows: [[114, 70], [114, 70]],
        wrists: [[138, 70], [138, 70]],
        hips: [[72, 108], [72, 108]],
        knees: [[110, 112], [110, 112]],
        ankles: [[100, 148], [100, 148]],
      },
    ],
  },
  {
    id: 'bicep-curl',
    checks: 'Full curl up and down, elbows staying still',
    poses: [
      STANDING,
      { ...STANDING, elbows: [[82, 66], [118, 66]], wrists: [[86, 44], [114, 44]] },
    ],
  },
  {
    id: 'shoulder-press',
    checks: 'Arms fully straight at the top',
    poses: [
      { ...STANDING, elbows: [[68, 46], [132, 46]], wrists: [[70, 24], [130, 24]] },
      { ...STANDING, elbows: [[78, 20], [122, 20]], wrists: [[88, -2], [112, -2]] },
    ],
  },
  {
    id: 'lateral-raise',
    checks: 'Both arms even and up to shoulder height',
    poses: [
      STANDING,
      { ...STANDING, elbows: [[62, 44], [138, 44]], wrists: [[40, 46], [160, 46]] },
    ],
  },
  {
    id: 'jumping-jacks',
    checks: 'Arms and legs opening together',
    poses: [
      { ...STANDING, knees: [[94, 115], [106, 115]], ankles: [[96, 148], [104, 148]] },
      {
        ...STANDING,
        elbows: [[72, 24], [128, 24]],
        wrists: [[62, 4], [138, 4]],
        knees: [[82, 115], [118, 115]],
        ankles: [[72, 148], [128, 148]],
      },
    ],
  },
]
