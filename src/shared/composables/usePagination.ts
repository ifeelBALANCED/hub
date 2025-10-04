import { computed, type ComputedRef, type Ref } from 'vue'
import { useOffsetPagination } from '@vueuse/core'

type UsePaginationOptions = {
  total: ComputedRef<number>
  pageSize: Ref<number>
}

export const usePagination = (options: UsePaginationOptions) => {
  const { total, pageSize } = options

  const pagination = useOffsetPagination({
    total,
    page: 1,
    pageSize,
  })

  const page = pagination.currentPage
  const pageCount = computed(() => pagination.pageCount.value || 1)
  const start = computed(() => (page.value - 1) * pageSize.value)
  const end = computed(() => start.value + pageSize.value)

  const setPage = (p: number) => (pagination.currentPage.value = p)
  const next = () => (pagination.currentPage.value = Math.min(pageCount.value, page.value + 1))
  const prev = () => (pagination.currentPage.value = Math.max(1, page.value - 1))

  return {
    page,
    pageCount,
    start,
    end,
    setPage,
    next,
    prev,
  }
}
