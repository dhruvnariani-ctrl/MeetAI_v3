import {
  Box,
  Button,
  Collapse,
  Stack,
  Typography,
} from '@mui/material'
import {
  ChevronRight,
  ExpandMore,
  OpenInNewOutlined,
} from '@mui/icons-material'

import { normalizeTaskPriority, normalizeTaskStatus } from '../../data/tasks'
import { COLORS, PRIORITY_COLORS } from './taskConstants'
import { formatDate, getDueLabel } from './taskHelpers'
import { PriorityBadge, StatusBadge } from './TaskBadges'
import TaskIcon from './TaskIcon'

export default function TaskRow({
  task,
  expanded,
  onToggle,
  onMarkDone,
  onOpen,
  showMarkDoneTour,
}) {
  const status = normalizeTaskStatus(task.status)
  const priority = normalizeTaskPriority(task.priority)
  const priorityStyle = PRIORITY_COLORS[priority] ?? PRIORITY_COLORS.Medium

  return (
    <Box
      sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        '&:last-child': { borderBottom: 0 },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr) auto',
            md: 'minmax(0, 1fr) 72px 110px 26px',
          },
          alignItems: 'center',
          gap: 1,
          px: { xs: 1.25, md: 1.5 },
          py: 1.3,
          '&:hover': { backgroundColor: '#F8FBFD' },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
          <Box
            sx={{
              width: 33,
              height: 33,
              flexShrink: 0,
              borderRadius: '9px',
              display: 'grid',
              placeItems: 'center',
              color: priorityStyle.color,
              backgroundColor: priorityStyle.background,
              '& svg': { fontSize: 18 },
            }}
          >
            <TaskIcon task={task} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                color: status === 'Done' ? COLORS.muted : COLORS.navy,
                fontSize: '0.76rem',
                fontWeight: 750,
                lineHeight: 1.4,
                textDecoration: status === 'Done' ? 'line-through' : 'none',
                overflowWrap: 'anywhere',
              }}
            >
              {task.title}
            </Typography>

            <Typography
              sx={{
                mt: 0.25,
                color: COLORS.muted,
                fontSize: '0.67rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {task.meetingTitle || 'Meeting action item'}
            </Typography>

            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={{ display: { xs: 'flex', md: 'none' }, mt: 0.65, flexWrap: 'wrap' }}
            >
              <PriorityBadge priority={priority} />
              <Typography sx={{ color: COLORS.muted, fontSize: '0.66rem' }}>
                {getDueLabel(task.due)}
              </Typography>
              <StatusBadge status={status} />
            </Stack>
          </Box>
        </Stack>

        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <PriorityBadge priority={priority} />
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <StatusBadge status={status} />
          <Typography
            sx={{
              mt: 0.4,
              color: COLORS.muted,
              fontSize: '0.65rem',
              whiteSpace: 'nowrap',
            }}
          >
            {getDueLabel(task.due)}
          </Typography>
        </Box>

        <Button
          aria-label={`Open ${task.title}`}
          onClick={() => onToggle(task.id)}
          sx={{
            minWidth: 24,
            width: 26,
            height: 30,
            p: 0,
            color: expanded ? COLORS.blue : '#8199AA',
          }}
        >
          {expanded ? <ExpandMore /> : <ChevronRight />}
        </Button>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ px: 1.5, pb: 1.5, pt: 0.25, backgroundColor: '#FBFDFF' }}>
          <Typography
            sx={{ color: COLORS.muted, fontSize: '0.71rem', lineHeight: 1.7 }}
          >
            <Box component="span" sx={{ fontWeight: 750, color: COLORS.text }}>
              Owner:
            </Box>{' '}
            {task.owner || 'Unassigned'}
            {' · '}
            <Box component="span" sx={{ fontWeight: 750, color: COLORS.text }}>
              Due:
            </Box>{' '}
            {formatDate(task.due)}
          </Typography>

          <Typography sx={{ color: COLORS.muted, fontSize: '0.71rem', mt: 0.2 }}>
            From: {task.meetingTitle || 'Meeting action item'}
          </Typography>

          <Stack direction="row" spacing={0.75} sx={{ mt: 1, flexWrap: 'wrap' }}>
            {status !== 'Done' && (
              <Button
                data-tour={showMarkDoneTour ? 'mark-task-done' : undefined}
                size="small"
                variant="outlined"
                onClick={() => onMarkDone(task.id)}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.7rem',
                  fontWeight: 750,
                  color: COLORS.green,
                  borderColor: '#B9D7C8',
                  borderRadius: '8px',
                }}
              >
                Mark as done
              </Button>
            )}

            {task.meetingId && (
              <Button
                size="small"
                endIcon={<OpenInNewOutlined sx={{ fontSize: '15px !important' }} />}
                onClick={() => onOpen(task)}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.7rem',
                  fontWeight: 750,
                  color: COLORS.blue,
                }}
              >
                Open meeting
              </Button>
            )}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  )
}