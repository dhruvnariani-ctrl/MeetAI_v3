
import { Container, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import PageShell from '../components/PageShell'
import HowItWorksHero from '../components/howItWorks/HowItWorksHero'
import HowItWorksSections from '../components/howItWorks/HowItWorksSections'

export default function HowItWorks() {
  const navigate = useNavigate()

  return (
    <PageShell>
      <Container maxWidth="lg" sx={{ py: { xs: 2.5, sm: 3 } }}>
        <Stack spacing={{ xs: 2.5, md: 2 }}>
          <HowItWorksHero />

          <HowItWorksSections />
        </Stack>
      </Container>
    </PageShell>
  )
}