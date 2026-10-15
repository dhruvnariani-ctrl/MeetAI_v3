
import { useMemo, useRef, useState } from 'react'
import { EmptyPanel } from '../PageShell'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'

import MeetingToggles from '../MeetingToggles'

import {
  COLORS,
  statusOf,
  formatTime,
  platformOf,
  participantCount,
} from './dashboardUtils'

function getStatusColors(status) {
  if (status === 'live') {
    return {
      accent: COLORS.green,
      border: '#C7E3D5',
      surface: COLORS.paleGreen,
      label: 'LIVE NOW',
    }
  }

  if (status === 'past') {
    return {
      accent: '#8B9BA7',
      border: COLORS.border,
      surface: '#F5F8FA',
      label: 'COMPLETED',
    }
  }

  return {
    accent: COLORS.blue,
    border: '#D1E2F1',
    surface: COLORS.paleBlue,
    label: 'UPCOMING',
  }
}

function MeetingRow({ meeting, now, settings, onSettingsChange }) {
  const navigate = useNavigate()
  const status = statusOf(meeting, now)
  const colors = getStatusColors(status)
  const platform = platformOf(meeting)
  const people = participantCount(meeting)

  const meetingSettings = settings?.[meeting.id] ?? {
    autoJoin: meeting?.meetAI?.invited === true,
    recordVideo: meeting?.meetAI?.recordVideo === true,
  }

  const openMeetingDetails = () => {
    navigate(`/meetings/${meeting.id}`)
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '54px minmax(0, 1fr)',
          sm: '66px minmax(0, 1fr)',
        },
        gap: { xs: 0.6, sm: 0.9 },
        alignItems: 'stretch',
      }}
    >
      {/* Timeline time */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          pt: 1,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '50%',
            width: '1px',
            bgcolor: '#E4EBF0',
            transform: 'translateX(-50%)',
          }}
        />

        <Typography
          sx={{
            position: 'relative',
            zIndex: 1,
            alignSelf: 'flex-start',
            px: 0.35,
            py: 0.2,
            bgcolor: '#FFFFFF',
            color: status === 'live' ? COLORS.green : COLORS.muted,
            fontSize: '.65rem',
            fontWeight: 750,
            lineHeight: 1.4,
            textAlign: 'center',
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
          }}
        >
          {formatTime(meeting._start)}
        </Typography>
      </Box>

      {/* Meeting card */}
      <Paper
        elevation={0}
        sx={{
          minWidth: 0,
          mb: 0.6,
          border: `1px solid ${colors.border}`,
          borderLeft: `3px solid ${colors.accent}`,
          borderRadius: '8px',
          overflow: 'hidden',
          bgcolor: '#FFFFFF',
          transition: 'box-shadow 140ms ease',
          '&:hover': {
            boxShadow: '0 3px 10px rgba(18,58,89,0.06)',
          },
        }}
      >
        {/* Clickable meeting information */}
        <ButtonBase
          onClick={openMeetingDetails}
          aria-label={`View meeting details for ${meeting.title || 'Untitled meeting'}`}
          sx={{
            display: 'block',
            width: '100%',
            minWidth: 0,
            p: { xs: 0.8, sm: 0.9 },
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'background-color 140ms ease',
            '&:hover': {
              bgcolor: '#F8FBFD',
            },
            '&:focus-visible': {
              outline: `2px solid ${COLORS.blue}`,
              outlineOffset: '-3px',
            },
          }}
        >
          {/* Meeting time and status */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 0.6,
              flexWrap: 'wrap',
            }}
          >
            <Typography
              sx={{
                color: colors.accent,
                fontSize: '.68rem',
                fontWeight: 750,
                lineHeight: 1.4,
              }}
            >
              {formatTime(meeting._start)} – {formatTime(meeting._end)}
            </Typography>

            <Typography
              sx={{
                color: colors.accent,
                bgcolor: colors.surface,
                borderRadius: '8px',
                px: 0.55,
                py: 0.15,
                fontSize: '.56rem',
                lineHeight: 1.4,
                fontWeight: 800,
                letterSpacing: '.025em',
                whiteSpace: 'nowrap',
              }}
            >
              {colors.label}
            </Typography>
          </Box>

          {/* Meeting title */}
          <Typography
            sx={{
              mt: 0.3,
              color: COLORS.navy,
              fontSize: '.79rem',
              fontWeight: 750,
              lineHeight: 1.4,
              overflowWrap: 'anywhere',
            }}
          >
            {meeting.title || 'Untitled meeting'}
          </Typography>

          {/* Platform, participants, and View details on one line */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              columnGap: 1,
              rowGap: 0.5,
              mt: 0.35,
              color: COLORS.muted,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1,
                minWidth: 0,
                flex: '1 1 auto',
              }}
            >
              {platform && (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.35,
                    fontSize: '.66rem',
                  }}
                >
                  <VideocamOutlinedIcon sx={{ fontSize: 14 }} />
                  {platform}
                </Box>
              )}

              {people > 0 && (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.35,
                    fontSize: '.66rem',
                  }}
                >
                  <GroupsOutlinedIcon sx={{ fontSize: 14 }} />
                  {people}
                </Box>
              )}
            </Box>

            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 0.3,
                flexShrink: 0,
                color: COLORS.blue,
                whiteSpace: 'nowrap',
                '& .meeting-details-label': {
                  textDecoration: 'none',
                },
                '&:hover .meeting-details-label': {
                  textDecoration: 'underline',
                },
                '&:hover .meeting-details-arrow': {
                  transform: 'translateX(2px)',
                },
              }}
            >
              <Typography
                className="meeting-details-label"
                sx={{
                  fontSize: '.65rem',
                  fontWeight: 700,
                  lineHeight: 1.4,
                }}
              >
                View Meeting details
              </Typography>

              <ArrowForwardRoundedIcon
                className="meeting-details-arrow"
                sx={{
                  fontSize: 14,
                  transition: 'transform 140ms ease',
                }}
              />
            </Box>
          </Box>
        </ButtonBase>

        {/* MeetAI and video controls are separate from navigation */}
        <Box
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: { xs: 0.35, sm: 0.7 },
            px: 0.8,
            py: 0.2,
            minHeight: 31,
            bgcolor: colors.surface,
            borderTop: `1px solid ${colors.border}`,
            '& > *': {
              maxWidth: '100%',
            },
            '& .MuiTypography-root': {
              fontSize: '.65rem',
            },
          }}
        >
          <MeetingToggles
            meeting={meeting}
            settings={meetingSettings}
            onChange={onSettingsChange}
            disabled={status === 'past'}
          />
        </Box>
      </Paper>
    </Box>
  )
}

function MeetingGroup({
  title,
  status,
  meetings,
  now,
  meetingSettings,
  onSettingsChange,
  defaultExpanded = true,
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  const styles = {
    live: {
      color: COLORS.green,
      background: COLORS.paleGreen,
      dot: COLORS.green,
    },
    upcoming: {
      color: COLORS.blue,
      background: COLORS.paleBlue,
      dot: COLORS.blue,
    },
    past: {
      color: COLORS.muted,
      background: '#F1F4F6',
      dot: '#8B9BA7',
    },
  }

  const style = styles[status]

  return (
    <Box
      component="section"
      sx={{
        border: `1px solid ${COLORS.border}`,
        borderRadius: '8px',
        overflow: 'hidden',
        bgcolor: '#FFFFFF',
      }}
    >
      <ButtonBase
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        sx={{
          width: '100%',
          minHeight: 36,
          px: 1,
          py: 0.55,
          display: 'flex',
          justifyContent: 'space-between',
          gap: 0.75,
          textAlign: 'left',
          bgcolor: expanded ? style.background : '#FFFFFF',
          '&:hover': {
            bgcolor: style.background,
          },
          '&:focus-visible': {
            outline: `2px solid ${COLORS.blue}`,
            outlineOffset: '-2px',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.65,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              flexShrink: 0,
              bgcolor: style.dot,
            }}
          />

          <Typography
            sx={{
              color: COLORS.navy,
              fontSize: '.75rem',
              fontWeight: 750,
            }}
          >
            {title}
          </Typography>

          <Box
            sx={{
              minWidth: 20,
              height: 19,
              px: 0.5,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '8px',
              bgcolor: '#FFFFFF',
              border: `1px solid ${style.color}25`,
              color: style.color,
              fontSize: '.62rem',
              fontWeight: 800,
            }}
          >
            {meetings.length}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.3,
          }}
        >
          <Typography
            sx={{
              color: style.color,
              fontSize: '.62rem',
              fontWeight: 700,
            }}
          >
            {expanded ? 'Hide' : 'Show'}
          </Typography>

          {expanded ? (
            <ExpandLessRoundedIcon
              sx={{ fontSize: 17, color: style.color }}
            />
          ) : (
            <ExpandMoreRoundedIcon
              sx={{ fontSize: 17, color: style.color }}
            />
          )}
        </Box>
      </ButtonBase>

      {expanded && (
        <Box
          sx={{
            display: 'grid',
            gap: 0.5,
            p: 0.65,
            borderTop: `1px solid ${COLORS.border}`,
          }}
        >
          {meetings.length === 0 ? (
            <Typography
              sx={{
                px: 0.6,
                py: 0.85,
                color: COLORS.muted,
                fontSize: '.68rem',
              }}
            >
              {status === 'live'
                ? 'No meetings are live right now.'
                : status === 'upcoming'
                  ? 'No more meetings scheduled today.'
                  : 'No completed meetings yet.'}
            </Typography>
          ) : (
            meetings.map((meeting) => (
              <MeetingRow
                key={meeting.id}
                meeting={meeting}
                now={now}
                settings={meetingSettings}
                onSettingsChange={(changes) =>
                  onSettingsChange?.(meeting.id, changes)
                }
              />
            ))
          )}
        </Box>
      )}
    </Box>
  )
}

export default function MeetingTimeline({
  meetings = [],
  now = new Date(),
  meetingSettings = {},
  onSettingsChange,
}) {
  const timelineRef = useRef(null)

  const sortedMeetings = useMemo(() => {
    const valid = [...meetings].filter(
      (meeting) =>
        meeting?._start instanceof Date &&
        meeting?._end instanceof Date &&
        !Number.isNaN(meeting._start.getTime()) &&
        !Number.isNaN(meeting._end.getTime()),
    )

    return valid.sort(
      (a, b) => a._start.getTime() - b._start.getTime(),
    )
  }, [meetings])

  const liveMeetings = sortedMeetings.filter(
    (meeting) => statusOf(meeting, now) === 'live',
  )

  const upcomingMeetings = sortedMeetings.filter(
    (meeting) => statusOf(meeting, now) === 'upcoming',
  )

  const completedMeetings = sortedMeetings.filter(
    (meeting) => statusOf(meeting, now) === 'past',
  )

  const jumpToNow = () => {
    const target = timelineRef.current?.querySelector(
      '[data-current-meeting="true"]',
    )

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    } else {
      timelineRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <Paper
      component="section"
      aria-label="Today's timeline"
      data-tour="dashboard-todays-meetings"
      elevation={0}
      sx={{
        minWidth: 0,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '12px',
        bgcolor: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      {/* Timeline header */}
      <Box
        sx={{
          px: { xs: 1.25, sm: 1.5 },
          py: 1.25,
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 0.65,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component="h2"
              sx={{
                color: COLORS.navy,
                fontSize: '.96rem',
                fontWeight: 750,
                lineHeight: 1.35,
              }}
            >
              Today&apos;s schedule
            </Typography>

            <Typography
              sx={{
                mt: 0.2,
                color: COLORS.muted,
                fontSize: '.72rem',
                lineHeight: 1.4,
              }}
            >
              Live, upcoming and completed meetings
            </Typography>
          </Box>

          {sortedMeetings.length > 0 && (
            <Button
              size="small"
              onClick={jumpToNow}
              startIcon={<AccessTimeOutlinedIcon sx={{ fontSize: 14 }} />}
              sx={{
                textTransform: 'none',
                color: COLORS.blue,
                fontWeight: 700,
                fontSize: '.67rem',
                whiteSpace: 'nowrap',
                minWidth: 0,
                px: 0.4,
              }}
            >
              Go to now
            </Button>
          )}
        </Box>
      </Box>

      {/* Timeline content */}
      {sortedMeetings.length === 0 ? (
        <Box sx={{ p: 1.5 }}>
          <EmptyPanel title="No meetings scheduled today" minHeight={140}>
            Your meetings will appear here when they are available.
          </EmptyPanel>
        </Box>
      ) : (
        <Box
          ref={timelineRef}
          sx={{
            px: { xs: 0.65, sm: 0.9 },
            py: 0.8,
          }}
        >
          <Box sx={{ display: 'grid', gap: 0.7 }}>
            <MeetingGroup
              title="Live meetings"
              status="live"
              meetings={liveMeetings}
              now={now}
              meetingSettings={meetingSettings}
              onSettingsChange={onSettingsChange}
              defaultExpanded
            />

            <MeetingGroup
              title="Upcoming meetings"
              status="upcoming"
              meetings={upcomingMeetings}
              now={now}
              meetingSettings={meetingSettings}
              onSettingsChange={onSettingsChange}
              defaultExpanded={false}
            />

            <MeetingGroup
              title="Completed meetings"
              status="past"
              meetings={completedMeetings}
              now={now}
              meetingSettings={meetingSettings}
              onSettingsChange={onSettingsChange}
              defaultExpanded={false}
            />
          </Box>
        </Box>
      )}
    </Paper>
  )
}
