import { supabase } from '@/database/supabase'
import type { EventCancelPayload, ProjectEventForm } from '@/stores/event'
import type { TaskDateRange } from '@/stores/task'

export const useEventService = () => {
  const list = async (project: string) => {
    // event
    return await supabase
      .from('events')
      .select(
        `*,
        created_by(id, name, email, username, avatar),
        event_invitees(...users(id, name, email, username, avatar))`,
      )
      .eq('project_id', project)
      .order('datetime', { ascending: true })
  }

  const getEvent = async (id: string) => {
    return await supabase
      .from('events')
      .select(
        `*,
        created_by(id, name, email, username, avatar),
        event_invitees(...users(id, name, email, username, avatar))`,
      )
      .eq('id', id)
  }

  const create = async (form: ProjectEventForm) => {
    return await supabase.from('events').insert(form).select()
  }

  const update = async (id: string, form: ProjectEventForm) => {
    return await supabase.from('events').update(form).eq('id', id)
  }

  const destroy = async (id: string) => {
    return await supabase.from('events').delete().eq('id', id)
  }

  const cancelEvent = async (id: string, payload: EventCancelPayload) => {
    return await supabase.from('events').update(payload).eq('id', id)
  }

  /**
   * USER
   */

  const getUserEvents = async (user_id: string, dateRange?: TaskDateRange) => {
    const query = supabase
      .from('event_invitees')
      .select(
        `...event_id(
        *,
        project: project_id(id, name),
        creator: users(id, name, email, username, avatar),
        invitees: event_invitees(...users(id, name, email, username, avatar))
        )
      `,
      )
      .eq('user_id', user_id)
    if (dateRange)
      query.gte('event_id.datetime', dateRange.start_date).lt('event_id.datetime', dateRange.end_date)

    return await query
  }

  /**
   * INVITEES
   */

  const addInvitees = async (payload: { user_id: string; event_id: string }[]) => {
    return await supabase.from('event_invitees').insert(payload)
  }

  const getInvitees = async (event_id: string) => {
    return await supabase.from('event_invitees').select('...users(*)').eq('event_id', event_id)
  }

  const deleteInvitee = async (event_id: string, user_id: string) => {
    return await supabase
      .from('event_invitees')
      .delete()
      .eq('event_id', event_id)
      .eq('user_id', user_id)
  }

  return {
    list,
    getEvent,
    create,
    update,
    destroy,
    cancelEvent,

    getUserEvents,

    addInvitees,
    getInvitees,
    deleteInvitee,
  }
}
