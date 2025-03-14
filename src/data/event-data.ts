import { EventStatusEnum, EventTypeEnum } from "@/stores/event"

export type EventStatus =  `${EventStatusEnum}`
export type EventTypes = `${EventTypeEnum}`

export const eventStatuses : Record<EventStatus, string> = {
  [EventStatusEnum.UPCOMING]: 'Upcoming',
  [EventStatusEnum.IN_PROGRESS]: 'In progress',
  [EventStatusEnum.PAST]: 'Past event',
  [EventStatusEnum.CANCELLED]: "Cancelled"
}

export const eventStatusColors: Record<EventStatus, string> = {
  [EventStatusEnum.UPCOMING]: 'bg-blue-500 text-white !border-blue-500',
  [EventStatusEnum.IN_PROGRESS]: 'bg-green-500 text-white !border-green-500',
  [EventStatusEnum.PAST]: 'bg-slate-500 text-white border-slate-500',
  [EventStatusEnum.CANCELLED]: 'bg-orange-500 text-white border-orange-500',
}

export const eventTypes: Record<EventTypes, string> = {
  [EventTypeEnum.ONLINE]: 'Online - Zoom, Meet',
  [EventTypeEnum.PHYSICAL]: 'Physical meeting',
  [EventTypeEnum.EVENT]: 'Day event',
}

export const eventDurations: Record<string, number> = {
  '15 min': 0.25,
  '30 min': 0.5,
  '45 min': 0.75,
  '1 hour': 1,
  '2 hours': 2,
  '4 hours': 4,
}
