function midpoint([a, b]) {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
}

function getBones(pose) {
  const bones = [
    [midpoint(pose.shoulders), midpoint(pose.hips)],
    [pose.shoulders[0], pose.shoulders[1]],
    [pose.hips[0], pose.hips[1]],
    [[pose.head[0], pose.head[1] + 10], midpoint(pose.shoulders)],
  ]

  for (const side of [0, 1]) {
    bones.push(
      [pose.shoulders[side], pose.elbows[side]],
      [pose.elbows[side], pose.wrists[side]],
      [pose.hips[side], pose.knees[side]],
      [pose.knees[side], pose.ankles[side]],
    )
  }

  return bones
}

function getJoints(pose) {
  return [pose.shoulders, pose.elbows, pose.wrists, pose.hips, pose.knees, pose.ankles].flat()
}

function Skeleton({ pose, active }) {
  const stroke = active ? 'var(--color-volt)' : 'rgb(255 255 255 / 0.28)'

  return (
    <g>
      {getBones(pose).map(([from, to], index) => (
        <line
          key={index}
          x1={from[0]}
          y1={from[1]}
          x2={to[0]}
          y2={to[1]}
          stroke={stroke}
          strokeWidth={active ? 4 : 3}
          strokeLinecap="round"
        />
      ))}
      <circle cx={pose.head[0]} cy={pose.head[1]} r="10" fill="none" stroke={stroke} strokeWidth={active ? 4 : 3} />
      {active &&
        getJoints(pose).map(([x, y], index) => <circle key={index} cx={x} cy={y} r="3.5" fill="var(--color-teal)" />)}
    </g>
  )
}

export default function PoseFigure({ poses, label }) {
  const [start, end] = poses

  return (
    <svg viewBox="22 -12 156 168" className="h-full w-full" role="img" aria-label={label}>
      <line x1="30" y1="152" x2="170" y2="152" stroke="rgb(255 255 255 / 0.1)" strokeWidth="2" strokeLinecap="round" />
      <Skeleton pose={start} />
      <Skeleton pose={end} active />
    </svg>
  )
}
