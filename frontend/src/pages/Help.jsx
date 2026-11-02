import Card from '../components/common/Card.jsx'
import PageHeader from '../components/common/PageHeader.jsx'
import PillButton from '../components/common/PillButton.jsx'
import HelpSection from '../components/help/HelpSection.jsx'
import { HELP_LINKS, HELP_SECTIONS } from '../constants/help.js'
import AppLayout from '../layouts/AppLayout.jsx'

export default function Help() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-8 lg:py-8">
        <PageHeader
          eyebrow="Support"
          title="Help & Support"
          subtitle="Answers to common questions about phases, workouts, nutrition and your account."
        />

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start">
          <div className="space-y-4 lg:col-span-8">
            {HELP_SECTIONS.map((section, index) => (
              <HelpSection key={section.title} {...section} delay={index * 0.04} />
            ))}
          </div>

          <Card title="Quick links" className="lg:sticky lg:top-8 lg:col-span-4" delay={0.08}>
            <div className="grid gap-2">
              {HELP_LINKS.map((link) => (
                <PillButton key={link.to} variant="outline" to={link.to} className="justify-start">
                  {link.label}
                </PillButton>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
