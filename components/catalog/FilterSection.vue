<template>
  <div>
    <label class="block text-sm font-medium mb-3">
      {{ label }}
      <span v-if="selectedCount > 0" class="text-muted-foreground">
        ({{ selectedCount }})
      </span>
    </label>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="item in items"
        :key="item"
        @click="$emit('toggle', item)"
        :class="[
          'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
          selected.includes(item)
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ]"
      >
        <span v-if="selected.includes(item)" class="mr-1.5">×</span>
        {{ item }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  items: string[];
  selected: string[];
}>();

defineEmits<{
  toggle: [item: string];
}>();

const selectedCount = computed(() => props.selected.length);
</script>
