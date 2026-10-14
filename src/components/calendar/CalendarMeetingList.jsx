
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Collapse from '@mui/material/Collapse'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'

import { EmptyPanel } from '../PageShell'
import MeetingListItem from '../meetings/MeetingListItem'
import { getStatusKey, getStatusStyle } from '../meetings/meetingHelpers'


const SECTIONS = ['Live', 'Upcoming', 'Done']

const INITIAL_MEETINGS_PER_SECTION = 5


const STORAGE_KEY = 'meetai.calendar.sections'

const readChoices = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}

    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed
      : {}
  } catch {
    return {}
  }
}

const writeChoices = (choices) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(choices))
  } catch {
    /* Storage can be unavailable; the list still works. */
  }
}


const defaultOpen = (label) => label === 'Live'

const getJoinUrl = (meeting) =>
  meeting.joinUrl ?? meeting.meetingUrl ?? meeting.link ?? meeting.url

/* Two-line summary displayed under a closed section header. */
function getPreview(label, items) {
  if (!items.length) {
    return { title: 'No meetings', time: '' }
  }

  const meeting = label === 'Done' ? items[items.length - 1] : items[0]

  const prefix =
    label === 'Live' ? 'Now' : label === 'Upcoming' ? 'Next' : 'Last'

  return {
    title: `${prefix}: ${meeting.title}`,
    time: meeting.time ?? '',
  }
}

function formatDateHeading(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

function groupByDate(meetings) {
  return meetings.reduce((groups, meeting) => {
    if (!groups[meeting.date]) {
      groups[meeting.date] = []
    }

    groups[meeting.date].push(meeting)
    return groups
  }, {})
}

export default function CalendarMeetingList({
  meetings = [],
  view,
  settings = {},
  onSettingsChange,
  compact = false,
}) {
  const navigate = useNavigate()

  /* Remember the user's section open/closed preferences. */
  const [choices, setChoices] = useState(readChoices)

  /* Track Show more / Show less independently for each section. */
  const [expandedSections, setExpandedSections] = useState({})

  const toggleSectionItems = (label) => {
    setExpandedSections((previous) => ({
      ...previous,
      [label]: !previous[label],
    }))
  }

  if (!meetings.length) {
    return (
      <EmptyPanel title="No meetings found" minHeight={140}>
        Try another date or filter, or create a new meeting.
      </EmptyPanel>
    )
  }

  const firstMeetingId = meetings[0]?.id

  /* Render meetings grouped by date when appropriate. */
  const renderMeetings = (list) => {
    const groupEntries = Object.entries(groupByDate(list))

    return (
      <Stack spacing={compact ? 1.4 : 1.5}>
        {groupEntries.map(([date, dateMeetings]) => {
          const showHeading =
            view !== 'day' && !(compact && groupEntries.length === 1)

          return (
            <Box key={date} sx={{ minWidth: 0 }}>
              {showHeading && (
                <Stack
                  direction="row"
                  sx={{ alignItems: 'center', gap: 1, mb: 0.9 }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#456079',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatDateHeading(date)}
                  </Typography>

                  <Box
                    sx={{
                      flex: 1,
                      height: '1px',
                      bgcolor: '#E1EAF3',
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#5A7189',
                    }}
                  >
                    {dateMeetings.length}
                  </Typography>
                </Stack>
              )}

              <Stack spacing={compact ? 1 : 1.15}>
                {dateMeetings.map((meeting) => (
                  <Box key={meeting.id} sx={{ minWidth: 0 }}>
                    <MeetingListItem
                      meeting={meeting}
                      status={meeting.type ?? meeting.status}
                      timeLabel={meeting.time}
                      settings={settings}
                      onSettingsChange={onSettingsChange}
                      tourTarget={firstMeetingId === meeting.id}
                      compact={compact}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          )
        })}
      </Stack>
    )
  }

  /* Full-size layout keeps the existing flat list. */
  if (!compact) {
    return (
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            mb: 1.25,
            fontSize: '0.75rem',
            color: '#5A7189',
          }}
        >
          Double-click a meeting to open meeting details.
        </Typography>

        {renderMeetings(meetings)}
      </Box>
    )
  }

  /* Prepare the compact Live / Upcoming / Done sections. */
  const sections = SECTIONS.map((label) => {
    const items = meetings.filter(
      (meeting) => getStatusKey(meeting) === label,
    )

    const isOpen =
      items.length > 0 && (choices[label] ?? defaultOpen(label))

    return { label, items, isOpen }
  })

  const openableSections = sections.filter(
    (section) => section.items.length > 0,
  )

  const allOpen =
    openableSections.length > 0 &&
    openableSections.every((section) => section.isOpen)

  const saveChoices = (next) => {
    setChoices(next)
    writeChoices(next)
  }

  const toggleSection = (label, isOpen) => {
    saveChoices({
      ...choices,
      [label]: !isOpen,
    })
  }

  const toggleAll = () => {
    saveChoices(
      Object.fromEntries(
        SECTIONS.map((label) => [label, !allOpen]),
      ),
    )
  }

  const joinMeeting = (meeting) => {
    const url = getJoinUrl(meeting)

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      navigate(`/meetings/${meeting.id}`)
    }
  }

  return (
    <Box sx={{ minWidth: 0 }}>
      {/* Meeting count and Expand all / Collapse all controls. */}
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          mb: 1,
          px: 0.25,
        }}
      >
        <Typography
          sx={{
            minWidth: 0,
            fontSize: '0.75rem',
            color: '#5A7189',
          }}
        >
          {meetings.length}{' '}
          {meetings.length === 1 ? 'meeting' : 'meetings'}
          {' · '}double-click to open
        </Typography>

        <ButtonBase
          onClick={toggleAll}
          sx={{
            flexShrink: 0,
            px: 1.1,
            py: 0.5,
            borderRadius: '999px',
            fontFamily: 'inherit',
            fontSize: '0.75rem',
            fontWeight: 650,
            color: '#0967B2',
            '&:hover': { bgcolor: '#EAF3FC' },
            '&:focus-visible': {
              outline: '2px solid #0967B2',
              outlineOffset: '2px',
            },
          }}
        >
          {allOpen ? 'Collapse all' : 'Expand all'}
        </ButtonBase>
      </Stack>

      <Stack spacing={1}>
        {sections.map(({ label, items, isOpen }) => {
          const style = getStatusStyle(label)
          const empty = items.length === 0
          const panelId = `meetings-section-${label.toLowerCase()}`
          const liveMeeting = label === 'Live' ? items[0] : null
          const preview = getPreview(label, items)

          const isExpanded = expandedSections[label] === true

          const displayedMeetings = isExpanded
            ? items
            : items.slice(0, INITIAL_MEETINGS_PER_SECTION)

          const hasMoreMeetings =
            items.length > INITIAL_MEETINGS_PER_SECTION

          const remainingCount =
            items.length - INITIAL_MEETINGS_PER_SECTION

          return (
            <Paper
              key={label}
              elevation={0}
              sx={{
                border: '1px solid #E1EAF3',
                borderRadius: '12px',
                bgcolor: '#FFFFFF',
                overflow: 'hidden',
                opacity: empty ? 0.7 : 1,
              }}
            >
              <Stack
                direction="row"
                sx={{
                  alignItems: 'center',
                  gap: 1,
                  pr: 1.25,
                }}
              >
                {/* Click the header to open or close this section. */}
                <ButtonBase
                  onClick={() => toggleSection(label, isOpen)}
                  disabled={empty}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    px: 1.25,
                    py: 1.1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 0.75,
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    '&:hover': {
                      bgcolor: empty ? 'transparent' : '#F7FAFD',
                    },
                    '&.Mui-focusVisible': {
                      outline: '2px solid #0967B2',
                      outlineOffset: '-2px',
                    },
                  }}
                >
                  <KeyboardArrowDownIcon
                    sx={{
                      flexShrink: 0,
                      fontSize: 22,
                      color: '#456079',
                      transform: isOpen
                        ? 'rotate(0deg)'
                        : 'rotate(-90deg)',
                      transition: 'transform 180ms ease',
                    }}
                  />

                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Stack
                      direction="row"
                      sx={{
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Box
                        aria-hidden="true"
                        sx={{
                          width: 9,
                          height: 9,
                          flexShrink: 0,
                          borderRadius: '50%',
                          bgcolor: style.color,
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          color: '#123A59',
                        }}
                      >
                        {label}
                      </Typography>

                      <Box
                        component="span"
                        sx={{
                          minWidth: 24,
                          height: 22,
                          px: 0.9,
                          boxSizing: 'border-box',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          bgcolor: style.backgroundColor,
                          color: style.color,
                        }}
                      >
                        {items.length}
                      </Box>
                    </Stack>

                    {/* Preview while the section is closed. */}
                    {!isOpen && (
                      <Box sx={{ mt: 0.4, minWidth: 0 }}>
                        <Typography
                          noWrap
                          sx={{
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            color: '#31506B',
                          }}
                        >
                          {preview.title}
                        </Typography>

                        {preview.time && (
                          <Typography
                            noWrap
                            sx={{
                              fontSize: '0.75rem',
                              color: '#5A7189',
                            }}
                          >
                            {preview.time}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </ButtonBase>

                {/* Join the live meeting without toggling the section. */}
                {liveMeeting && (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => joinMeeting(liveMeeting)}
                    startIcon={
                      <VideocamOutlinedIcon sx={{ fontSize: 17 }} />
                    }
                    aria-label={`Join ${liveMeeting.title}`}
                    sx={{
                      flexShrink: 0,
                      height: 32,
                      px: 1.4,
                      borderRadius: '999px',
                      bgcolor: '#C62828',
                      boxShadow: 'none',
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      '&:hover': {
                        bgcolor: '#A61F1F',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    Join
                  </Button>
                )}
              </Stack>

              <Collapse in={isOpen} timeout={180}>
                <Box
                  id={panelId}
                  sx={{
                    px: 1.25,
                    pt: 1.25,
                    pb: 1.4,
                    bgcolor: '#F7FAFD',
                    borderTop: '1px solid #EEF3F7',
                  }}
                >
                  {renderMeetings(displayedMeetings)}

                  {/* Show more / Show less for this section only. */}
                  {hasMoreMeetings && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        pt: 1.25,
                      }}
                    >
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => toggleSectionItems(label)}
                        aria-expanded={isExpanded}
                        sx={{
                          minHeight: 36,
                          px: 2,
                          borderRadius: '999px',
                          color: 'primary.main',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          textTransform: 'none',
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        {isExpanded
                          ? 'Show less'
                          : `Show more (${remainingCount})`}
                      </Button>
                    </Box>
                  )}
                </Box>
              </Collapse>
            </Paper>
          )
        })}
      </Stack>
    </Box>
  )
}