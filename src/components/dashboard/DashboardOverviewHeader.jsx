import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { COLORS, greetingFor } from './dashboardUtils'

export default function DashboardOverviewHeader({
  now,
  firstName,
  summary,
}) {
  const dateText = now.toLocaleDateString([], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <Box
      component="section"
      aria-label="Today overview"
      data-tour="dashboard-welcome"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        flexWrap: 'wrap',
        minWidth: 0,
        pb: 1.5,
        mb: 1.5,
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <Box sx={{ minWidth: 0, flex: '1 1 280px' }}>
        <Typography
          sx={{
            color: COLORS.blue,
            fontSize: '.65rem',
            fontWeight: 750,
            letterSpacing: '.07em',
            textTransform: 'uppercase',
            lineHeight: 1.4,
          }}
        >
          {dateText}
        </Typography>

        <Typography
          component="h1"
          sx={{
            mt: 0.3,
            color: COLORS.navy,
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            lineHeight: 1.2,
            fontWeight: 800,
            letterSpacing: '-.025em',
          }}
        >
          {greetingFor(now)}, {firstName}
        </Typography>

        <Typography
          aria-live="polite"
          sx={{
            mt: 0.4,
            color: COLORS.muted,
            fontSize: '.75rem',
            lineHeight: 1.45,
          }}
        >
          {summary}
        </Typography>
      </Box>
    </Box>
  )
}