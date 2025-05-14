export enum UserRolesEnum {
  CREATOR = 'creator',
  CLIENT = 'client',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}
// todo: change this UserRole to ProjectMemberRole
export const userRoles: Record<UserRole, string> = {
  [UserRolesEnum.CREATOR]: 'Creator',
  [UserRolesEnum.CLIENT]: 'Client',
  [UserRolesEnum.EDITOR]: 'Editor',
  [UserRolesEnum.VIEWER]: 'Viewer',
}

export type UserRole = `${UserRolesEnum}`
