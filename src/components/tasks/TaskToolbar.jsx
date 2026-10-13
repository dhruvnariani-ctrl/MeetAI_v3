import {
  Box,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { SearchOutlined } from '@mui/icons-material'

import { TASK_SORT_OPTIONS } from '../../data/tasks'
import { COLORS, DUE_DATE_FILTERS } from './taskConstants'

const SORT_OPTIONS = TASK_SORT_OPTIONS.map((option) => ({
  value: option,
  label: `Sort: ${option}`,
}))

const selectSx = {
  height: 38,
  borderRadius: '9px',
  backgroundColor: COLORS.white,
  fontSize: '0.75rem',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: COLORS.border,
  },
}

function ToolbarSelect({ value, onChange, options, label, minWidth }) {
  return (
    <FormControl
      size="small"
      sx={{ minWidth, flexShrink: 0 }}
    >
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        sx={selectSx}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default function TaskToolbar({
  search,
  onSearchChange,
  dueDate,
  onDueDateChange,
  sortBy,
  onSortByChange,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        minWidth: 0,
        mb: 2,
      }}
    >
      {/* Left: Header and subtitle */}
      <Box
        sx={{
          flex: '1 1 auto',
          minWidth: 0,
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: '1.5rem', md: '1.8rem' },
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.035em',
            color: COLORS.navy,
          }}
        >
          My Tasks
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            color: COLORS.muted,
            fontSize: '0.83rem',
          }}
        >
          Action items assigned to you from your meetings.
        </Typography>
      </Box>

      {/* Right: Search, due date and sorting */}
      <Stack
        direction="row"
        spacing={0.8}
        alignItems="center"
        justifyContent="flex-end"
        sx={{
          flex: '0 0 auto',
          ml: 'auto',
          minWidth: 0,
          alignSelf: 'center',
          flexWrap: 'nowrap',
        }}
      >

        <ToolbarSelect
          value={dueDate}
          onChange={onDueDateChange}
          options={DUE_DATE_FILTERS}
          label="Filter by due date"
          minWidth={115}
        />

        <ToolbarSelect
          value={sortBy}
          onChange={onSortByChange}
          options={SORT_OPTIONS}
          label="Sort tasks"
          minWidth={135}
        />
      </Stack>
    </Box>
  )
}