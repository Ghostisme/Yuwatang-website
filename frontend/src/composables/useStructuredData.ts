import { computed, type MaybeRefOrGetter, toValue } from "vue"
import { useI18n } from "vue-i18n"
import { useJsonLd } from "@/composables/useJsonLd"
import type { StoreInfo } from "@/config/stores"
import type { ServiceInfo } from "@/config/services"
import {
  buildAllLocalBusinesses,
  buildBreadcrumb,
  buildLocalBusiness,
  buildOrganization,
  buildService,
  type Crumb
} from "@/config/siteSchema"

/** 需求2-6：全站 Organization */
export function useOrganizationJsonLd() {
  useJsonLd("organization", computed(() => buildOrganization()))
}

/** 单店 LocalBusiness */
export function useLocalBusinessJsonLd(getStore: MaybeRefOrGetter<StoreInfo | null | undefined>) {
  useJsonLd(
    "local-business",
    computed(() => {
      const store = toValue(getStore)
      if (!store) return null
      return buildLocalBusiness(store, store.name, `${store.tagline} ${store.address}`)
    })
  )
}

/** 门店总览：一次输出多店 LocalBusiness @graph */
export function useStoresGraphJsonLd(getStores: MaybeRefOrGetter<StoreInfo[]>) {
  useJsonLd(
    "local-business-graph",
    computed(() => {
      const list = toValue(getStores) || []
      if (!list.length) return null
      return buildAllLocalBusinesses(list, (store) => ({
        name: store.name,
        description: `${store.tagline} ${store.address}`
      }))
    })
  )
}

/** 服务项目 Service */
export function useServiceJsonLd(getService: MaybeRefOrGetter<ServiceInfo | null | undefined>) {
  const { t } = useI18n()
  useJsonLd(
    "service",
    computed(() => {
      const service = toValue(getService)
      if (!service) return null
      return buildService(service, t(service.nameKey), t(service.summaryKey))
    })
  )
}

/** BreadcrumbList */
export function useBreadcrumbJsonLd(getCrumbs: MaybeRefOrGetter<Crumb[]>) {
  useJsonLd(
    "breadcrumb",
    computed(() => {
      const crumbs = toValue(getCrumbs) || []
      if (crumbs.length < 2) return null
      return buildBreadcrumb(crumbs)
    })
  )
}
