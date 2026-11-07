import { Search } from 'lucide-react'
import { useState } from 'react'
import { searchFoods } from '../../utils/nutrition.js'
import TextField from '../common/TextField.jsx'

export default function FoodSearch({ onSelect, onManual }) {
  const [query, setQuery] = useState('')
  const results = searchFoods(query)
  const hasQuery = query.trim().length > 0

  return (
    <div>
      <TextField
        id="food-search"
        label="What did you eat?"
        icon={Search}
        placeholder="Search, e.g. roti, daal, anda"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {hasQuery && results.length > 0 && (
        <ul className="mt-2 divide-y divide-line overflow-hidden rounded-xl border border-line">
          {results.map((food) => (
            <li key={food.id}>
              <button
                type="button"
                onClick={() => onSelect(food)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-white/5"
              >
                <span className="min-w-0">
                  <span className="block font-medium">{food.name}</span>
                  <span className="block text-xs text-mute">1 {food.portion}</span>
                </span>
                <span className="shrink-0 text-sm text-soft tabular-nums">{food.calories} kcal</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {hasQuery && results.length === 0 && (
        <p className="mt-3 text-sm text-soft">No food found for &quot;{query.trim()}&quot;.</p>
      )}

      <button type="button" onClick={onManual} className="mt-3 text-sm font-medium text-teal hover:underline">
        Can&apos;t find your food? Enter it yourself
      </button>
    </div>
  )
}
