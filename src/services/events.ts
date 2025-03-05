import { supabase } from '@/database/supabase'
import type { ProjectEventForm } from '@/stores/event'

export const useEventService = () => {
  const list = async (project: string) => {
    // event
    return await supabase.from('events').select().eq('project_id', project)
  }

  const getEvent = async (id: string) => {
    return await supabase.from('events').select().eq('id', id)
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

  /**
   * USER
   */

  const getUserEvents = async (user_id: string) => {
    return await supabase.from('event_invitees').select().eq('user_id', user_id)
  }

  /**
   * INVITEES
   */

  const addInvitees = async (payload: { user_id: string; event_id: string }[]) => {
    return await supabase.from('event_invitees').insert(payload).select()
  }

  const getInvitees = async (event_id: string) => {
    return await supabase.from('event_invitees').select().eq('event_id', event_id)
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

    getUserEvents,

    addInvitees,
    getInvitees,
    deleteInvitee,
  }
}
