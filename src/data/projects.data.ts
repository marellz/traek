export enum ProjectCategories {
  GENERAL = 'general',
  PERSONAL = 'personal',
  WORK = 'work',
  SOFTWARE_DEVELOPMENT = 'software_development',
  EVENT_PLANNING = 'event_planning',
  RESEARCH = 'research',
  MARKETING_CAMPAIGN = 'marketing_campaign',
  CONSTRUCTION = 'construction',
  EDUCATION = 'education',
  CREATIVE = 'creative',
  COMMUNITY = 'community',
  FREElANCE = 'freelance',
}

export type ProjectCategory = `${ProjectCategories}`

export const projectCategoryLabels = {
  [ProjectCategories.GENERAL]: 'General',
  [ProjectCategories.PERSONAL]: 'Personal',
  [ProjectCategories.WORK]: 'Work',
  [ProjectCategories.SOFTWARE_DEVELOPMENT]: 'Software development',
  [ProjectCategories.EVENT_PLANNING]: 'Event planning',
  [ProjectCategories.RESEARCH]: 'Research',
  [ProjectCategories.MARKETING_CAMPAIGN]: 'Marketing ampaign',
  [ProjectCategories.CONSTRUCTION]: 'Construction',
  [ProjectCategories.EDUCATION]: 'Education',
  [ProjectCategories.CREATIVE]: 'Creative',
  [ProjectCategories.COMMUNITY]: 'Community',
  [ProjectCategories.FREElANCE]: 'Freelance',
}

export const projectCategoryDescription = {
  [ProjectCategories.GENERAL]: 'Default catch-all project',
  [ProjectCategories.PERSONAL]: 'Personal goal tracking, habits, etc.',
  [ProjectCategories.WORK]: 'Generic work projects',
  [ProjectCategories.SOFTWARE_DEVELOPMENT]: 'Product builds, sprints, bug tracking',
  [ProjectCategories.EVENT_PLANNING]: 'Organizing weddings, conferences, meetups',
  [ProjectCategories.RESEARCH]: 'Academic, scientific, or field research projects',
  [ProjectCategories.MARKETING_CAMPAIGN]: 'Campaigns, content calendars',
  [ProjectCategories.CONSTRUCTION]: 'Building or renovation projects',
  [ProjectCategories.EDUCATION]: 'Courses, tutoring, lesson planning',
  [ProjectCategories.CREATIVE]: 'Design, writing, filmmaking',
  [ProjectCategories.COMMUNITY]: 'SACCO, church, school, or NGO activities',
  [ProjectCategories.FREElANCE]: 'Client work, gigs, contract jobs',
}

export enum ProjectPriorities {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export const projectPriorities = {
  [ProjectPriorities.LOW]: 'Low',
  [ProjectPriorities.MEDIUM]: 'Medium',
  [ProjectPriorities.HIGH]: 'High',
}

export const formPages = [
  {
    routeName: 'edit-project',
    label: 'Basic Info',
    description: 'Simple intro to the project.',
  },
  {
    routeName: 'project-form-about',
    label: 'About & Goals',
    description: 'Define the intent and targets of the project.',
  },
  {
    routeName: 'project-form-team',
    label: 'Team',
    description: 'Decide who’s in and what roles they might play.',
  },
  {
    routeName: 'project-form-review',
    label: 'Review & Create',
    description: 'Recap entries and confirm before submission.',
  },
]

export enum ProjectGoalStatusEnum {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export type ProjectGoalStatus = `${ProjectGoalStatusEnum}`

export const projectGoalStatuses : Record<ProjectGoalStatus, string> = {
  [ProjectGoalStatusEnum.PENDING]: 'Pending',
  [ProjectGoalStatusEnum.IN_PROGRESS]: 'In progress',
  [ProjectGoalStatusEnum.COMPLETED]: 'Completed',
}
