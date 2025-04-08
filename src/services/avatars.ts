import { supabase } from '@/database/supabase'
import type { AvatarTransform } from '@/stores/user'

export const useAvatarService = () => {
  const getAvatarLink = async (path: string, transform?: AvatarTransform | null) => {
    const customSize = transform ? { width: transform.size, height: transform.size } : undefined
    return supabase.storage.from('avatars').getPublicUrl(path, {
      transform: customSize,
    })
  }

  const uploadAvatar = async (file: File, fileName: string) => {
    return await supabase.storage.from('avatars').upload(`/public/${fileName}`, file, {
      upsert: true,
    })
  }

  const deleteAvatar = async (path: string) => {
    return await supabase.storage.from('avatars').remove([path])
  }

  return {
    getAvatarLink,
    uploadAvatar,
    deleteAvatar,
  }
}
