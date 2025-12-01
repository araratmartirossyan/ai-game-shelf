<template>
  <div class="bg-card rounded-lg border p-4 hover:shadow-md transition-shadow">
    <div class="flex gap-4">
      <div class="flex-shrink-0">
        <div
          v-if="game.image_url"
          class="w-16 h-16 rounded-lg overflow-hidden bg-muted"
        >
          <img
            :src="game.image_url"
            :alt="game.title"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
        </div>
        <div
          v-else
          class="w-16 h-16 rounded-lg bg-muted flex items-center justify-center"
        >
          <Gamepad2 class="w-8 h-8 text-muted-foreground" />
        </div>
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h3 class="font-semibold text-lg line-clamp-1">
            {{ game.title }}
          </h3>
          <div class="flex items-center gap-2 flex-shrink-0">
            <button
              @click="$emit('edit', game)"
              class="p-1.5 hover:bg-accent rounded transition-colors"
              title="Edit"
            >
              <Pencil class="w-4 h-4" />
            </button>
            <button
              @click="$emit('delete', game.id)"
              class="p-1.5 hover:bg-destructive/10 text-destructive rounded transition-colors"
              title="Delete"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div v-if="game.category" class="mb-2">
          <span
            class="inline-block px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded"
          >
            #{{ game.category.toLowerCase().replace(/\s+/g, "") }}
          </span>
        </div>

        <p
          v-if="game.description"
          class="text-sm text-muted-foreground line-clamp-2 mb-2"
        >
          {{ game.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Gamepad2, Pencil, Trash2 } from "lucide-vue-next";
import type { Game } from "~/types/game";

defineProps<{
  game: Game;
}>();

defineEmits<{
  edit: [game: Game];
  delete: [id: string];
}>();

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.style.display = "none";
};
</script>
