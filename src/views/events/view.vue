<template>
  <layout-container>
    <base-loader v-if="loading.getting"></base-loader>
    <template v-else-if="_event">
      <div class="mt-6">
        <base-link :to="{
          name: 'project-tasks',
          params: { id: _event.project_id }
        }">
          <ArrowLeft :size="20" />
          <span>Project events</span>
        </base-link>
      </div>

      <div class="mt-6 space-y-4">
        <div class="flex items-center space-x-5">
          <h1 class="font-bold text-4xl">{{ _event.title }}</h1>
          <div v-if="isCancelled" class="bg-orange-500/10 text-orange-500 rounded-lg p-2 flex items-center space-x-2">
            <CalendarX :size="20" />
            <p class="font-medium text-sm">This event was cancelled</p>
          </div>
        </div>
        <div class="flex space-x-4 items-center">
          <p class="px-2 py-1 text-sm rounded-lg bg-black/10 font-medium">
            {{ eventTypes[_event.event_type as EventTypes] }}
          </p>
          <base-tag :class="eventStatusColors[_event.status as EventStatus]">
            {{ _event.status }}
          </base-tag>
        </div>

        <div class="border rounded-xl border-slate-200 flex space-x-3 p-4">
          <div class="flex items-center space-x-4 font-medium">
            <div class="flex items-center space-x-2">
              <CalendarCheck :size="20" v-if="isPast" />
              <CalendarX :size="20" v-else-if="isCancelled"></CalendarX>
              <CalendarArrowUp :size="20" v-else />
              <span :class="{ 'text-slate-500': isCancelled || isPast, 'line-through': isCancelled }">{{
                parseDate(_event.datetime) }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <Clock9 :size="20" />
              <span>{{ duration }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <template v-if="_event.event_type === 'physical'">
                <MapPin :size="20" />
                <span>
                  {{ _event.venue }}
                </span>
              </template>
              <template v-if="_event.event_type === 'event'">
                <MapPin :size="20" />
                <span>
                  {{ _event.venue }}
                </span>
              </template>
              <template v-else>
                <Link :size="20" />
                <span>
                  {{ _event.url }}
                </span>
              </template>
            </div>
          </div>

          <div v-if="auth.userId === _event.created_by.id" class="!ml-auto flex items-center space-x-2">
            <router-link v-if="_event" :to="{
              name: 'edit-event',
              params: {
                id: _event.id
              }
            }">
              <base-action>
                <span>Edit event</span>
              </base-action>
            </router-link>
            <base-action confirm @confirm="cancelEvent" :disabled="isCancelled || loading.cancelling">
              <span v-if="isCancelled">Cancelled</span>
              <span v-else>Cancel event</span>
            </base-action>
          </div>
        </div>

        <p class="text-sm text-slate-500">
          {{ _event.updated_at ? 'Updated at' : 'Created on' }}
          {{ parseDate(_event.updated_at ?? _event.created_at, 'Do MMM YYYY, h:mm A') }}
        </p>

        <div class="space-y-4">
          <div>
            <p class="font-medium text-sm text-slate-500">Description</p>
            <p>{{ _event.description ?? 'No description' }}</p>
          </div>
          <div>
            <p class="font-medium text-sm text-slate-500">Created by</p>
            <div class="flex space-x-2 items-center">
              <user-avatar size="h-10 w-10" :avatar="_event.created_by.avatar"></user-avatar>
              <span class="font-medium">
                {{ _event.created_by.name }} {{ _event.created_by.id === auth.userId ? `(you)` : '' }}
              </span>
              <span>/</span>
              <span class="flex items-center space-x-1 text-slate-600">
                <Mail :size="16" /> <span>{{ _event.created_by.email }}</span>
              </span>
            </div>
          </div>
          <div>
            <p class="font-medium text-sm text-slate-500">Invited members</p>
            <p v-if="!_event.event_invitees.length" class="italic">No assignees</p>
            <div v-else class="space-y-2">
              <div v-for="user in _event.event_invitees" :key="user.id" class="flex space-x-2 items-center">
                <user-avatar size="h-10 w-10" :avatar="user.avatar"></user-avatar>
                <span class="font-medium">
                  {{ user.name ?? '(No name)' }} {{ user.id === auth.userId ? `(you)` : '' }}
                </span>
                <span>/</span>
                <span class="flex items-center space-x-1 text-slate-600">
                  <Mail :size="16" /> <span>{{ user.email }}</span>
                </span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </layout-container>
</template>
<script lang="ts" setup>
import UserAvatar from '@/components/user/avatar.vue'
import { eventStatusColors, eventTypes, type EventStatus, type EventTypes } from '@/data/event-data';
import { useAuthStore } from '@/stores/auth';
import { EventLoading, useEventStore, type ProjectEvent } from '@/stores/event';
import { parseDate } from '@/utils/parseDate';
import { ArrowLeft, CalendarArrowUp, CalendarCheck, CalendarX, Clock9, Link, Mail, MapPin } from 'lucide-vue-next';
import moment from 'moment';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const id = computed(() => route.params.id as string)
const eventStore = useEventStore()
const _event = ref<ProjectEvent>()
const auth = useAuthStore()

const loading = computed(() => ({
  getting: eventStore.isLoading(EventLoading.GETTING_ONE),
  cancelling: eventStore.isLoading(EventLoading.CANCELLING)
}))

const isCancelled = computed(() => _event.value && _event.value.cancelled_at !== null)
const isPast = computed(() => _event.value && moment(_event.value.datetime).isBefore(moment()))
const duration = computed(() =>
  _event.value && _event.value.duration_hours ?
    _event.value.duration_hours < 1 ? `${_event.value.duration_hours * 60} minutes` : `${_event.value.duration_hours}hours` :
    ''
)

const getEvent = async () => {
  const data = await eventStore.getEvent(id.value)
  if (data) {
    _event.value = data
  }
}

const cancelEvent = async () => {
  const cancelData = await eventStore.cancelEvent(id.value)
  if (cancelData && _event.value) {
    // todo: update cancel for that one event.
    _event.value = { ..._event.value, ...cancelData }
  }
}

onMounted(() => {
  getEvent()
})

</script>
