<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8 max-w-2xl">
      <div class="mb-6">
        <NuxtLink
          to="/catalog"
          class="text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
        >
          ← Back to Catalog
        </NuxtLink>
      </div>

      <h1 class="text-3xl font-bold mb-8">Edit Game</h1>

      <div v-if="loading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"
        ></div>
        <p class="text-muted-foreground">Loading game...</p>
      </div>

      <div v-else-if="game" class="bg-card p-6 rounded-lg border">
        <h2 class="text-xl font-semibold mb-4">Game Information</h2>
        <GameForm
          v-model="formData"
          :saving="saving"
          :show-reset="false"
          @save="updateGame"
        />
        <div class="flex gap-4 pt-4">
          <button
            @click="navigateTo('/catalog')"
            class="px-6 py-3 border border-input rounded-lg hover:bg-accent transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      <div
        v-else
        class="bg-destructive/10 border border-destructive/20 rounded-lg p-4"
      >
        <p class="text-destructive">Game not found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const gamesStore = useGamesStore();
const loading = ref(true);
const saving = ref(false);
const game = ref<any>(null);

const formData = ref({
  title: "",
  description: "",
  category: "",
  genre: "",
  platform: "",
  year: null as number | null,
  image_url: "",
});

onMounted(async () => {
  await gamesStore.fetchGames();
  const foundGame = gamesStore.games.find((g) => g.id === route.params.id);
  if (foundGame) {
    game.value = foundGame;
    formData.value = {
      title: foundGame.title,
      description: foundGame.description || "",
      category: foundGame.category || "",
      genre: foundGame.genre || "",
      platform: foundGame.platform || "",
      year: foundGame.year || null,
      image_url: foundGame.image_url || "",
    };
  }
  loading.value = false;
});

const updateGame = async () => {
  if (!formData.value.title || !game.value) return;

  saving.value = true;
  try {
    await gamesStore.updateGame(game.value.id, {
      title: formData.value.title,
      description: formData.value.description || undefined,
      category: formData.value.category || undefined,
      genre: formData.value.genre || undefined,
      platform: formData.value.platform || undefined,
      year: formData.value.year || undefined,
      image_url: formData.value.image_url || undefined,
    });
    await navigateTo("/catalog");
  } catch (error: any) {
    console.error("Error updating game:", error);
    alert("Failed to update game: " + (error.message || "Unknown error"));
  } finally {
    saving.value = false;
  }
};
</script>
