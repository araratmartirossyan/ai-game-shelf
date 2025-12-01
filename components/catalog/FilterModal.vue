<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
    @click="$emit('close')"
  >
    <div
      class="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background shadow-xl overflow-y-auto"
      @click.stop
    >
      <div
        class="sticky top-0 bg-background border-b px-4 py-4 flex items-center justify-between z-10"
      >
        <h2 class="text-xl font-semibold">Filters</h2>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <div class="p-4 space-y-6">
        <div class="flex justify-end">
          <button
            @click="$emit('reset')"
            class="text-sm text-muted-foreground hover:text-foreground"
          >
            Reset
          </button>
        </div>

        <slot />
      </div>

      <div class="sticky bottom-0 bg-background border-t p-4">
        <button
          @click="$emit('apply')"
          class="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Apply filters
          <span v-if="activeCount > 0">({{ activeCount }})</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from "lucide-vue-next";

defineProps<{
  show: boolean;
  activeCount: number;
}>();

defineEmits<{
  close: [];
  apply: [];
  reset: [];
}>();
</script>
