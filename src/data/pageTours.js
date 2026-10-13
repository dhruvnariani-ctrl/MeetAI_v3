import {
  CalendarMonth,
  Groups,
  TaskAlt,
  VideoLibrary,
} from '@mui/icons-material'

import {
  DASHBOARD_PAGE_TOUR_STEPS,
  CALENDAR_PAGE_TOUR_STEPS,
  RECORDED_PAGE_TOUR_STEPS,
  MEETING_DETAILS_PAGE_TOUR_STEPS,
  TASKS_PAGE_TOUR_STEPS,
} from './tours'

/* One card per page on the "Want to learn just one thing?" section. */
export const PAGE_TOURS = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description:
      'Get a quick overview of your meetings, upcoming calls, and important tasks.',
    button: 'Tour Dashboard',
    icon: Groups,
    steps: DASHBOARD_PAGE_TOUR_STEPS,
  },
  {
    id: 'calendar',
    title: 'Calendar',
    description:
      'Learn how to find meetings, change your calendar view, and create new meetings.',
    button: 'Tour Calendar',
    icon: CalendarMonth,
    steps: CALENDAR_PAGE_TOUR_STEPS,
  },
  {
    id: 'recorded',
    title: 'Recorded Meetings',
    description:
      'Learn how to find past meetings and review recordings, transcripts, and notes.',
    button: 'Tour Recorded Meetings',
    icon: VideoLibrary,
    steps: RECORDED_PAGE_TOUR_STEPS,
  },
  {
    id: 'meeting-details',
    title: 'Meeting Details',
    description:
      'See where to find participants, meeting information, recordings, and summaries.',
    button: 'Tour Meeting Details',
    icon: Groups,
    steps: MEETING_DETAILS_PAGE_TOUR_STEPS,
  },
  {
    id: 'tasks',
    title: 'My Tasks',
    description:
      'Learn how to find your action items, check their status, and mark work as done.',
    button: 'Tour My Tasks',
    icon: TaskAlt,
    steps: TASKS_PAGE_TOUR_STEPS,
  },
]