import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined'
import DashboardOutlined from '@mui/icons-material/DashboardOutlined'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { HOW_IT_WORKS_SECTIONS } from '../../data/sections'

/* Accent colours cycle across the numbered cards (also used by the Quick Guide). */
export const ACCENTS = [
  { color: '#1b8a55', bg: '#e8f6ee' },
  { color: '#2f6fe4', bg: '#e8f0fd' },
  { color: '#7a4de0', bg: '#efe9fc' },
  { color: '#e8820c', bg: '#fff1dd' },
  { color: '#d6336c', bg: '#fdebf2' },
  { color: '#0f8b9d', bg: '#e3f5f8' },
]

/* Three cards per row on tablet/desktop, so 6 cards = 3 + 3 and 5 cards = 3 + 2. */
export const THREE_COLUMNS = {
  xs: '1fr',
  sm: 'repeat(2, minmax(0, 1fr))',
  md: 'repeat(3, minmax(0, 1fr))',
}

/* Used only when data/sections.js has no Dashboard entry of its own. */
const DASHBOARD_SECTION = {
  id: 'dashboard',
  title: 'Dashboard',
  icon: DashboardOutlined,
  description: 'Your day at a glance.',
  steps: [
    'See today’s meetings and what is live now.',
    'Check the tasks that need your attention.',
    'Jump into any meeting in one click.',
  ],
}

const hasDashboard = HOW_IT_WORKS_SECTIONS.some((section) =>
  /dashboard/i.test(`${section.id ?? ''} ${section.title ?? ''}`),
)

const SECTIONS = hasDashboard
  ? HOW_IT_WORKS_SECTIONS
  : [DASHBOARD_SECTION, ...HOW_IT_WORKS_SECTIONS]

/* Numbered, colour-coded card for every section. */
export default function HowItWorksSections() {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: THREE_COLUMNS,
      }}
    >
      {SECTIONS.map((section, index) => {
        const Icon = section.icon
        const accent = ACCENTS[index % ACCENTS.length]

        return (
          <Card
            key={section.id}
            id={`how-it-works-${section.id}`}
            elevation={0}
            sx={{
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '10px',
              overflow: 'hidden',
              transition: 'box-shadow 180ms ease, transform 180ms ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 22px rgba(30, 60, 90, .1)',
              },
            }}
          >
            {/* Illustration area */}
            <Box
              sx={{
                position: 'relative',
                height: 80,
                display: 'grid',
                placeItems: 'center',
                overflow: 'hidden',
                bgcolor: accent.bg,
                color: accent.color,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -28,
                  right: -18,
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,.55)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -16,
                  left: -10,
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,.4)',
                }}
              />

              <Icon sx={{ fontSize: 40, position: 'relative' }} />

              {index === 0 && (
                <Chip
                  label="Start here"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    height: 20,
                    borderRadius: '6px',
                    fontSize: '.64rem',
                    fontWeight: 700,
                    bgcolor: '#fff',
                    color: accent.color,
                  }}
                />
              )}
            </Box>

            <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
              <Stack direction="row" spacing={0.75} alignItems="baseline">
                <Typography
                  sx={{ fontSize: '1.1rem', fontWeight: 800, color: accent.color }}
                >
                  {index + 1}.
                </Typography>
                <Typography sx={{ fontSize: '.95rem', fontWeight: 700, lineHeight: 1.3 }}>
                  {section.title}
                </Typography>
              </Stack>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: '.76rem',
                  lineHeight: 1.55,
                  color: 'text.secondary',
                }}
              >
                {section.description}
              </Typography>

              <Stack spacing={0.75} sx={{ mt: 1.25 }}>
                {section.steps.map((step, stepIndex) => (
                  <Stack
                    key={`${section.id}-${stepIndex}`}
                    direction="row"
                    spacing={0.8}
                    alignItems="flex-start"
                  >
                    <CheckCircleOutlined
                      sx={{ mt: '.1rem', fontSize: 15, color: accent.color, flexShrink: 0 }}
                    />
                    <Typography
                      sx={{ fontSize: '.72rem', lineHeight: 1.5, color: 'text.secondary' }}
                    >
                      {step}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        )
      })}
    </Box>
  )
}