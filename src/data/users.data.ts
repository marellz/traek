export enum UserRolesEnum {
  CREATOR = 'creator',
  CLIENT = 'client',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export const userRoles: Record<UserRole, string> = {
  [UserRolesEnum.CREATOR]: 'Creator',
  [UserRolesEnum.CLIENT]: 'Client',
  [UserRolesEnum.EDITOR]: 'Editor',
  [UserRolesEnum.VIEWER]: 'Viewer',
}

export type UserRole = `${UserRolesEnum}`
