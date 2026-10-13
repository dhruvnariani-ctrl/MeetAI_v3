/*
 * Icons are STRINGS and must match a key in TOUR_ICONS (TourRunner.jsx).
 * Only targets that really exist in the Dashboard are listed here.
 */
export const DASHBOARD_TOUR_STEPS = [
  {
    path: '/',
    target: '[data-tour="dashboard-todays-meetings"]',
    title: "Today's meetings",
    icon: 'CalendarMonth',
    body:
      'This section shows the meetings scheduled for today. You can quickly see what has already happened and what is coming next.',
    action: 'Look through the meetings shown here.',
    tip: 'Completed and upcoming meetings are shown differently so they are easier to recognise.',
  },
  {
    path: '/',
    target: '[data-tour="dashboard-meetai-status"]',
    title: 'MeetAI status',
    icon: 'Mic',
    body:
      'These switches show whether MeetAI is invited to a meeting and whether video recording is on.',
    action: 'Select the switches to change MeetAI settings for a meeting.',
    tip: 'MeetAI is optional. You can decide whether to invite it for each meeting.',
  },

  {
    path: '/',
    target: '[data-tour="dashboard-action-items"]',
    title: 'Action items',
    icon: 'TaskAlt',
    body:
      'Action items are follow-up tasks from your meetings. This section helps you remember what needs to be done.',
    action: 'Look at the action items shown on the dashboard.',
    tip: 'You can open My Tasks to see all of your action items together.',
  },


  {
  path: '/',
  target: '[data-tour="dashboard-new-meeting"]',
  title: 'Quick actions',
  icon: 'Bolt',
  body:
    'Use Quick actions to access common meeting and productivity features directly from your Dashboard.',
  action:
    'Choose Schedule meeting to create a meeting, Add MeetAI to open the instant-join dialog, View recordings to access recorded meetings, or My tasks to open your task list.',
  tip:
    'Schedule meeting opens the meeting form. Add MeetAI opens the instant-join dialog. View recordings and My tasks take you to their respective pages.',
  opensDialog: false,
},
]