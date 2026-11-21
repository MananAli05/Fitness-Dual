import Avatar from '../components/common/Avatar.jsx'
import Card from '../components/common/Card.jsx'
import PageHeader from '../components/common/PageHeader.jsx'
import PillButton from '../components/common/PillButton.jsx'
import NotificationSettingsCard from '../components/settings/NotificationSettingsCard.jsx'
import PasswordCard from '../components/settings/PasswordCard.jsx'
import PhaseSettingsCard from '../components/settings/PhaseSettingsCard.jsx'
import SettingsSection from '../components/settings/SettingsSection.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useProfile } from '../context/ProfileContext.jsx'
import AppLayout from '../layouts/AppLayout.jsx'

export default function Settings() {
  const { user, signOut } = useAuth()
  const { profile, name, goal } = useProfile()

  return (
    <AppLayout>
      <div className="mx-auto max-w-[960px] px-4 py-6 sm:px-8 lg:py-8">
        <PageHeader eyebrow="Account" title="Settings" />

        <div className="mt-8 space-y-4">
          <Card>
            <div className="flex flex-wrap items-center gap-4">
              <Avatar name={name} url={profile?.avatar_url} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xl font-semibold capitalize">{name}</p>
                <p className="truncate text-sm text-mute">{user?.email}</p>
              </div>
              <span className="rounded-full bg-volt/15 px-3 py-1.5 text-xs font-semibold text-volt">
                {goal === 'cut' ? 'Phase 02 · Cut' : 'Phase 01 · Bulk'}
              </span>
              <PillButton variant="outline" size="small" to="/profile">
                Edit profile
              </PillButton>
            </div>
          </Card>

          <NotificationSettingsCard />
          <PhaseSettingsCard />
          <PasswordCard />

          <SettingsSection title="Account" description="Get help or sign out of PHAZE on this device." delay={0.16}>
            <div className="flex flex-wrap gap-3">
              <PillButton variant="outline" to="/help">
                Help &amp; Support
              </PillButton>
              <PillButton variant="danger" onClick={signOut}>
                Log out
              </PillButton>
            </div>
          </SettingsSection>
        </div>
      </div>
    </AppLayout>
  )
}
