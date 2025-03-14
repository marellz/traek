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
  [EventStatusEnum.UPCOMING]: 'text-slate-800', //bg-blue-100 text-blue-500
  [EventStatusEnum.IN_PROGRESS]: 'bg-green-100 border-green-500',
  [EventStatusEnum.PAST]: 'bg-slate-100 text-slate-700',
  [EventStatusEnum.CANCELLED]: 'bg-slate-100 text-slate-700',
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
