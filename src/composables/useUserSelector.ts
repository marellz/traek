import type { UserRole } from '@/data/users.data'
import type { UserProfile } from '@/stores/auth'
import { ref } from 'vue'

export const useUserSelector = (
  queryFn: (query: string, params: { limit: number }) => Promise<UserProfile[] | null>,
) => {
  const query = ref('')
  const results = ref<UserProfile[]>([])
  const selected = ref<{ user: UserProfile; role: UserRole }[]>([])

  // local
  const roles = ref<Record<string, UserRole>>({})

  // local

  const searchUsers = async () => {
    const _users = await queryFn(query.value, { limit: 5 })
    if (_users) results.value = _users
  }

  const addUser = (user: UserProfile, role: UserRole) => {
    const _index = selected.value.findIndex((m) => m.user.id === user.id)
    const payload = { user, role }
    if (_index !== -1) {
      // contains
      selected.value[_index] = payload
    } else {
      // add new
      selected.value = [...selected.value, payload]
    }
  }

  type Timeout = ReturnType<typeof setTimeout>
  const debouncer = ref<Timeout | null>(null)
  const debounceSearch = () => {
    if (debouncer.value) {
      clearTimeout(debouncer.value)
    }

    debouncer.value = setTimeout(searchUsers, 500)
  }

  const resetQuery = () => {
    query.value = ''
    results.value = []
  }

  const removeSelected = (id: string) => {
    const _index = selected.value.findIndex((u) => u.user.id === id)
    if (_index !== -1) selected.value.splice(_index, 1)
    delete roles.value[id]
  }

  return {
    query,
    roles,
    selected,
    results,
    addUser,

    removeSelected,
    debounceSearch,

    resetQuery,
  }
}
