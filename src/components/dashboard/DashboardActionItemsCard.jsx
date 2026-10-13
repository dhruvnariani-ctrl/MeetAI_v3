import { useId } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'

import {
  COLORS,
  PRIORITY,
  PRIORITY_ORDER,
  formatDue,
} from './dashboardUtils'

export default function DashboardActionItemsCard({
  items = [],
  doneIds = new Set(),
  onToggleDone,
  priorityFilter = 'all',
  onPriorityChange,
  showAll = false,
  onShowAllChange,
}) {
  const headingId = useId()

  const actionableItems = items.filter(
    (item) =>
      !doneIds.has(item.id) &&
      !['done', 'completed', 'blocked'].includes(
        String(item.status ?? '').toLowerCase(),
      ),
  )

  const sorted = [...actionableItems].sort(
    (a, b) =>
      (PRIORITY_ORDER[a.priority] ?? 1) -
      (PRIORITY_ORDER[b.priority] ?? 1),
  )

  const filtered =
    priorityFilter === 'all'
      ? sorted
      : sorted.filter((item) => item.priority === priorityFilter)

  const visible = showAll ? filtered : filtered.slice(0, 6)

  const doneCount = items.filter(
    (item) =>
      doneIds.has(item.id) ||
      ['done', 'completed'].includes(
        String(item.status ?? '').toLowerCase(),
      ),
  ).length

  const priorities = ['all', 'high', 'medium', 'low']

  return (
    <Box
      component="section"
      aria-labelledby={headingId}
      data-tour="dashboard-action-items"
      sx={{
        bgcolor: '#FFFFFF',
        border: `1px solid ${COLORS.border}`,
        borderRadius: '12px',
        p: 1.5,
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            id={headingId}
            component="h2"
            sx={{
              fontSize: '.96rem',
              lineHeight: 1.35,
              fontWeight: 750,
              color: COLORS.navy,
            }}
          >
            Action items
          </Typography>

          <Typography
            sx={{
              fontSize: '.65rem',
              color: COLORS.muted,
              mt: 0.2,
              lineHeight: 1.4,
            }}
          >
            Tasks that need your attention
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: '.63rem',
            color: COLORS.muted,
            flexShrink: 0,
          }}
        >
          {doneCount} of {items.length} done
        </Typography>
      </Box>

      <Box
        role="group"
        aria-label="Filter by priority"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          my: 1.1,
        }}
      >
        {priorities.map((key) => {
          const active = priorityFilter === key
          const count =
            key === 'all'
              ? sorted.length
              : sorted.filter((item) => item.priority === key).length

          return (
            <Chip
              key={key}
              clickable
              label={`${key === 'all' ? 'All' : PRIORITY[key].label} ${count}`}
              onClick={() => onPriorityChange?.(key)}
              aria-pressed={active}
              sx={{
                height: 25,
                borderRadius: '99px',
                fontWeight: 700,
                fontSize: '.63rem',
                color: active ? '#FFFFFF' : COLORS.navy,
                bgcolor: active ? COLORS.navy : '#EEF3F7',
                '& .MuiChip-label': { px: 0.9 },
                '&:hover': {
                  bgcolor: active ? COLORS.navy : '#E1EAF1',
                },
              }}
            />
          )
        })}
      </Box>

      {visible.length === 0 ? (
        <Box
          sx={{
            py: 2,
            px: 1,
            textAlign: 'center',
            color: COLORS.muted,
          }}
        >
          <CheckCircleOutlineRoundedIcon
            sx={{ fontSize: 25, color: '#79AEE0', mb: 0.5 }}
          />

          <Typography
            sx={{
              fontSize: '.74rem',
              fontWeight: 650,
              color: COLORS.navy,
            }}
          >
            No action items here.
          </Typography>

          <Typography sx={{ mt: 0.25, fontSize: '.65rem' }}>
            You&apos;re all caught up.
          </Typography>
        </Box>
      ) : (
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {visible.map((item) => {
            const done =
              doneIds.has(item.id) ||
              ['done', 'completed'].includes(
                String(item.status ?? '').toLowerCase(),
              )

            const due = formatDue(item.due)
            const priority = PRIORITY[item.priority] ?? PRIORITY.medium

            return (
              <Box
                component="li"
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 0.4,
                  py: 0.65,
                  borderTop: `1px solid ${COLORS.border}`,
                  '&:first-of-type': { borderTop: 0 },
                }}
              >
                <Checkbox
                  size="small"
                  checked={done}
                  disabled={done}
                  onChange={() => onToggleDone?.(item.id)}
                  inputProps={{
                    'aria-label': `Mark "${item.title}" as done`,
                  }}
                  sx={{
                    mt: -0.15,
                    p: 0.35,
                    color: '#9AA9B5',
                    '&.Mui-checked': { color: COLORS.green },
                  }}
                />

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: '.70rem',
                      lineHeight: 1.4,
                      fontWeight: 650,
                      color: done ? '#7A8A96' : COLORS.navy,
                      textDecoration: done ? 'line-through' : 'none',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: '.62rem',
                      lineHeight: 1.4,
                      color: COLORS.muted,
                      mt: 0.2,
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {item.meeting || 'Meeting'}
                    {due ? ` · Due ${due}` : ''}
                  </Typography>
                </Box>

                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.4,
                    mt: 0.15,
                    fontSize: '.59rem',
                    fontWeight: 750,
                    color: priority.color,
                    flexShrink: 0,
                  }}
                >
                  <Box
                    component="span"
                    aria-hidden="true"
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: priority.color,
                    }}
                  />
                  {priority.label}
                </Box>
              </Box>
            )
          })}
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
          mt: 0.75,
        }}
      >
        <Box>
          {filtered.length > 6 && (
            <Button
              size="small"
              onClick={() => onShowAllChange?.(!showAll)}
              sx={{
                minWidth: 0,
                px: 0.5,
                textTransform: 'none',
                fontSize: '.65rem',
                fontWeight: 650,
              }}
            >
              {showAll ? 'Show fewer' : `Show all ${filtered.length}`}
            </Button>
          )}
        </Box>

        <Button
          size="small"
          component={RouterLink}
          to="/tasks"
          endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />}
          sx={{
            minWidth: 0,
            px: 0.5,
            textTransform: 'none',
            fontSize: '.68rem',
            fontWeight: 700,
          }}
        >
          View my tasks
        </Button>
      </Box>
    </Box>
  )
}