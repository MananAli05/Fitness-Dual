import { useState } from 'react'
import Alert from '../components/common/Alert.jsx'
import Card from '../components/common/Card.jsx'
import ChoiceGrid from '../components/common/ChoiceGrid.jsx'
import NumberField from '../components/profile/NumberField.jsx'
import TargetCards from '../components/profile/TargetCards.jsx'
import { ACTIVITY_LEVELS, FITNESS_LEVELS, GENDERS, GOALS, NUMBER_FIELDS } from '../constants/profile.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useProfile } from '../context/ProfileContext.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import { calculateTargets } from '../utils/targets.js'
import { getNumberError } from '../utils/validation.js'

const EDITABLE_FIELDS = ['gender', 'age', 'height_cm', 'weight_kg', 'activity_level', 'fitness_level', 'goal']

function getFormValues(profile) {
  return Object.fromEntries(EDITABLE_FIELDS.map((field) => [field, profile?.[field] ?? '']))
}

export default function Profile() {
  const { user } = useAuth()
  const { profile, name, save } = useProfile()
  const [form, setForm] = useState(() => getFormValues(profile))
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState(null)
  const [saving, setSaving] = useState(false)

  const targets = calculateTargets(form)
  const hasChanges = EDITABLE_FIELDS.some((field) => String(form[field] ?? '') !== String(profile?.[field] ?? ''))

  const handleChange = (field) => (value) => {
    setForm({ ...form, [field]: value })
    setErrors({ ...errors, [field]: undefined })
    setNotice(null)
  }

  const handleReset = () => {
    setForm(getFormValues(profile))
    setErrors({})
    setNotice(null)
  }

  const handleSave = async (e) => {
    e.preventDefault()

    const newErrors = {}
    Object.keys(NUMBER_FIELDS).forEach((field) => {
      const error = getNumberError(field, form[field])
      if (error) newErrors[field] = error
    })

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setSaving(true)
    const { error } = await save({
      ...form,
      age: Number(form.age),
      height_cm: Number(form.height_cm),
      weight_kg: Number(form.weight_kg),
    })
    setSaving(false)

    if (error) {
      setNotice({ type: 'error', text: error })
    } else {
      setNotice({ type: 'success', text: 'Profile saved. Your targets are updated.' })
    }
  }

  return (
    <AppLayout>
      <form onSubmit={handleSave} className="mx-auto max-w-[1100px] px-4 py-6 sm:px-8 lg:py-8" noValidate>
        <header className="flex flex-wrap items-center gap-5">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-volt text-2xl font-bold text-ink uppercase">
            {name[0]}
          </span>
          <div className="min-w-0">
            <p className="text-xs tracking-[0.14em] text-mute uppercase">Profile</p>
            <h1 className="mt-1 truncate text-[clamp(1.9rem,4vw,3rem)] leading-none font-semibold tracking-[-0.04em] capitalize">
              {name}
            </h1>
            <p className="mt-1.5 text-sm text-mute">{user?.email}</p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              disabled={!hasChanges || saving}
              onClick={handleReset}
              className="h-12 rounded-full border border-line px-6 text-sm font-medium transition hover:border-paper disabled:opacity-40"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={!hasChanges || saving}
              className="h-12 rounded-full bg-volt px-8 text-sm font-semibold text-ink transition hover:bg-volt-hi disabled:opacity-40"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </header>

        {notice && (
          <div className="mt-6">
            <Alert type={notice.type}>{notice.text}</Alert>
          </div>
        )}

        <TargetCards targets={targets} />

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card title="Body" delay={0.06}>
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-[11px] font-medium tracking-[0.14em] text-mute uppercase">Sex</p>
                <ChoiceGrid
                  options={GENDERS}
                  value={form.gender}
                  onChange={handleChange('gender')}
                  columns={3}
                  label="Sex"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {Object.keys(NUMBER_FIELDS).map((field) => (
                  <NumberField
                    key={field}
                    id={field}
                    value={form[field]}
                    onChange={handleChange(field)}
                    error={errors[field]}
                  />
                ))}
              </div>
            </div>
          </Card>

          <Card title="Phase" delay={0.1}>
            <ChoiceGrid options={GOALS} value={form.goal} onChange={handleChange('goal')} columns={2} label="Phase" />
            <p className="mt-4 text-sm text-mute">
              {form.goal === 'cut'
                ? 'Cut: 500 kcal below maintenance and higher protein to keep your muscle.'
                : 'Bulk: 300 kcal above maintenance for steady, lean muscle gain.'}
            </p>
          </Card>

          <Card title="Daily activity" delay={0.14}>
            <ChoiceGrid
              options={ACTIVITY_LEVELS}
              value={form.activity_level}
              onChange={handleChange('activity_level')}
              label="Daily activity"
            />
          </Card>

          <Card title="Training experience" delay={0.18}>
            <ChoiceGrid
              options={FITNESS_LEVELS}
              value={form.fitness_level}
              onChange={handleChange('fitness_level')}
              label="Training experience"
            />
          </Card>
        </div>
      </form>
    </AppLayout>
  )
}
