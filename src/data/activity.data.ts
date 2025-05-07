import { ActivityTypes, type ActivityType } from '@/stores/activity'
import {
  CalendarPlus,
  FolderPen,
  FolderPlus,
  FolderX,
  ListPlus,
  ListTodo,
  NotebookPen,
  UserPlus,
  type LucideIcon,
} from 'lucide-vue-next'

export const activityIcons: Record<ActivityType, LucideIcon> = {
  [ActivityTypes.TASK_CREATED]: ListPlus,
  [ActivityTypes.TASK_STATUS_UPDATED]: ListTodo,

  [ActivityTypes.PROJECT_CREATED]: FolderPlus,
  [ActivityTypes.PROJECT_UPDATED]: FolderPen,
  [ActivityTypes.PROJECT_CLOSED]: FolderX,
  [ActivityTypes.MEMBERS_ADDED]: UserPlus,

  [ActivityTypes.NOTE_CREATED]: NotebookPen,
  [ActivityTypes.EVENT_CREATED]: CalendarPlus,
}
