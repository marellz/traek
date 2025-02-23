import LayoutContainer from '@/components/layout/container.vue'
import LayoutCard from '@/components/layout/card.vue'
import LayoutBanner from '@/components/layout/banner.vue'
import LayoutBannerTitle from '@/components/layout/banner-title.vue'
import BaseLoader from '@/components/base/loader.vue'
import BaseButton from '@/components/base/button.vue'
import BaseAlert from '@/components/base/alert.vue'
import BaseModal from '@/components/base/modal.vue'
import BaseTabs from '@/components/base/tabs.vue'
import { type Component } from 'vue'
const components: Record<string, Component> = {
  'layout-banner': LayoutBanner,
  'layout-banner-title': LayoutBannerTitle,
  'layout-card': LayoutCard,
  'layout-container': LayoutContainer,
  'base-alert': BaseAlert,
  'base-button': BaseButton,
  'base-loader': BaseLoader,
  'base-modal': BaseModal,
  'base-tabs': BaseTabs,
}

export default components
