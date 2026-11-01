import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { calculateTargets } from '../utils/targets.js'
import { useAuth } from './AuthContext.jsx'

const ProfileContext = createContext(null)

const PROFILE_FIELDS =
  'username, full_name, goal, gender, age, height_cm, weight_kg, activity_level, fitness_level, onboarded'

export function ProfileProvider({ children }) {
  const { user } = useAuth()
  const [loadedProfile, setLoadedProfile] = useState({ userId: null, data: null })

  useEffect(() => {
    if (!user) return

    let cancelled = false

    async function fetchProfile() {
      const { data } = await supabase.from('profiles').select(PROFILE_FIELDS).eq('id', user.id).single()

      if (!cancelled) {
        setLoadedProfile({ userId: user.id, data })
      }
    }

    fetchProfile()

    return () => {
      cancelled = true
    }
  }, [user])

  async function save(changes) {
    const { data, error } = await supabase
      .from('profiles')
      .update(changes)
      .eq('id', user.id)
      .select(PROFILE_FIELDS)
      .single()

    if (error) return { error: error.message }

    setLoadedProfile({ userId: user.id, data })
    return { error: null }
  }

  const isLoaded = Boolean(user) && loadedProfile.userId === user.id
  const profile = isLoaded ? loadedProfile.data : null

  const value = {
    profile,
    loading: Boolean(user) && !isLoaded,
    save,
    name: profile?.username || profile?.full_name || user?.email?.split('@')[0] || 'Athlete',
    goal: profile?.goal ?? 'bulk',
    targets: calculateTargets(profile),
  }

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  return useContext(ProfileContext)
}
