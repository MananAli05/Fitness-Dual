import Card from '../common/Card.jsx'
import PillButton from '../common/PillButton.jsx'

export default function StartWorkoutCard({ plan, activeWorkout, onStartPlan, onStartEmpty }) {
  if (activeWorkout) {
    return (
      <Card title="Workout in progress">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xl font-semibold tracking-tight">{activeWorkout.title}</p>
            <p className="mt-1 text-sm text-mute">{activeWorkout.exercises.length} exercises added</p>
          </div>
          <PillButton to="/workouts/session">Resume workout</PillButton>
        </div>
      </Card>
    )
  }

  return (
    <Card title="Start a workout">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xl font-semibold tracking-tight">{plan.title}</p>
          <p className="mt-1 text-sm text-mute">
            Today&apos;s plan · {plan.minutes} min · {plan.exercises.map((exercise) => exercise.name).join(', ')}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <PillButton variant="outline" onClick={onStartEmpty}>
            Empty workout
          </PillButton>
          <PillButton onClick={onStartPlan}>Start today&apos;s plan</PillButton>
        </div>
      </div>
    </Card>
  )
}
