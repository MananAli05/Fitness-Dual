import Card from '../components/common/Card.jsx'
import PageHeader from '../components/common/PageHeader.jsx'
import PillButton from '../components/common/PillButton.jsx'
import NotificationSettingsCard from '../components/settings/NotificationSettingsCard.jsx'
import PasswordCard from '../components/settings/PasswordCard.jsx'
import PhaseSettingsCard from '../components/settings/PhaseSettingsCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import AppLayout from '../layouts/AppLayout.jsx'

export default function Settings() {
  const { user, signOut } = useAuth()

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-8 lg:py-8">
        <PageHeader eyebrow="Account" title="Settings" />

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
          <div className="space-y-4">
            <NotificationSettingsCard />
            <PhaseSettingsCard />
          </div>

          <div className="space-y-4">
            <PasswordCard />

            <Card title="Account" delay={0.16}>
              <p className="text-[11px] tracking-[0.14em] text-mute uppercase">Signed in as</p>
              <p className="mt-1 truncate font-semibold">{user?.email}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                <PillButton variant="outline" to="/help">
                  Help &amp; Support
                </PillButton>
                <PillButton variant="danger" onClick={signOut}>
                  Log out
                </PillButton>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
