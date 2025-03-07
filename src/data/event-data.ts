
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

export const eventDurations: Record<string, number> = {
  '15 min': 0.25,
  '30 min': 0.5,
  '45 min': 0.75,
  '1 hour': 1,
  '2 hours': 2,
  '4 hours': 4,
}
