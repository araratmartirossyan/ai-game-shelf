<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-2">GameShelf</h1>
        <p class="text-muted-foreground">Your personal game catalog</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 mb-8">
        <NuxtLink
          to="/scan"
          class="flex-1 bg-primary text-primary-foreground px-6 py-4 rounded-lg font-medium text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <Camera class="w-5 h-5" />
          Scan New Game
        </NuxtLink>
        <NuxtLink
          to="/catalog"
          class="flex-1 bg-secondary text-secondary-foreground px-6 py-4 rounded-lg font-medium text-center hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
        >
          <BookOpen class="w-5 h-5" />
          View Catalog
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-card p-6 rounded-lg border">
          <h2 class="text-xl font-semibold mb-2">Quick Stats</h2>
          <p class="text-muted-foreground">
            Total Games:
            <span class="font-semibold text-foreground">{{
              gamesStore.games.length
            }}</span>
          </p>
        </div>
        <div class="bg-card p-6 rounded-lg border">
          <h2 class="text-xl font-semibold mb-2">Recent Activity</h2>
          <p class="text-muted-foreground text-sm">
            Start scanning games to see your collection grow!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Camera, BookOpen } from "lucide-vue-next";

const gamesStore = useGamesStore();

onMounted(() => {
  gamesStore.fetchGames();
});
</script>
