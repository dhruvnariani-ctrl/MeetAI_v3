import { useEffect, useState } from 'react'
import {
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'

import PageShell from '../components/PageShell'
import MeetingHeader from '../components/meetingDetails/MeetingHeader'
import MeetingTabs, {
  VALID_TABS,
} from '../components/meetingDetails/MeetingTabs'
import OverviewTab from '../components/meetingDetails/OverviewTab'
import RecordingTab from '../components/meetingDetails/RecordingTab'
import TranscriptTab from '../components/meetingDetails/TranscriptTab'
import ActionItemsTab from '../components/meetingDetails/ActionItemsTab'

import {
  getMeetingState,
  getAttendance,
  getDurationMinutes,
  formatTimeRange,
} from '../components/meetingDetails/utils'

import { formatDate } from '../utils/time'
import usePageTitle from '../hooks/usePageTitle'
import { getMeetingById } from '../data/meetings'
import { getMeetingSettings } from '../data/meetingSettings'

const NAVY = '#123A59'
const BLUE = '#0967B2'
const BORDER = '#DFE7EC'
const MUTED = '#71818D'
const BACKGROUND = '#F7F9FB'

function getTabFromSearchParams(searchParams) {
  const requestedTab = searchParams.get('tab')
  return VALID_TABS.includes(requestedTab)
    ? requestedTab
    : 'overview'
}

export default function MeetingDetails() {
  usePageTitle('Meeting Details')

  const navigate = useNavigate()
  const { meetingId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const [now, setNow] = useState(() => new Date())
  const [activeTab, setActiveTab] = useState(
    () => getTabFromSearchParams(searchParams),
  )

  const meeting = getMeetingById(meetingId)

  useEffect(() => {
    setActiveTab(getTabFromSearchParams(searchParams))
  }, [searchParams])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 30000)

    return () => window.clearInterval(timer)
  }, [])

  if (!meeting) {
    return (
      <PageShell
        title="Meeting not found"
        subtitle="We couldn't find the meeting you're looking for."
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: `1px solid ${BORDER}`,
            borderRadius: 3,
            bgcolor: '#fff',
          }}
        >
          <Typography sx={{ color: MUTED, fontSize: '.85rem', mb: 2 }}>
            The meeting may have been removed or is no longer available.
          </Typography>

          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate(-1)}
            sx={{ textTransform: 'none', color: BLUE }}
          >
            Go back
          </Button>
        </Paper>
      </PageShell>
    )
  }

  const meetingState = getMeetingState(meeting, now)

  // A saved false value must override the meeting's original invited setting.
  const savedSettings = getMeetingSettings()
  const savedMeetingSettings = savedSettings?.[meeting.id]

  const meetAIInvited =
    savedMeetingSettings?.autoJoin !== undefined
      ? savedMeetingSettings.autoJoin === true
      : meeting?.meetAI?.invited === true

  const participants = meeting.participants || []
  const attendance = getAttendance(meeting, participants)
  const durationMinutes = getDurationMinutes(meeting)
  const timeText = formatTimeRange(meeting.start, meeting.end)
  const dateText = formatDate(meeting.start)

  const handleTabChange = (_event, value) => {
    if (!VALID_TABS.includes(value)) return

    setActiveTab(value)

    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams)
        nextParams.set('tab', value)
        return nextParams
      },
      { replace: true },
    )
  }

  const goToTab = (value) => handleTabChange(null, value)

  return (
    <PageShell title="" subtitle="">
      <Box
        sx={{
          width: '100%',
          maxWidth: 1600,
          mx: 'auto',
          color: NAVY,
        }}
      >
        <Stack spacing={2}>
          {/* Page navigation */}
          <Box>
            <Button
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => navigate(-1)}
              sx={{
                textTransform: 'none',
                fontSize: '.8rem',
                fontWeight: 650,
                color: NAVY,
                px: 0,
                '&:hover': {
                  bgcolor: 'transparent',
                  color: BLUE,
                },
              }}
            >
              Back to meetings
            </Button>
          </Box>

          {/* Main meeting header */}
          <Box data-tour="meeting-header">
            <MeetingHeader
              meeting={meeting}
              meetingState={meetingState}
              dateText={dateText}
              timeText={timeText}
              durationMinutes={durationMinutes}
              onViewRecording={() => goToTab('recording')}
            />
          </Box>

          {/* Tabs synced with the URL */}
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 2,
              bgcolor: BACKGROUND,
            }}
          >
            <MeetingTabs
              value={activeTab}
              onChange={handleTabChange}
            />
          </Box>

          {/* Active tab content */}
          <Box
            sx={{ minWidth: 0, pb: 2 }}
          >
            {activeTab === 'overview' && (
              <OverviewTab
                meeting={meeting}
                meetingState={meetingState}
                attendance={attendance}
                durationMinutes={durationMinutes}
                meetAIInvited={meetAIInvited}
                onNavigate={goToTab}
              />
            )}

            {activeTab === 'recording' && (
              <RecordingTab
                meeting={meeting}
                meetingState={meetingState}
              />
            )}

            {activeTab === 'transcript' && (
              <TranscriptTab
                meeting={meeting}
                meetingState={meetingState}
              />
            )}

            {activeTab === 'actions' && (
              <ActionItemsTab
                meeting={meeting}
                meetingState={meetingState}
              />
            )}
          </Box>
        </Stack>
      </Box>
    </PageShell>
  )
}