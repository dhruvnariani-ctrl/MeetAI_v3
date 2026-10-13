import { forwardRef } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import ArrowBack from '@mui/icons-material/ArrowBack'
import ArrowForward from '@mui/icons-material/ArrowForward'
import Close from '@mui/icons-material/Close'

import TourHint from './TourHint'
import { getTourIcon } from './TourIcons'

/*
 * The floating card for one tour step.
 * `position` is { top, left } from positionCard(); the ref goes to the Paper
 * so TourRunner can measure it.
 */
const TourCard = forwardRef(function TourCard(
  { step, index, total, position, onNext, onBack, onClose },
  ref,
) {
  const current = index + 1
  const Icon = getTourIcon(step.icon)

  return (
    <Fade in timeout={180}>
      <Paper
        ref={ref}
        elevation={10}
        sx={{
          position: 'fixed',
          zIndex: 1402,
          width: { xs: 'calc(100vw - 32px)', sm: 360 },
          maxWidth: 360,
          top: { xs: 'auto', sm: position?.top ?? -9999 },
          left: { xs: 16, sm: position?.left ?? -9999 },
          bottom: { xs: 16, sm: 'auto' },
          borderRadius: 2.5,
          overflow: 'hidden',
          transition: 'top 180ms ease, left 180ms ease',
        }}
      >
        <LinearProgress
          variant="determinate"
          value={(current / total) * 100}
          sx={{ height: 4 }}
        />

        <Box sx={{ p: 2.5 }}>
          <Stack spacing={2}>
            {/* Header */}
            <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
              <Stack
                direction="row"
                spacing={1.2}
                alignItems="center"
                sx={{ flex: 1, minWidth: 0 }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: '#eaf2fd',
                    color: 'primary.main',
                    flexShrink: 0,
                  }}
                >
                  <Icon fontSize="small" />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{ fontSize: '.68rem', fontWeight: 600, color: 'text.secondary' }}
                  >
                    MeetAI tour
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.15,
                      fontSize: '1rem',
                      lineHeight: 1.3,
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {step.title}
                  </Typography>
                </Box>
              </Stack>

              <IconButton
                size="small"
                onClick={onClose}
                aria-label="Close tour"
                sx={{ ml: 'auto', flexShrink: 0, p: 0.75 }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Stack>

            {/* Description */}
            <Typography
              sx={{ fontSize: '.84rem', lineHeight: 1.55, color: 'text.secondary' }}
            >
              {step.body}
            </Typography>

            {step.action && <TourHint label="Try this">{step.action}</TourHint>}
            {step.tip && <TourHint label="Helpful tip">{step.tip}</TourHint>}

            {/* Controls */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Button
                size="small"
                color="inherit"
                onClick={onClose}
                sx={{ textTransform: 'none', color: 'text.secondary' }}
              >
                Skip tour
              </Button>

              <Stack direction="row" spacing={1}>
                {index > 0 && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={onBack}
                    sx={{ textTransform: 'none' }}
                  >
                    Back
                  </Button>
                )}
                <Button
                  size="small"
                  variant="contained"
                  endIcon={index < total - 1 ? <ArrowForward /> : undefined}
                  onClick={onNext}
                  sx={{ textTransform: 'none' }}
                >
                  {index === total - 1 ? 'Finish' : 'Next'}
                </Button>
              </Stack>
            </Stack>

            <Typography
              sx={{ textAlign: 'right', fontSize: '.67rem', color: 'text.secondary' }}
            >
              {current} of {total}
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Fade>
  )
})

export default TourCard