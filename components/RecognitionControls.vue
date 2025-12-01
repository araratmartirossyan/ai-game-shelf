<template>
  <div>
    <button
      v-if="!recognizing && !recognitionError"
      @click="$emit('recognize')"
      class="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      <Sparkles class="w-5 h-5" />
      Recognize Game
    </button>

    <div v-if="recognizing" class="text-center py-8">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"
      ></div>
      <p class="text-muted-foreground">Analyzing game image...</p>
    </div>

    <div
      v-if="recognitionError"
      class="bg-destructive/10 border border-destructive/20 rounded-lg p-4"
    >
      <p class="text-destructive text-sm">{{ recognitionError }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Sparkles } from "lucide-vue-next";

defineProps<{
  recognizing: boolean;
  recognitionError: string | null;
}>();

defineEmits<{
  recognize: [];
}>();
</script>

