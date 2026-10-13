import { Box, Divider, Paper, Stack, Typography } from '@mui/material'
import { TrendingUp } from '@mui/icons-material'

import {
  CARD_SX,
  COLORS,
  PROGRESS_STATUSES,
  STATUS_COLORS,
} from './taskConstants'
import MetricLine from './MetricLine'
import SectionHeading from './SectionHeading'

export default function TaskProgressCard({ filterCounts, progress }) {
  return (
    <Paper elevation={0} sx={CARD_SX}>
      <SectionHeading icon={<TrendingUp />} title="Task progress" />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(100px, .9fr) minmax(0, 1.1fr)',
            lg: 'minmax(80px, .9fr) minmax(0, 1.1fr)',
          },
          alignItems: 'center',
          gap: 1,
          mt: 1.75,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 145,
            aspectRatio: '1',
            mx: 'auto',
            borderRadius: '50%',
            background: `conic-gradient(${COLORS.green} ${progress}%, #E7EEF3 ${progress}% 100%)`,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Box
            sx={{
              width: '79%',
              height: '79%',
              borderRadius: '50%',
              backgroundColor: COLORS.white,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{
                color: COLORS.navy,
                fontSize: '1.15rem',
                fontWeight: 800,
                lineHeight: 1.2,
              }}
            >
              {filterCounts.Done}/{filterCounts.All}
            </Typography>

            <Typography sx={{ mt: 0.35, color: COLORS.muted, fontSize: '0.65rem' }}>
              completed
            </Typography>
          </Box>
        </Box>

        <Stack spacing={1.15}>
          {PROGRESS_STATUSES.map((status) => (
            <MetricLine
              key={status}
              label={status}
              count={filterCounts[status]}
              color={STATUS_COLORS[status].dot}
            />
          ))}
        </Stack>
      </Box>

      <Divider sx={{ my: 1.5, borderColor: COLORS.border }} />

      <Stack
  direction="row"
  alignItems="center"
  justifyContent="space-between"
  sx={{
    flex: 1,
    width: '100%',
    minWidth: 0,
  }}
  gap={0.75}
>
  <Typography
    sx={{
      color: COLORS.muted,
      fontSize: '0.7rem',
      textAlign: 'left',
      flex: 1,
    }}
  >
    Overall completion
  </Typography>

  <Typography
    sx={{
      color: COLORS.green,
      fontSize: '0.75rem',
      fontWeight: 800,
      textAlign: 'right',
      ml: 'auto',
      flexShrink: 0,
    }}
  >
    {progress}%
  </Typography>
</Stack>

      <Box
        sx={{
          mt: 0.8,
          height: 7,
          borderRadius: 99,
          backgroundColor: '#E7EEF3',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: `${progress}%`,
            borderRadius: 99,
            backgroundColor: COLORS.green,
            transition: 'width .25s ease',
          }}
        />
      </Box>
    </Paper>
  )
}
