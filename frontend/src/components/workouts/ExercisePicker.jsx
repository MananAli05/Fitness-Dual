import { useState } from 'react'
import { EXERCISES } from '../../constants/exercises.js'
import Card from '../common/Card.jsx'
import PillButton from '../common/PillButton.jsx'
import TextField from '../common/TextField.jsx'

export default function ExercisePicker({ onAdd, onClose }) {
  const [search, setSearch] = useState('')
  const query = search.trim().toLowerCase()
  const results = EXERCISES.filter(
    (exercise) => exercise.name.toLowerCase().includes(query) || exercise.category.toLowerCase().includes(query),
  )

  return (
    <Card title="Add exercise">
      <TextField
        id="exercise-search"
        label="Search"
        placeholder="Name or muscle group"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
      />

      <ul className="mt-4 max-h-80 divide-y divide-line overflow-y-auto">
        {results.map((exercise) => (
          <li key={exercise.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{exercise.name}</p>
              <p className="text-xs text-mute">{exercise.category}</p>
            </div>
            <PillButton variant="outline" size="small" onClick={() => onAdd(exercise.id)}>
              Add
            </PillButton>
          </li>
        ))}
        {results.length === 0 && <li className="py-3 text-sm text-mute">No exercises match your search.</li>}
      </ul>

      <button type="button" onClick={onClose} className="mt-4 text-sm text-mute transition hover:text-paper">
        Close
      </button>
    </Card>
  )
}
