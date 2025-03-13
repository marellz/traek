
export type EventStatus = 'upcoming' | 'in_progress' | 'past' | 'cancelled'
export const eventStatuses : Record<EventStatus, string> = {
  upcoming: 'Upcoming',
  in_progress: 'In progress',
  past: 'Past event',
  cancelled: "Cancelled"
}

export type EventTypes = 'online' | 'physical' | 'event'
export const eventTypes: Record<EventTypes, string> = {
  online: 'Online - Zoom, Meet',
  // meeting: "Meeting",
  physical: 'Physical meeting',
  event: 'Day event',

}

export const eventStatusColors: Record<EventStatus, string> = {
  upcoming: 'text-slate-800', //bg-blue-100 text-blue-500
  in_progress: 'bg-green-100 border-green-500',
  past: 'bg-slate-100 text-slate-700',
  cancelled: 'bg-slate-100 text-slate-700',
}

export const eventDurations: Record<string, number> = {
  '15 min': 0.25,
  '30 min': 0.5,
  '45 min': 0.75,
  '1 hour': 1,
  '2 hours': 2,
  '4 hours': 4,
}
