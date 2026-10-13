import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'

import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined'
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'

import { COLORS } from './dashboardUtils'

function QuickAction({ icon, title, onClick }) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        textAlign: 'left',
        gap: 0.65,
        minWidth: 0,
        minHeight: 40,
        px: 0.8,
        py: 0.6,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '8px',
        bgcolor: '#FFFFFF',
        color: COLORS.navy,
        '&:hover': {
          bgcolor: COLORS.paleBlue,
          borderColor: '#B8D5EA',
        },
        '&:focus-visible': {
          outline: `2px solid ${COLORS.blue}`,
          outlineOffset: 1,
        },
      }}
    >
      <Box sx={{ display: 'flex', color: COLORS.blue, flexShrink: 0 }}>
        {icon}
      </Box>

      <Typography
        sx={{
          flex: 1,
          minWidth: 0,
          fontSize: '.65rem',
          fontWeight: 650,
          lineHeight: 1.3,
        }}
      >
        {title}
      </Typography>

      <ArrowForwardRoundedIcon
        sx={{ fontSize: 13, color: COLORS.muted, flexShrink: 0 }}
      />
    </ButtonBase>
  )
}

export default function DashboardSidePanels({
  onCreate,
  onInstant,
  onNavigate,
}) {
  const actions = [
    {
      title: 'Schedule meeting',
      icon: <CalendarMonthOutlinedIcon sx={{ fontSize: 18 }} />,
      onClick: onCreate,
    },
    {
      title: 'Add MeetAI',
      icon: <VideocamOutlinedIcon sx={{ fontSize: 18 }} />,
      onClick: onInstant,
    },
    {
      title: 'View recordings',
      icon: <PlayCircleOutlineOutlinedIcon sx={{ fontSize: 18 }} />,
      onClick: () => onNavigate?.('/recorded'),
    },
    {
      title: 'My tasks',
      icon: <AssignmentTurnedInOutlinedIcon sx={{ fontSize: 18 }} />,
      onClick: () => onNavigate?.('/tasks'),
    },
  ]

  return (
    <Paper
      component="section"
      aria-label="Quick actions"
      elevation={0}
      sx={{
        p: 1.5,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '12px',
        bgcolor: '#FFFFFF',
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.65,
          mb: 1,
        }}
      >
        <BoltOutlinedIcon sx={{ fontSize: 19, color: COLORS.blue }} />

        <Typography
          component="h2"
          sx={{
            fontSize: '.96rem',
            lineHeight: 1.35,
            fontWeight: 750,
            color: COLORS.navy,
          }}
        >
          Quick actions
        </Typography>
      </Box>

      <Box
        data-tour="dashboard-new-meeting"
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 0.65,
        }}
      >
        {actions.map((action) => (
          <QuickAction key={action.title} {...action} />
        ))}
      </Box>
    </Paper>
  )
}