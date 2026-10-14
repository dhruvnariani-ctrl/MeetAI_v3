
import { Stack } from '@mui/material'

import PageShell from '../components/PageShell'
import HowItWorksHero from '../components/howItWorks/HowItWorksHero'
import HowItWorksSections from '../components/howItWorks/HowItWorksSections'

export default function HowItWorks() {

  return (
    <PageShell>
      <Stack
        spacing={1.5}
        sx={{
          width: '100%',
          minWidth: 0,
        }}
      >
        <HowItWorksHero />

        <HowItWorksSections />
      </Stack>
    </PageShell>
  )
}
