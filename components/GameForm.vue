<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-2">Title *</label>
      <input
        :value="modelValue.title"
        type="text"
        class="w-full px-4 py-2 border border-input rounded-lg bg-background"
        placeholder="Game Title"
        required
        @input="updateTitle"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">Description</label>
      <textarea
        :value="modelValue.description"
        rows="4"
        class="w-full px-4 py-2 border border-input rounded-lg bg-background"
        placeholder="Game description"
        @input="updateDescription"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">Category</label>
      <input
        :value="modelValue.category"
        type="text"
        class="w-full px-4 py-2 border border-input rounded-lg bg-background"
        placeholder="e.g., Board Game, Card Game, Strategy"
        @input="updateCategory"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">Genre</label>
      <input
        :value="modelValue.genre"
        type="text"
        class="w-full px-4 py-2 border border-input rounded-lg bg-background"
        placeholder="e.g., Action, RPG, Strategy, Puzzle"
        @input="updateGenre"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">Platform</label>
      <select
        :value="modelValue.platform"
        class="w-full px-4 py-2 border border-input rounded-lg bg-background"
        @change="updatePlatform"
      >
        <option value="">Select Platform</option>
        <option
          v-for="platform in PLATFORM_OPTIONS"
          :key="platform.value"
          :value="platform.value"
        >
          {{ platform.label }}
        </option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">Year</label>
      <input
        :value="modelValue.year"
        type="number"
        min="1900"
        :max="new Date().getFullYear() + 1"
        class="w-full px-4 py-2 border border-input rounded-lg bg-background"
        placeholder="e.g., 2023"
        @input="updateYear"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">Image URL</label>
      <input
        :value="modelValue.image_url"
        type="url"
        class="w-full px-4 py-2 border border-input rounded-lg bg-background"
        placeholder="https://example.com/image.jpg"
        @input="updateImageUrl"
      />
      <div v-if="modelValue.image_url" class="mt-2">
        <img
          :src="modelValue.image_url"
          :alt="modelValue.title"
          class="max-w-full h-auto max-h-48 rounded-lg"
        />
      </div>
    </div>

    <div class="flex gap-4 pt-4">
      <button
        @click="$emit('save')"
        :disabled="saving || !modelValue.title"
        class="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ saving ? "Saving..." : "Save Game" }}
      </button>
      <button
        v-if="showReset"
        @click="$emit('reset')"
        class="px-6 py-3 border border-input rounded-lg hover:bg-accent transition-colors"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PLATFORM_OPTIONS } from "~/constants/platforms";

interface GameFormData {
  title: string;
  description: string;
  category: string;
  genre: string;
  platform: string;
  year: number | null;
  image_url: string;
}

const props = defineProps<{
  modelValue: GameFormData;
  saving?: boolean;
  showReset?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: GameFormData];
  save: [];
  reset: [];
}>();

const updateField = (field: keyof GameFormData, value: any) => {
  emit("update:modelValue", {
    ...props.modelValue,
    [field]: value,
  });
};

const updateTitle = (e: Event) =>
  updateField("title", (e.target as HTMLInputElement).value);
const updateDescription = (e: Event) =>
  updateField("description", (e.target as HTMLTextAreaElement).value);
const updateCategory = (e: Event) =>
  updateField("category", (e.target as HTMLInputElement).value);
const updateGenre = (e: Event) =>
  updateField("genre", (e.target as HTMLInputElement).value);
const updatePlatform = (e: Event) =>
  updateField("platform", (e.target as HTMLSelectElement).value);
const updateYear = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  updateField("year", value ? parseInt(value) : null);
};
const updateImageUrl = (e: Event) =>
  updateField("image_url", (e.target as HTMLInputElement).value);
</script>
