import {
  Box,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
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

const controlSx = {
  height: 38,
  backgroundColor: COLORS.white,
  fontSize: '0.75rem',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.border },
}

function ToolbarSelect({ value, onChange, options, label }) {
  return (
    <FormControl size="small" sx={{ flex: { xs: '1 1 140px', md: '0 0 auto' }, minWidth: { md: 135 } }}>
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        inputProps={{ 'aria-label': label }}
        sx={controlSx}
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
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        gap: 1.5,
        width: '100%',
        minWidth: 0,
        mb: 1.5,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h1" component="h1">
          My Tasks
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
          Action items assigned to you from your meetings.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', minWidth: 0 }}>
        <TextField
          size="small"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search tasks"
          slotProps={{
            htmlInput: { 'aria-label': 'Search tasks' },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ flex: { xs: '1 1 100%', md: '0 0 220px' }, '& .MuiOutlinedInput-root': controlSx }}
        />

        <ToolbarSelect
          value={dueDate}
          onChange={onDueDateChange}
          options={DUE_DATE_FILTERS}
          label="Filter by due date"
        />

        <ToolbarSelect
          value={sortBy}
          onChange={onSortByChange}
          options={SORT_OPTIONS}
          label="Sort tasks"
        />
      </Box>
    </Box>
  )
}
