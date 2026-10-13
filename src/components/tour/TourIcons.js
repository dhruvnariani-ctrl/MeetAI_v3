import {
  CalendarMonth,
  CheckCircle,
  EventAvailable,
  FilterList,
  Groups,
  HelpOutlined,
  Lightbulb,
  Mic,
  PlayCircleOutlined,
  Search,
  TaskAlt,
  Today,
  VideoLibrary,
} from '@mui/icons-material'

/*
 * Tour data (data/tours.js, data/dashboardTours.js) stores icons as STRINGS.
 * Every string used there must exist in this map.
 */
const TOUR_ICONS = {
  Today,
  CalendarMonth,
  CheckCircle,
  EventAvailable,
  FilterList,
  Groups,
  HelpOutlined,
  Lightbulb,
  Mic,
  PlayCircleOutlined,
  TaskAlt,
  VideoLibrary,
  Search
}

export const getTourIcon = (name) => TOUR_ICONS[name] || Lightbulb