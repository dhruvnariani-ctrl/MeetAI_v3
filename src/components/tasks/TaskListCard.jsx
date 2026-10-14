
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material'

import PaginationBar from '../PaginationBar'
import { EmptyPanel } from '../PageShell'
import usePagination from '../../hooks/usePagination'

import { normalizeTaskStatus } from '../../data/tasks'
import { COLORS, STATUS_FILTERS } from './taskConstants'
import TaskRow from './TaskRow'

const TABLE_HEADINGS = ['Task', 'Priority', 'Status / Due', '']
const TASKS_PER_PAGE = 5

export default function TaskListCard({
  containerRef,
  tasks,
  filter,
  onFilterChange,
  filterCounts,
  expandedTaskId,
  onToggle,
  onMarkDone,
  onOpen,
  onClearFilters,
  pageResetKey,
}) {
  const pager = usePagination(tasks, TASKS_PER_PAGE, pageResetKey)

  /* The first not-done task carries the product-tour anchor. */
  const tourTaskId = pager.pageItems.find(
    (task) => normalizeTaskStatus(task.status) !== 'Done',
  )?.id

  return (
    <Paper
      ref={containerRef}
      elevation={0}
      sx={{
        width: '100%',
        minWidth: 0,
        overflow: 'hidden',
        border: `1px solid ${COLORS.border}`,
        borderRadius: '12px',
        backgroundColor: COLORS.white,
        scrollMarginTop: 18,
      }}
    >
      <Box sx={{ px: 1.5, pt: 1.6, pb: 1.25 }}>
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 0.75, width: '100%' }}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              sx={{
                color: COLORS.navy,
                fontSize: '0.9375rem',
                fontWeight: 800,
              }}
            >
              My action items
            </Typography>

            <Typography
              sx={{
                mt: 0.35,
                color: COLORS.muted,
                fontSize: '0.75rem',
                lineHeight: 1.5,
              }}
            >
              Select a task to view details and update its status.
            </Typography>
          </Box>

          <Chip
            label={`${tasks.length} ${
              tasks.length === 1 ? 'task' : 'tasks'
            }`}
            size="small"
            sx={{
              flexShrink: 0,
              color: COLORS.navy,
              backgroundColor: COLORS.paleBlue,
              borderRadius: '8px',
              fontWeight: 750,
              fontSize: '0.75rem',
            }}
          />
        </Stack>
      </Box>

      <Divider sx={{ borderColor: COLORS.border }} />

      {/* Status filters */}
      <Box
        sx={{
          display: 'flex',
          gap: 0.6,
          px: 1.1,
          py: 1.1,
          overflowX: 'auto',
          '&::-webkit-scrollbar': { height: 4 },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#D7E3EB',
            borderRadius: 999,
          },
        }}
      >
        {STATUS_FILTERS.map((status) => {
          const selected = filter === status

          return (
            <Button
              key={status}
              onClick={() => onFilterChange(status)}
              size="small"
              variant={selected ? 'contained' : 'outlined'}
              sx={{
                minWidth: 'auto',
                flexShrink: 0,
                px: 1,
                py: 0.6,
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 750,
                borderColor: selected ? COLORS.blue : COLORS.border,
                color: selected ? '#fff' : COLORS.text,
                backgroundColor: selected ? COLORS.blue : '#fff',
                boxShadow: 'none',
                '&:hover': {
                  borderColor: COLORS.blue,
                  backgroundColor: selected
                    ? '#075A9D'
                    : COLORS.paleBlue,
                },
              }}
            >
              {status}
              <Box
                component="span"
                sx={{
                  ml: 0.55,
                  fontSize: '0.75rem',
                  opacity: 0.8,
                }}
              >
                {filterCounts[status]}
              </Box>
            </Button>
          )
        })}
      </Box>

      {/* Table headings */}
      <Box
        sx={{
          mx: 1,
          px: 0.75,
          py: 0.9,
          borderRadius: '8px',
          backgroundColor: '#F3F7FA',
          display: { xs: 'none', md: 'grid' },
          gridTemplateColumns: 'minmax(0, 1fr) 72px 110px 26px',
          gap: 1,
        }}
      >
        {TABLE_HEADINGS.map((label, index) => (
          <Typography
            key={`${label}-${index}`}
            sx={{
              color: '#698197',
              fontWeight: 800,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '.025em',
            }}
          >
            {label}
          </Typography>
        ))}
      </Box>

      {/* Task rows */}
      {tasks.length === 0 ? (
        <Box sx={{ p: 1.5 }}>
          <EmptyPanel
            title="No tasks found"
            minHeight={140}
            action={<Button onClick={onClearFilters}>Clear filters</Button>}
          >
            Try another status, date range or search term.
          </EmptyPanel>
        </Box>
      ) : (
        <>
          <Box sx={{ px: 0.25 }}>
            {pager.pageItems.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                expanded={expandedTaskId === task.id}
                onToggle={onToggle}
                onMarkDone={onMarkDone}
                onOpen={onOpen}
                showMarkDoneTour={task.id === tourTaskId}
              />
            ))}
          </Box>

          <PaginationBar pager={pager} label="tasks" />
        </>
      )}
    </Paper>
  )
}