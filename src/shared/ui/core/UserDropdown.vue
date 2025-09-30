<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'reka-ui'
import { LogOut, User, Settings, Crown } from 'lucide-vue-next'
import { useAuthSession, useLogout } from '@/shared/composables/useAuth'

const authSession = useAuthSession()
const logoutMutation = useLogout()

const handleLogout = () => {
  logoutMutation.mutate()
}

const handleProfile = () => {
  // TODO: Implement profile navigation
  // router.push('/profile')
}

const handleSettings = () => {
  // TODO: Implement settings navigation
  // router.push('/settings')
}
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <button
        class="group flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-all duration-200 focus:outline-none border border-transparent hover:border-border/50"
        :disabled="authSession.isAuthenticating.value || logoutMutation.isPending.value"
      >
        <div class="flex items-center space-x-3">
          <div class="relative">
            <div
              class="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg ring-2 ring-primary/20"
            >
              <span class="text-primary-foreground font-bold text-base">
                {{ authSession.userDisplayName?.charAt(0)?.toUpperCase() ?? 'U' }}
              </span>
            </div>
          </div>
          <div class="hidden md:block text-left">
            <div class="text-sm font-semibold text-foreground leading-tight">
              {{ authSession.userDisplayName }}
            </div>
            <div class="text-xs text-muted-foreground mt-0.5">{{ authSession.userEmail }}</div>
          </div>
        </div>
        <svg
          class="h-5 w-5 text-foreground/70 transition-transform duration-200 group-data-[state=open]:rotate-180 ml-auto shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="m19 9-7 7-7-7"
          />
        </svg>
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      class="w-72 bg-popover/95 backdrop-blur-sm border border-border/50 rounded-xl shadow-xl z-50 p-2"
      align="end"
      :side-offset="12"
    >
      <div class="space-y-1">
        <DropdownMenuItem
          class="flex items-center space-x-3 px-3 py-3 text-sm text-popover-foreground hover:bg-muted/80 transition-colors cursor-pointer rounded-lg"
          @click="handleProfile"
        >
          <User class="h-4 w-4 text-muted-foreground" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          class="flex items-center space-x-3 px-3 py-3 text-sm text-popover-foreground hover:bg-muted/80 transition-colors cursor-pointer rounded-lg"
          @click="handleSettings"
        >
          <Settings class="h-4 w-4 text-muted-foreground" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator class="my-2 bg-border/50" />

        <DropdownMenuItem
          class="flex items-center space-x-3 px-3 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer rounded-lg"
          @click="handleLogout"
        >
          <LogOut class="h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </div>
    </DropdownMenuContent>
  </DropdownMenuRoot>
</template>

<style scoped></style>
