import { useMemo, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Box from '@mui/material/Box'

import DashboardOverviewHeader from '../components/dashboard/DashboardOverviewHeader'
import DashboardStats from '../components/dashboard/DashboardStats'
import DashboardSidePanels from '../components/dashboard/DashboardSidePanels'
import DashboardActionItemsCard from '../components/dashboard/DashboardActionItemsCard'
import MeetingTimeline from '../components/dashboard/MeetingTimeline'

import { getTodaysMeetings } from '../data/meetings'
import { createMeetingSettings, saveMeetingSettings } from '../data/meetingSettings'
import useNow  from '../hooks/Usenow'
import  useCurrentUser from '../hooks/useCurrentUser'
import { filterUserMeetings } from '../utils/meetingAccess'

import {
  getActionItemsFromMeetings,
  tasksDueTodayForUser,
  isActionableTask,
  statusOf,
  COLORS,
} from '../components/dashboard/dashboardUtils'

export default function Dashboard() {
  const now = useNow()
  const currentUser = useCurrentUser()
  const navigate = useNavigate()
  const outletContext = useOutletContext() ?? {}

  const [meetingSettings, setMeetingSettings] = useState(() => createMeetingSettings())
  const [doneIds, setDoneIds] = useState(() => new Set())
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [showAllTasks, setShowAllTasks] = useState(false)

  /*
   * Connect these two callbacks to your existing meeting dialogs.
   * The layout no longer places meeting buttons in the welcome header.
   */
  const handleCreateMeeting =
    outletContext.onCreateMeeting ?? outletContext.openCreateMeeting ?? (() => {})

  const handleInstantJoin =
    outletContext.onInstantJoin ?? outletContext.openInstantJoin ?? (() => {})

  const userMeetings = useMemo(() => {
    const allTodaysMeetings = getTodaysMeetings(now)
    return filterUserMeetings(allTodaysMeetings, currentUser)
  }, [now, currentUser])

  const sortedMeetings = useMemo(() => {
    return [...userMeetings]
      .map((meeting) => ({
        ...meeting,
        _start: meeting._start instanceof Date
          ? meeting._start
          : new Date(meeting.start),
        _end: meeting._end instanceof Date
          ? meeting._end
          : new Date(meeting.end),
      }))
      .filter((meeting) =>
        !Number.isNaN(meeting._start.getTime()) &&
        !Number.isNaN(meeting._end.getTime()),
      )
      .sort((a, b) => a._start.getTime() - b._start.getTime())
  }, [userMeetings])

  const allTodaysUserTasks = useMemo(() => {
    const tasks = getActionItemsFromMeetings(sortedMeetings)
    return tasksDueTodayForUser(tasks, currentUser, now)
  }, [sortedMeetings, currentUser, now])

  // Statistics deliberately include all statuses, including Done and Blocked.
  const actionCount = allTodaysUserTasks.length

  // The card only shows actionable statuses and locally completed items disappear.
  const actionableTasks = useMemo(
    () => allTodaysUserTasks.filter(
      (item) => isActionableTask(item) && !doneIds.has(item.id),
    ),
    [allTodaysUserTasks, doneIds],
  )

  const liveCount = sortedMeetings.filter(
    (meeting) => statusOf(meeting, now) === 'live',
  ).length

  const remainingCount = sortedMeetings.filter(
    (meeting) => statusOf(meeting, now) === 'upcoming',
  ).length

  const dayProgress = Math.round(
    ((now.getHours() * 60 + now.getMinutes()) / (24 * 60)) * 100,
  )

  const firstName =
    currentUser?.firstName ??
    currentUser?.name?.split(' ')[0] ??
    currentUser?.fullName?.split(' ')[0] ??
    'there'

  const summary = liveCount
    ? `You have ${liveCount} meeting${liveCount === 1 ? '' : 's'} in progress and ${actionCount} action item${actionCount === 1 ? '' : 's'} due today.`
    : `You have ${remainingCount} upcoming meeting${remainingCount === 1 ? '' : 's'} and ${actionCount} action item${actionCount === 1 ? '' : 's'} due today.`

  const handleSettingsChange = (meetingId, changes) => {
    setMeetingSettings((previous) => {
      const current = previous?.[meetingId] ?? {}
      const updated = {
        ...previous,
        [meetingId]: { ...current, ...changes },
      }

      saveMeetingSettings(updated)
      return updated
    })
  }

  const handleTaskDone = (taskId) => {
    setDoneIds((previous) => {
      const next = new Set(previous)
      next.add(taskId)
      return next
    })
  }

  return (
    <Box sx={{
      width: '100%',
      minWidth: 0,
      pb: 3,
      color: COLORS.text,
    }}>
      {/* Welcome and quick actions share the top row. */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          lg: 'minmax(0, 1.65fr) minmax(280px, 1fr)',
        },
        gap: 2,
        alignItems: 'stretch',
        mb: 2,
      }}>
        <DashboardOverviewHeader
          now={now}
          firstName={firstName}
          summary={summary}
        />

        <DashboardSidePanels
          onCreate={handleCreateMeeting}
          onInstant={handleInstantJoin}
          onNavigate={navigate}
        />
      </Box>

      <DashboardStats
        meetings={sortedMeetings.length}
        liveCount={liveCount}
        remainingCount={remainingCount}
        actionCount={actionCount}
        dayProgress={dayProgress}
      />

      {/* Main dashboard content */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          lg: 'minmax(0, 1.5fr) minmax(320px, .9fr)',
        },
        gap: 2,
        alignItems: 'start',
      }}>
        <MeetingTimeline
          meetings={sortedMeetings}
          now={now}
          meetingSettings={meetingSettings}
          onSettingsChange={handleSettingsChange}
        />

        <DashboardActionItemsCard
          items={actionableTasks}
          doneIds={doneIds}
          onToggleDone={handleTaskDone}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          showAll={showAllTasks}
          onShowAllChange={setShowAllTasks}
        />
      </Box>
    </Box>
  )
}