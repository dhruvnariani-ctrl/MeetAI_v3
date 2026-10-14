import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import ArrowForward from '@mui/icons-material/ArrowForward'
import Lightbulb from '@mui/icons-material/Lightbulb'

import TourHint from './TourHint'

/* Full-screen "Take a quick tour" welcome shown before the first step. */
export default function TourIntro({ onStart, onSkip }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1500,
        bgcolor: 'rgba(20, 34, 50, .55)',
        display: 'grid',
        placeItems: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={12}
        sx={{ width: '100%', maxWidth: 480, borderRadius: '12px', overflow: 'hidden' }}
      >
        <LinearProgress variant="determinate" value={0} sx={{ height: 4 }} />

        <Box sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={2.5}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '12px',
                display: 'grid',
                placeItems: 'center',
                bgcolor: '#eaf2fd',
                color: 'primary.main',
              }}
            >
              <Lightbulb />
            </Box>

            <Box>
              <Typography
                sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary' }}
              >
                MeetAI guided tour
              </Typography>
              <Typography
                sx={{ mt: 0.5, fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.25 }}
              >
                Take a quick tour
              </Typography>
              <Typography
                sx={{
                  mt: 1,
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  color: 'text.secondary',
                }}
              >
                We’ll walk you through the sidebar, dashboard, calendar,
                meetings, recordings, and action items so you know where
                everything is.
              </Typography>
            </Box>

            <TourHint label="What to expect">
              Follow the highlighted areas and use Next to move through the
              tour. You can skip it at any time.
            </TourHint>

            <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
              <Button
                size="small"
                color="inherit"
                onClick={onSkip}
                sx={{ textTransform: 'none', color: 'text.secondary' }}
              >
                Not now
              </Button>
              <Button
                size="small"
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={onStart}
                sx={{ textTransform: 'none' }}
              >
                Start tour
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}