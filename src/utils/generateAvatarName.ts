export const generateAvatarName = (filename: string, user_id: string) => {
  const extension = filename.split('.').pop()
  return `${user_id}.${extension}`
}
