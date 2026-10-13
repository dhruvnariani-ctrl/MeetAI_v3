import { DASHBOARD_TOUR_STEPS } from './dashboardTours'
import { getAllMeetings } from './meetings'

const FIRST_MEETING_ID =
  getAllMeetings()[0]?.id ?? ''

/*
 * ============================================================
 * SIDEBAR TOUR
 * ============================================================
 *
 * Sidebar is intentionally split into exactly 3 steps:
 *
 * 1. Main pages
 * 2. Add MeetAI to a Meeting
 * 3. Sidebar controls
 */

export const SIDEBAR_NAVIGATION_STEP = {
  path: '/',
  target:
    '[data-tour="sidebar-navigation"]',
  title: 'Your main pages',
  icon: 'Groups',
  body:
    'Use the sidebar to move between Dashboard, Calendar, Recorded Meetings, and My Tasks.',
  action:
    'Try the different pages from the sidebar.',
  tip:
    'Dashboard gives you an overview, Calendar manages meetings, Recorded Meetings contains completed meeting content, and My Tasks contains your follow-up work.',
}

export const SIDEBAR_INSTANT_JOIN_STEP = {
  path: '/',
  target:
    '[data-tour="Add MeetAI to a Meeting"]',
  title: 'Add MeetAI to a Meeting',
  icon: 'PlayCircleOutlined',
  body:
    'Add MeetAI to a Meeting lets you quickly start or join a meeting without first navigating through your calendar.',
  action:
    'Select Add MeetAI to a Meeting when you need to join a meeting quickly.',
  tip:
    'This is useful when you already have a meeting link ready.',
}

export const SIDEBAR_CONTROLS_STEP = {
  path: '/',
  target:
    '[data-tour="sidebar-controls"]',
  title: 'Sidebar controls',
  icon: 'HelpOutlined',
  body:
    'These controls let you refresh your data, open the How it works guide, and collapse the sidebar.',
  action:
    'Try the controls when you are ready.',
  tip:
    'Collapsing the sidebar gives the main content more space.',
}

export const HEADER_SEARCH_BAR_STEP = {
  path: '/',
  target:
    '[data-tour="header-search"]',
  title: 'Search your meetings',
  icon: 'Search',
  body:
    'Quickly find a meeting by searching its title, platform, or participants.',
  action:
    'Type a meeting name or person to see matching meetings.',
  tip:
    'Click a result to open that meeting’s details page.',
}

export const SIDEBAR_TOUR_STEPS = [
  SIDEBAR_NAVIGATION_STEP,
  SIDEBAR_INSTANT_JOIN_STEP,
  SIDEBAR_CONTROLS_STEP,
  HEADER_SEARCH_BAR_STEP,
]

/*
 * ============================================================
 * CALENDAR TOUR
 * ============================================================
 */

export const CALENDAR_STEPS = [
  {
    path: '/calendar',
    target:
      '[data-tour="calendar-date-menu"]',
    title: 'Choose a date',
    icon: 'CalendarMonth',
    body:
      'Use this menu to quickly move to Today, Yesterday, or Tomorrow.',
    action:
      'Open the date menu and choose a date.',
    tip:
      'You can also use the calendar arrows to move forward or backward.',
  },

  {
    path: '/calendar',
    target:
      '[data-tour="calendar-view"]',
    title: 'Change your calendar view',
    icon: 'CalendarMonth',
    body:
      'Choose Day, Week, or Month depending on how you want to see your meetings.',
    action:
      'Try switching between the different calendar views.',
    tip:
      'Month view is useful when you want to see your schedule at a glance.',
  },
  {
    path: '/calendar',
    target:
      '[data-tour="new-meeting"]',
    title: 'Create a meeting',
    icon: 'EventAvailable',
    body:
      'Use New meeting when you want to schedule a meeting.',
    action:
      'Select New meeting to open the meeting form.',
    tip:
      'You can add the meeting details and participants before saving.',
    opensDialog: true,
  },
  {
    path: '/calendar',
    target:
      '[data-tour="calendar-meeting-list"]',
    title: 'Open a meeting',
    icon: 'Groups',
    body:
      'Your meetings appear here. Select a meeting to see its details, participants, and available meeting information.',
    action:
      'Open one of the meetings in your calendar.',
    tip:
      'Completed meetings can contain additional information such as notes and recordings.',
  },
]

export const CALENDAR_TOUR_STEPS =
  CALENDAR_STEPS

/*
 * ============================================================
 * RECORDED MEETINGS TOUR
 * ============================================================
 */

export const RECORDED_MEETINGS_TOUR_STEPS = [
  {
    path: '/recorded',
    target:
      '[data-tour="recorded-search"]',
    title: 'Search recorded meetings',
    icon: 'VideoLibrary',
    body:
      'Use the search box to find recorded meetings by title, platform, or participant.',
    action:
      'Try searching for a meeting or participant.',
    tip:
      'The results update automatically as you type.',
  },

  {
    path: '/recorded',
    target:
      '[data-tour="recorded-filters"]',
    title: 'Filter recordings',
    icon: 'FilterList',
    body:
      'Use the date filter to narrow the list to today, this week, this month, or all recorded meetings.',
    action:
      'Open the date filter and try one of the available options.',
    tip:
      'You can combine the date filter with the search box.',
  },

  {
    path: '/recorded',
    target:
      '[data-tour="recorded-sort"]',
    title: 'Sort your recordings',
    icon: 'CalendarMonth',
    body:
      'Use Sort to order your recorded meetings by newest, oldest, or meeting title.',
    action:
      'Open Sort and review the available options.',
    tip:
      'Sorting is useful when you have several recorded meetings to review.',
  },

  {
    path: '/recorded',
    target:
      '[data-tour="recorded-meeting-list"]',
    title: 'Recorded meeting list',
    icon: 'VideoLibrary',
    body:
      'This area contains meetings that have an available recording. Each card shows the meeting title, platform, date, time, participants, and duration.',
    action:
      'Review the information on a recorded meeting.',
    tip:
      'Only meetings with an available recording are displayed here.',
  },
]

/*
 * Backward-compatible single Recorded Meetings step.
 */
export const RECORDED_STEP =
  RECORDED_MEETINGS_TOUR_STEPS[0]

/*
 * ============================================================
 * MEETING DETAILS TOUR
 * ============================================================
 */

export const MEETING_DETAILS_TOUR_STEPS = [
  {
    path: `/meetings/${FIRST_MEETING_ID}`,
    target:
      '[data-tour="meeting-header"]',
    title: 'Meeting details',
    icon: 'Groups',
    body:
      'This page contains the important information about the meeting.',
    action:
      'Review the meeting information.',
    tip:
      'The meeting header gives you the basic context before you review the rest of the meeting.',
  },

  {
    path: `/meetings/${FIRST_MEETING_ID}`,
    target:
      '[data-tour="meeting-participants"]',
    title: 'Participants',
    icon: 'Groups',
    body:
      'See who was invited to the meeting and, when available, who attended.',
    action:
      'Review the participants.',
    tip:
      'Participant information helps you understand who was involved in the meeting.',
  },

  {
    path: `/meetings/${FIRST_MEETING_ID}`,
    target:
      '[data-tour="meeting-content"]',
    title: 'Meeting content',
    icon: 'TaskAlt',
    body:
      'The summary, recording, transcript, and action items appear here when they are available.',
    action:
      'Review the available meeting content.',
    tip:
      'Different sections become useful after a meeting has been completed.',
  },
]

/*
 * ============================================================
 * MY TASKS TOUR
 * ============================================================
 */

export const MY_TASKS_TOUR_STEPS = [
  {
    path: '/tasks',
    target:
      '[data-tour="tasks-filters"]',
    title: 'Filter your tasks',
    icon: 'TaskAlt',
    body:
      'Use these filters to view all tasks or focus on Pending, In Process, Blocked, or Done tasks.',
    action:
      'Try switching between the task status filters.',
    tip:
      'Filtering helps you focus on the work that needs attention.',
  },

  {
    path: '/tasks',
    target:
      '[data-tour="tasks-sort"]',
    title: 'Sort your tasks',
    icon: 'CalendarMonth',
    body:
      'Use Sort to organise your tasks by your original order, due date, or priority.',
    action:
      'Open the Sort menu and review the available options.',
    tip:
      'Sorting by due date is useful when you want to see upcoming work first.',
  },

  {
    path: '/tasks',
    target:
      '[data-tour="task-card"]',
    title: 'Review a task',
    icon: 'TaskAlt',
    body:
      'Each task represents an action item from a meeting and contains the work that needs to be completed.',
    action:
      'Review the first task in the list.',
    tip:
      'Tasks are generated from action items associated with your meetings.',
  },

  {
    path: '/tasks',
    target:
      '[data-tour="task-details"]',
    title: 'Task details',
    icon: 'TaskAlt',
    body:
      'Every task shows useful details such as the owner, due date, and priority.',
    action:
      'Review the owner, due date, and priority.',
    tip:
      'These details help you understand who owns the task and when it should be completed.',
  },

  {
    path: '/tasks',
    target:
      '[data-tour="task-status"]',
    title: 'Task status',
    icon: 'CheckCircle',
    body:
      'The status badge tells you whether the task is Pending, In Process, Blocked, or Done.',
    action:
      'Check the current status of the task.',
    tip:
      'You can use the filters at the top of the page to find tasks by status.',
  },

  {
    path: '/tasks',
    target:
      '[data-tour="mark-task-done"]',
    title: 'Mark a task as done',
    icon: 'CheckCircle',
    body:
      'When you finish an action item, use Mark as done to change the task status to Done.',
    action:
      'Use Mark as done when the task is completed.',
    tip:
      'Completed tasks no longer show the Mark as done button.',
  },
]

/*
 * Backward-compatible single My Tasks step.
 */
export const TASKS_STEP =
  MY_TASKS_TOUR_STEPS[0]

/*
 * ============================================================
 * FULL APPLICATION TOUR
 * ============================================================
 *
 * Order:
 *
 * Sidebar
 * Dashboard
 * Calendar
 * Recorded Meetings
 * Meeting Details
 * My Tasks
 */

export const APP_TOUR_STEPS = [
  ...SIDEBAR_TOUR_STEPS,

  ...DASHBOARD_TOUR_STEPS,

  ...CALENDAR_STEPS,

  ...RECORDED_MEETINGS_TOUR_STEPS,

  ...MEETING_DETAILS_TOUR_STEPS,

  ...MY_TASKS_TOUR_STEPS,
]

/*
 * ============================================================
 * PAGE TOURS
 * ============================================================
 */

export const SIDEBAR_PAGE_TOUR_STEPS =
  SIDEBAR_TOUR_STEPS

export const DASHBOARD_PAGE_TOUR_STEPS =
  DASHBOARD_TOUR_STEPS

export const CALENDAR_PAGE_TOUR_STEPS =
  CALENDAR_STEPS

export const RECORDED_PAGE_TOUR_STEPS =
  RECORDED_MEETINGS_TOUR_STEPS

export const MEETING_DETAILS_PAGE_TOUR_STEPS =
  MEETING_DETAILS_TOUR_STEPS

export const TASKS_PAGE_TOUR_STEPS =
  MY_TASKS_TOUR_STEPS