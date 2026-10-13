import { Box, Stack, Typography } from '@mui/material'

import { COLORS } from './taskConstants'

export default function MetricLine({ label, count, color }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={0.8}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.8}
        sx={{ minWidth: 0 }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: color,
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            color: COLORS.text,
            fontSize: '0.73rem',
            overflowWrap: 'anywhere',
          }}
        >
          {label}
        </Typography>
      </Stack>

      <Typography
        sx={{
          color: COLORS.navy,
          fontWeight: 800,
          fontSize: '0.76rem',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {count}
      </Typography>
    </Stack>
  )
}
