import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'

export const COLORS = {
  navy: '#123A59',
  border: '#DFE7EC',
  muted: '#5A7189',
  page: '#F7F9FB',
}

/* Same accent palette as the How It Works page. */
export const ACCENTS = {
  green: { color: '#1b8a55', bg: '#e8f6ee' },
  blue: { color: '#2f6fe4', bg: '#e8f0fd' },
  purple: { color: '#7a4de0', bg: '#efe9fc' },
  orange: { color: '#e8820c', bg: '#fff1dd' },
  pink: { color: '#d6336c', bg: '#fdebf2' },
  teal: { color: '#0f8b9d', bg: '#e3f5f8' },
}

/* Checkbox / radio styling for the selectable cards. */
export const controlSx = (accent) => ({
  p: 0,
  color: '#9fb0c6',
  '&.Mui-checked': { color: accent.color },
})

/* Coloured section title: tinted icon tile + heading. */
export function Section({ accent, icon, title, hint, children }) {
  return (
    <Box component="section" sx={{ display: 'grid', gap: 1.25 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Box
          aria-hidden="true"
          sx={{
            width: 28,
            height: 28,
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '8px',
            bgcolor: accent.bg,
            color: accent.color,
            '& svg': { fontSize: 17 },
          }}
        >
          {icon}
        </Box>

        <Typography component="h3" sx={{ fontSize: '0.875rem', fontWeight: 750, color: COLORS.navy }}>
          {title}
        </Typography>

        {hint && (
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.muted }}>{hint}</Typography>
        )}
      </Stack>

      {children}
    </Box>
  )
}

/* Bordered, tinted-when-selected card wrapping a real checkbox or radio (keyboard + screen reader safe). */
export function ChoiceCard({ control, checked, accent, children }) {
  return (
    <Box
      component="label"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flex: 1,
        minWidth: 0,
        px: 1.25,
        py: 0.9,
        cursor: 'pointer',
        borderRadius: '8px',
        border: '1px solid',
        borderColor: checked ? accent.color : COLORS.border,
        bgcolor: checked ? accent.bg : '#fff',
        transition: 'border-color 160ms ease, background-color 160ms ease',
        '&:hover': { borderColor: accent.color },
        '&:focus-within': { outline: `2px solid ${accent.color}`, outlineOffset: 2 },
      }}
    >
      {control}
      <Box sx={{ minWidth: 0, flex: 1 }}>{children}</Box>
    </Box>
  )
}

/* One row of the live summary: tinted icon + small label + value. */
export function SummaryRow({ icon, accent, label, children, muted = false }) {
  return (
    <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
      <Box
        aria-hidden="true"
        sx={{
          width: 30,
          height: 30,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '8px',
          bgcolor: accent.bg,
          color: accent.color,
          '& svg': { fontSize: 17 },
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography sx={{ fontSize: '0.75rem', color: COLORS.muted }}>{label}</Typography>
        <Box
          sx={{
            fontSize: '0.75rem',
            fontWeight: 650,
            lineHeight: 1.4,
            color: muted ? COLORS.muted : COLORS.navy,
            overflowWrap: 'anywhere',
          }}
        >
          {children}
        </Box>
      </Box>
    </Stack>
  )
}

/*
 * Dialog frame: tinted header, form on the left, live summary on the right.
 * On phones it goes full screen and the summary drops below the form.
 */
export default function DialogShell({
  open,
  onClose,
  titleId,
  descId,
  icon,
  title,
  subtitle,
  accent,
  side,
  sideLabel,
  children,
}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      aria-labelledby={titleId}
      aria-describedby={descId}
      sx={{
        '& .MuiDialog-paper': {
          width: 880,
          maxWidth: '100%',
          borderRadius: fullScreen ? 0 : '14px',
          overflowY: 'auto',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2.25,
          py: 1.5,
          bgcolor: accent.bg,
          borderBottom: '1px solid',
          borderColor: COLORS.border,
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '8px',
            bgcolor: '#fff',
            color: accent.color,
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            id={titleId}
            component="h2"
            sx={{ fontSize: '1rem', fontWeight: 750, lineHeight: 1.3, color: COLORS.navy }}
          >
            {title}
          </Typography>
          <Typography id={descId} sx={{ fontSize: '0.75rem', color: COLORS.muted }}>
            {subtitle}
          </Typography>
        </Box>

        <IconButton aria-label="Close" onClick={onClose} sx={{ ml: 'auto', color: COLORS.muted }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Body */}
      <Box
        sx={{
          display: 'grid',
          flex: '0 0 auto',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.4fr) minmax(0, 1fr)' },
        }}
      >
        <Box sx={{ p: 2.25, minWidth: 0 }}>{children}</Box>

        <Box
          component="aside"
          aria-label={sideLabel}
          sx={{
            bgcolor: COLORS.page,
            borderTop: { xs: '1px solid', md: 0 },
            borderLeft: { md: '1px solid' },
            borderColor: COLORS.border,
          }}
        >
          <Box sx={{ p: 2.25, position: { md: 'sticky' }, top: 0 }}>{side}</Box>
        </Box>
      </Box>
    </Dialog>
  )
}