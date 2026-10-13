import ArrowForward from '@mui/icons-material/ArrowForward'
import PlayCircleOutlined from '@mui/icons-material/PlayCircleOutlined'
import SupportAgentOutlined from '@mui/icons-material/SupportAgentOutlined'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

const GREEN = '#1b7f4f'

/* Bottom banner: "Need a little help?" with the full tour and calendar buttons. */
export default function ReadyToStartCard({ onStartTour, onOpenCalendar }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 2.25 },
        borderRadius: '12px',
        border: '1px solid #cfe8da',
        background: 'linear-gradient(120deg, #e6f5ec 0%, #f4fbf7 70%)',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 48,
              height: 48,
              flexShrink: 0,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '50%',
              bgcolor: '#fff',
              border: '1px solid #cfe8da',
              color: GREEN,
            }}
          >
            <SupportAgentOutlined />
          </Box>

          <Box>
            <Typography sx={{ fontSize: '.95rem', fontWeight: 700, color: '#123A59' }}>
              Need a little help?
            </Typography>
            <Typography sx={{ mt: 0.25, fontSize: '.78rem', color: 'text.secondary' }}>
              Take the app tour and we’ll show you around. The full tour goes through
              MeetAI step by step.
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ width: { xs: '100%', md: 'auto' }, flexShrink: 0 }}
        >
          <Button
            variant="outlined"
            endIcon={<ArrowForward />}
            onClick={onOpenCalendar}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              whiteSpace: 'nowrap',
              color: GREEN,
              borderColor: '#9fd0b5',
              bgcolor: '#fff',
              '&:hover': { borderColor: GREEN, bgcolor: '#fff' },
            }}
          >
            Open calendar
          </Button>

          <Button
            variant="contained"
            startIcon={<PlayCircleOutlined />}
            onClick={onStartTour}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              fontWeight: 650,
              whiteSpace: 'nowrap',
              bgcolor: GREEN,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#166a42', boxShadow: 'none' },
            }}
          >
            Start App Tour
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}