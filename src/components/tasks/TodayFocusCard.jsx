import {
  Box,
  Button,
  Collapse,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import {
  CheckCircleOutlined,
  ChevronRight,
  WbSunnyOutlined,
} from '@mui/icons-material'

import { normalizeTaskPriority, normalizeTaskStatus } from '../../data/tasks'
import { CARD_SX, COLORS, PRIORITY_COLORS } from './taskConstants'
import { getDueLabel } from './taskHelpers'
import { PriorityBadge } from './TaskBadges'
import SectionHeading from './SectionHeading'

const linkButtonSx = {
  minWidth: 0,
  px: 1.1,
  py: 0.25,
  textTransform: 'none',
  fontSize: '0.66rem',
  fontWeight: 700,
  lineHeight: 1.5,
  color: COLORS.blue,
  border: '1px solid',
  borderColor: COLORS.blue,
  borderRadius: '6px',
  '&:hover': {
    borderColor: COLORS.blue,
    backgroundColor: 'rgba(25, 118, 210, 0.06)',
  },
}

export default function TodayFocusCard({
  tasks,
  expandedTaskId,
  onToggle,
  onMarkDone,
  onOpen,
  onViewToday,
}) {
  return (
    <Paper elevation={0} sx={CARD_SX}>
      <SectionHeading
        icon={<WbSunnyOutlined />}
        title="Today's Focus"
        subtitle={`${tasks.length} priority ${tasks.length === 1 ? 'item' : 'items'}`}
      />

      <Divider sx={{ my: 1.4, borderColor: COLORS.border }} />

      {tasks.length === 0 ? (
        <Box sx={{ py: 1.5 }}>
          <CheckCircleOutlined sx={{ color: COLORS.green, fontSize: 25, mb: 0.5 }} />
          <Typography sx={{ color: COLORS.text, fontSize: '0.78rem', fontWeight: 750 }}>
            You're clear for today
          </Typography>
          <Typography sx={{ color: COLORS.muted, fontSize: '0.7rem', mt: 0.35 }}>
            No overdue or due-today open tasks.
          </Typography>
        </Box>
      ) : (
        <Stack divider={<Divider flexItem sx={{ borderColor: '#EDF1F4' }} />}>
          {tasks.map((task) => {
            const priority = normalizeTaskPriority(task.priority)
            const priorityStyle = PRIORITY_COLORS[priority] ?? PRIORITY_COLORS.Medium
            const expanded = expandedTaskId === task.id

            return (
              <Box key={task.id} sx={{ py: 1.1, minWidth: 0 }}>
                <Stack direction="row" alignItems="flex-start" spacing={0.8}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      mt: 0.6,
                      borderRadius: '50%',
                      backgroundColor: priorityStyle.color,
                      flexShrink: 0,
                    }}
                  />

                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      sx={{
                        color: COLORS.navy,
                        fontSize: '0.74rem',
                        fontWeight: 750,
                        lineHeight: 1.45,
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {task.title}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.35,
                        color: COLORS.muted,
                        fontSize: '0.66rem',
                        lineHeight: 1.45,
                      }}
                    >
                      {task.meetingTitle || 'Meeting action item'}
                    </Typography>

                    {/* Priority badge on the left, due label pinned to the right */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      gap={0.5}
                      sx={{ mt: 0.7, width: '100%' }}
                    >
                      <PriorityBadge priority={priority} />

                      <Typography
                        sx={{
                          ml: 'auto',
                          color: COLORS.muted,
                          fontSize: '0.64rem',
                          textAlign: 'right',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {getDueLabel(task.due)}
                      </Typography>
                    </Stack>

                    {/* Details + Meeting: bordered, right-aligned, same line */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                      spacing={0.7}
                      sx={{ mt: 0.8, width: '100%' }}
                    >
                      <Button size="small" onClick={() => onToggle(task.id)} sx={linkButtonSx}>
                        {expanded ? 'Hide details' : 'Details'}
                      </Button>

                      {task.meetingId && (
                        <Button size="small" onClick={() => onOpen(task)} sx={linkButtonSx}>
                          Meeting
                        </Button>
                      )}
                    </Stack>

                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                      <Box sx={{ mt: 0.75 }}>
                        <Typography
                          sx={{ color: COLORS.muted, fontSize: '0.67rem', lineHeight: 1.6 }}
                        >
                          Owner: {task.owner || 'Unassigned'}
                        </Typography>

                        {normalizeTaskStatus(task.status) !== 'Done' && (
                          <Button
                            size="small"
                            onClick={() => onMarkDone(task.id)}
                            sx={{
                              mt: 0.5,
                              px: 0,
                              textTransform: 'none',
                              color: COLORS.green,
                              fontSize: '0.68rem',
                              fontWeight: 750,
                            }}
                          >
                            Mark as done
                          </Button>
                        )}
                      </Box>
                    </Collapse>
                  </Box>
                </Stack>
              </Box>
            )
          })}
        </Stack>
      )}

      <Divider sx={{ my: 1.2, borderColor: COLORS.border }} />

      <Button
        onClick={onViewToday}
        endIcon={<ChevronRight />}
        sx={{
          px: 0,
          minWidth: 0,
          textTransform: 'none',
          color: COLORS.blue,
          fontSize: '0.72rem',
          fontWeight: 800,
        }}
      >
        View today's tasks
      </Button>
    </Paper>
  )
}