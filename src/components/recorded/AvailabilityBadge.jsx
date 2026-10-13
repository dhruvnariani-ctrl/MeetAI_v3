
import { Box } from '@mui/material'
const COLORS = {
  green: '#16815B',
  muted: '#71818D',
  paleGreen: '#F0F7F1',
  unavailableBg: '#F3F5F7',
}

export default function AvailabilityBadge({
  icon,
  label,
  available,
  fullWidth = true,
}) {
  const displayLabel = available
    ? label
    : label.endsWith(' available')
      ? label.replace(/ available$/, ' unavailable')
      : `${label} unavailable`

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.8,
        width: fullWidth ? '100%' : 'fit-content',
        minWidth: 0,
        minHeight: 31,
        boxSizing: 'border-box',
        px: 1,
        py: 0.65,
        borderRadius: '9px',
        bgcolor: available ? COLORS.paleGreen : COLORS.unavailableBg,
        color: available ? COLORS.green : COLORS.muted,
        fontSize: '0.68rem',
        lineHeight: 1.3,
        fontWeight: 600,
        overflowWrap: 'anywhere',
        '& .MuiSvgIcon-root': {
          flexShrink: 0,
          fontSize: 15,
        },
      }}
    >
      {icon}
      <Box component="span">{displayLabel}</Box>
    </Box>
  )
}