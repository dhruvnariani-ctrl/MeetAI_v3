
import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Box, Stack } from '@mui/material'

import usePageTitle from '../hooks/usePageTitle'
import useCurrentUser from '../hooks/useCurrentUser'

import {
  filterAndSortTasks,
  getTasksFromDashboard,
} from '../data/tasks'

import { updateMeetingActionItemStatus } from '../data/meetings'

import { COLORS } from '../components/tasks/taskConstants'
import useTaskStats from '../components/tasks/useTaskStats'
import TaskToolbar from '../components/tasks/TaskToolbar'
import TaskBanner from '../components/tasks/TaskBanner'
import TaskListCard from '../components/tasks/TaskListCard'
import TodayFocusCard from '../components/tasks/TodayFocusCard'
import TaskProgressCard from '../components/tasks/TaskProgressCard'
import WorkloadCard from '../components/tasks/WorkloadCard'

export default function MyTasks() {
  usePageTitle('My Tasks')

  const currentUser = useCurrentUser()
  const navigate = useNavigate()
  const actionItemsRef = useRef(null)

  const [tasks, setTasks] = useState(() =>
    getTasksFromDashboard(currentUser),
  )

  const [filter, setFilter] = useState('All')
  const [sortBy, setSortBy] = useState('My Order')
  const [search, setSearch] = useState('')
  const [dueDate, setDueDate] = useState('default')
  const [expandedTaskId, setExpandedTaskId] = useState(null)

  const filteredTasks = useMemo(
    () =>
      filterAndSortTasks(
        tasks,
        { filter, search, dueDate },
        sortBy,
      ),
    [tasks, filter, search, dueDate, sortBy],
  )

  const {
    filterCounts,
    highPriority,
    dueSoon,
    todayFocus,
    progress,
  } = useTaskStats(tasks)

  const handleToggle = (taskId) => {
    setExpandedTaskId((current) =>
      current === taskId ? null : taskId,
    )
  }

  const handleMarkDone = (taskId) => {
    const task = tasks.find((item) => item.id === taskId)

    if (!task) return

    updateMeetingActionItemStatus(
      task.meetingId,
      task.id,
      'Done',
    )

    setTasks((current) =>
      current.map((item) =>
        item.id === taskId
          ? { ...item, status: 'Done', completed: true }
          : item,
      ),
    )
  }

  const handleOpenMeeting = (task) => {
    if (task.meetingId) {
      navigate(`/meetings/${task.meetingId}`)
    }
  }

  const showOpenTasks = ({
    dueDate: nextDueDate,
    sortBy: nextSortBy,
  }) => {
    setFilter('Open')
    setSearch('')
    setDueDate(nextDueDate)
    setSortBy(nextSortBy)
    setExpandedTaskId(null)

    requestAnimationFrame(() => {
      actionItemsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }

  const handleClearFilters = () => {
    setFilter('All')
    setSearch('')
    setDueDate('default')
  }

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        color: COLORS.text,
        pb: 1,
        boxSizing: 'border-box',
      }}
    >
      <TaskToolbar
        search={search}
        onSearchChange={setSearch}
        dueDate={dueDate}
        onDueDateChange={setDueDate}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {/* Responsive task dashboard */}
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            lg: 'minmax(0, 1fr) minmax(0, 2fr) minmax(0, 1fr)',
          },
          gap: { xs: 1.5, sm: 2 },
          alignItems: 'start',
        }}
      >
        {/* CENTRE: Banner and My Action Items */}
        <Stack
          spacing={1.5}
          sx={{
            width: '100%',
            minWidth: 0,
            gridColumn: { xs: '1', lg: '2' },
            gridRow: { xs: '1', lg: '1' },
            alignSelf: 'start',
            '& > *': {
              minWidth: 0,
              maxWidth: '100%',
            },
          }}
        >
          <TaskBanner />

          <TaskListCard
            containerRef={actionItemsRef}
            tasks={filteredTasks}
            filter={filter}
            onFilterChange={setFilter}
            filterCounts={filterCounts}
            expandedTaskId={expandedTaskId}
            onToggle={handleToggle}
            onMarkDone={handleMarkDone}
            onOpen={handleOpenMeeting}
            onClearFilters={handleClearFilters}
            pageResetKey={[filter, search, dueDate, sortBy].join('|')}
          />
        </Stack>

        {/* LEFT: Today's Focus */}
        <Stack
          spacing={1.5}
          sx={{
            width: '100%',
            minWidth: 0,
            gridColumn: { xs: '1', lg: '1' },
            gridRow: { xs: '2', lg: '1' },
            alignSelf: 'start',
            '& > *': {
              minWidth: 0,
              maxWidth: '100%',
            },
          }}
        >
          <TodayFocusCard
            tasks={todayFocus}
            expandedTaskId={expandedTaskId}
            onToggle={handleToggle}
            onMarkDone={handleMarkDone}
            onOpen={handleOpenMeeting}
            onViewToday={() =>
              showOpenTasks({
                dueDate: 'today',
                sortBy: 'Priority',
              })
            }
          />
        </Stack>

        {/* RIGHT: Progress and Workload */}
        <Stack
          spacing={1.5}
          sx={{
            width: '100%',
            minWidth: 0,
            gridColumn: { xs: '1', lg: '3' },
            gridRow: { xs: '3', lg: '1' },
            alignSelf: 'start',
            '& > *': {
              minWidth: 0,
              maxWidth: '100%',
            },
          }}
        >
          <TaskProgressCard
            filterCounts={filterCounts}
            progress={progress}
          />

          <WorkloadCard
            openCount={filterCounts.Open}
            highPriority={highPriority}
            dueSoon={dueSoon}
            onViewAll={() =>
              showOpenTasks({
                dueDate: 'default',
                sortBy: 'Due date',
              })
            }
          />
        </Stack>
      </Box>
    </Box>
  )
}