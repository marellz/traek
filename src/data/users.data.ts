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

export type UserRoleOption = {
  label: string;
  key: UserRole
}

export const userRoleOptions : UserRoleOption[] = Object.values(UserRolesEnum).map((r) => ({
  key: r,
  label: userRoles[r],
}))
