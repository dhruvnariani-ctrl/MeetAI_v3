
import { useMemo, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

import Box from '@mui/material/Box'

import DashboardOverviewHeader from '../components/dashboard/DashboardOverviewHeader'
import DashboardStats from '../components/dashboard/DashboardStats'
import DashboardSidePanels from '../components/dashboard/DashboardSidePanels'
import DashboardActionItemsCard from '../components/dashboard/DashboardActionItemsCard'
import MeetingTimeline from '../components/dashboard/MeetingTimeline'
import ConfirmMarkDoneDialog from '../components/tasks/ConfirmMarkDoneDialog'

import {
  getTodaysMeetings,
  updateMeetingActionItemStatus,
} from '../data/meetings'

import {
  createMeetingSettings,
  saveMeetingSettings,
} from '../data/meetingSettings'

import useNow from '../hooks/Usenow'
import useCurrentUser from '../hooks/useCurrentUser'
import { filterUserMeetings } from '../utils/meetingAccess'

import {
  getActionItemsFromMeetings,
  tasksDueTodayForUser,
  isActionableTask,
  statusOf,
  COLORS,
} from '../components/dashboard/dashboardUtils'

const MAX_ACTION_ITEMS = 5

export default function Dashboard() {
  const now = useNow()
  const currentUser = useCurrentUser()
  const navigate = useNavigate()
  const outletContext = useOutletContext() ?? {}

  const [meetingSettings, setMeetingSettings] = useState(() =>
    createMeetingSettings(),
  )

  const [doneIds, setDoneIds] = useState(() => new Set())
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [showAllTasks, setShowAllTasks] = useState(false)

  // Task selected for confirmation.
  const [taskToConfirm, setTaskToConfirm] = useState(null)

  // Re-read meetings after a successful task-status update.
  const [taskStatusVersion, setTaskStatusVersion] = useState(0)

  const handleCreateMeeting = outletContext.openCreate
  const handleInstantJoin = outletContext.openInstant

  const userMeetings = useMemo(() => {
    const allTodaysMeetings = getTodaysMeetings(now)

    return filterUserMeetings(
      allTodaysMeetings,
      currentUser,
    )
  }, [now, currentUser, taskStatusVersion])

  const sortedMeetings = useMemo(
    () =>
      [...userMeetings]
        .map((meeting) => ({
          ...meeting,
          _start:
            meeting._start instanceof Date
              ? meeting._start
              : new Date(meeting.start),
          _end:
            meeting._end instanceof Date
              ? meeting._end
              : new Date(meeting.end),
        }))
        .filter(
          (meeting) =>
            !Number.isNaN(meeting._start.getTime()) &&
            !Number.isNaN(meeting._end.getTime()),
        )
        .sort(
          (a, b) =>
            a._start.getTime() - b._start.getTime(),
        ),
    [userMeetings],
  )

  const allTodaysUserTasks = useMemo(() => {
    const tasks = getActionItemsFromMeetings(sortedMeetings)

    return tasksDueTodayForUser(
      tasks,
      currentUser,
      now,
    )
  }, [sortedMeetings, currentUser, now])

  // Statistics include all statuses, including Done and Blocked.
  const actionCount = allTodaysUserTasks.filter((item) => {
  const status = String(item.status ?? '').toLowerCase()

  return (
    isActionableTask(item) &&
    !doneIds.has(item.id) &&
    !['done', 'completed', 'blocked'].includes(status)
  )
}).length

  // Show only open/actionable items.
  const actionableTasks = useMemo(
    () =>
      allTodaysUserTasks.filter(
        (item) =>
          isActionableTask(item) &&
          !doneIds.has(item.id),
      ),
    [allTodaysUserTasks, doneIds],
  )

  // Apply priority filter before limiting visible items.
  const priorityFilteredTasks = useMemo(() => {
    if (priorityFilter === 'all') {
      return actionableTasks
    }

    return actionableTasks.filter(
      (item) =>
        String(item.priority ?? '').toLowerCase() ===
        priorityFilter.toLowerCase(),
    )
  }, [actionableTasks, priorityFilter])

  // Display at most five items unless Show All is enabled.
  const visibleActionItems = useMemo(
    () =>
      showAllTasks
        ? priorityFilteredTasks
        : priorityFilteredTasks.slice(0, MAX_ACTION_ITEMS),
    [priorityFilteredTasks, showAllTasks],
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
        [meetingId]: {
          ...current,
          ...changes,
        },
      }

      saveMeetingSettings(updated)

      return updated
    })
  }

  // Step 1: open confirmation; do not mark done yet.
  const handleTaskDone = (taskId) => {
    const task = allTodaysUserTasks.find(
      (item) => item.id === taskId,
    )

    if (!task || !task.meetingId) return

    const status = String(task.status ?? '')
      .trim()
      .toLowerCase()

    if (
      status === 'done' ||
      status === 'completed' ||
      status === 'blocked' ||
      doneIds.has(taskId)
    ) {
      return
    }

    setTaskToConfirm(task)
  }

  // Step 2: persist only when the user confirms.
  const handleConfirmTaskDone = () => {
    if (!taskToConfirm?.meetingId) return

    updateMeetingActionItemStatus(
      taskToConfirm.meetingId,
      taskToConfirm.id,
      'Done',
    )

    setDoneIds((previous) => {
      const next = new Set(previous)
      next.add(taskToConfirm.id)
      return next
    })

    setTaskToConfirm(null)
    setTaskStatusVersion((version) => version + 1)
  }

  const handleCancelTaskDone = () => {
    setTaskToConfirm(null)
  }

  const handleShowAllChange = (nextShowAll) => {
    setShowAllTasks(nextShowAll)
  }

  return (
    <>
      <Box
        sx={{
          width: '100%',
          minWidth: 0,
          color: COLORS.text,
        }}
      >
        {/* Welcome and quick actions */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              lg: 'minmax(0, 1.20fr) minmax(280px, 1fr)',
            },
            gap: 1.5,
            alignItems: 'stretch',
            mb: 1.5,
          }}
        >
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

        {/* Meeting timeline and action items */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              lg: 'minmax(0, 1.5fr) minmax(320px, 0.9fr)',
            },
            gap: 1.5,
            alignItems: 'stretch',
          }}
        >
          <MeetingTimeline
            meetings={sortedMeetings}
            now={now}
            meetingSettings={meetingSettings}
            onSettingsChange={handleSettingsChange}
          />

          <DashboardActionItemsCard
            items={visibleActionItems}
            allItems={allTodaysUserTasks}
            doneIds={doneIds}
            onToggleDone={handleTaskDone}
            priorityFilter={priorityFilter}
            onPriorityChange={setPriorityFilter}
            showAll={showAllTasks}
            onShowAllChange={setShowAllTasks}
          />
        </Box>
      </Box>

      <ConfirmMarkDoneDialog
        open={Boolean(taskToConfirm)}
        taskTitle={taskToConfirm?.title ?? ''}
        onCancel={handleCancelTaskDone}
        onConfirm={handleConfirmTaskDone}
      />
    </>
  )
}
