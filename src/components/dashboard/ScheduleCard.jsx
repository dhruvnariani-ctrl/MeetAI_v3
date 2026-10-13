import { useId } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import { formatRange } from '../../utils/time'
import InviteSwitch from '../InviteSwitch'
import MeetingListItem from '../meetings/MeetingListItem'
import useScheduleSwitch from '../../hooks/useScheduleSwitch'

export default function ScheduleCard({
  meetings = [],
  now,
  nextId,
  settings = {},
  onSettingsChange,
}) {
  const headingId = useId()
  const navigate = useNavigate()

  const {
    meetingsWithStatus,
    checked,
    disabled,
    toggle,
  } = useScheduleSwitch({
    meetings,
    now,
    nextId,
    settings,
    onSettingsChange,
  })

  const visibleMeetings = meetingsWithStatus.filter(
    ({ status }) =>
      status === 'Live' ||
      status === 'Up next' ||
      status === 'Upcoming',
  )

  return (
    <Paper
      component="section"
      aria-labelledby={headingId}
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: '20px',
        bgcolor: '#fff',
        borderColor: '#e1e6ec',
      }}
    >
      {/* Header: Invite MeetAI first, View calendar second */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mb: 1.5,
          flexWrap: 'wrap',
        }}
      >
        <Typography
          id={headingId}
          component="h2"
          sx={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#0f172a',
          }}
        >
          Today&apos;s schedule
        </Typography>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <InviteSwitch
            checked={checked}
            onChange={toggle}
            disabled={disabled}
          />

          <Button
            size="small"
            data-tour="dashboard-calendar-link"
            onClick={() => navigate('/calendar')}
            endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
            sx={{
              fontSize: '0.78rem',
              fontWeight: 600,
              textTransform: 'none',
              color: '#48658d',
              minWidth: 0,
              px: 0.75,
            }}
          >
            View calendar
          </Button>
        </Stack>
      </Box>

      {visibleMeetings.length > 0 && (
        <Typography
          sx={{
            mb: 1.5,
            fontSize: '0.75rem',
            lineHeight: 1.4,
            color: '#64748b',
          }}
        >
          <Box
            component="span"
            sx={{
              color: '#94a3b8',
              fontWeight: 700,
              mr: 0.35,
            }}
          >
            *
          </Box>
          Double-click a meeting to open meeting details.
        </Typography>
      )}

      {visibleMeetings.length === 0 ? (
        <Box sx={{ py: 3, textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            No meetings today
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: '0.78rem',
              color: 'text.secondary',
            }}
          >
            Your schedule is clear for today.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1.25}>
          {visibleMeetings.map(({ meeting, status }) => (
            <MeetingListItem
              key={meeting.id}
              meeting={meeting}
              status={status}
              timeLabel={formatRange(meeting.start, meeting.end)}
              settings={settings}
              onSettingsChange={onSettingsChange}
            />
          ))}
        </Stack>
      )}
    </Paper>
  )
}