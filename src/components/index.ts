import LayoutContainer from '@/components/layout/container.vue'
import LayoutCard from '@/components/layout/card.vue'
import LayoutBanner from '@/components/layout/banner.vue'
import LayoutBannerTitle from '@/components/layout/banner-title.vue'
import BaseLoader from '@/components/base/loader.vue'
import BaseButton from '@/components/base/button.vue'
import BaseAction from '@/components/base/action.vue'
import BaseAlert from '@/components/base/alert.vue'
import BaseModal from '@/components/base/modal.vue'
import BaseTabs from '@/components/base/tabs.vue'
import BaseConfirm from '@/components/base/confirm.vue'
import BaseTag from '@/components/base/tag.vue'
import BaseLink from '@/components/base/link.vue'
import BaseDropdown from '@/components/base/dropdown.vue'
import BaseDropdownItem from '@/components/base/dropdown-item.vue'
import BasePopover from '@/components/base/popover.vue'

import { type Component } from 'vue'
const components: Record<string, Component> = {
  'layout-banner': LayoutBanner,
  'layout-banner-title': LayoutBannerTitle,
  'layout-card': LayoutCard,
  'layout-container': LayoutContainer,
  'base-alert': BaseAlert,
  'base-button': BaseButton,
  'base-action': BaseAction,
  'base-loader': BaseLoader,
  'base-modal': BaseModal,
  'base-tabs': BaseTabs,
  'base-tag': BaseTag,
  'base-link': BaseLink,
  'base-confirm': BaseConfirm,
  'base-popover': BasePopover,
  'dropdown': BaseDropdown,
  'dropdown-item' : BaseDropdownItem
}

export default components
