<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8 max-w-2xl">
      <div class="mb-6">
        <NuxtLink
          to="/"
          class="text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
        >
          ← Back to Home
        </NuxtLink>
      </div>

      <h1 class="text-3xl font-bold mb-8">Add New Game</h1>

      <!-- Tabs -->
      <div class="mb-6 flex gap-2 border-b">
        <button
          @click="activeTab = 'scan'"
          :class="[
            'px-4 py-2 font-medium transition-colors',
            activeTab === 'scan'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground',
          ]"
        >
          <Camera class="w-4 h-4 inline-block mr-2" />
          Scan Photo
        </button>
        <button
          @click="activeTab = 'search'"
          :class="[
            'px-4 py-2 font-medium transition-colors',
            activeTab === 'search'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground',
          ]"
        >
          <Search class="w-4 h-4 inline-block mr-2" />
          Search
        </button>
      </div>

      <div class="bg-card p-6 rounded-lg border space-y-6">
        <!-- Scan Tab -->
        <div v-if="activeTab === 'scan'">
          <ImageUpload
            ref="imageUploadRef"
            @file-selected="handleFileSelected"
            @file-removed="handleFileRemoved"
          />
        </div>

        <!-- Search Tab -->
        <div v-if="activeTab === 'search'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Search Game</label>
            <div class="flex gap-2">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Enter game name (e.g., Mario, Uncharted)"
                class="flex-1 px-4 py-2 border border-input rounded-lg bg-background"
                @keyup.enter="searchGame"
              />
              <button
                @click="searchGame"
                :disabled="searching || !searchQuery.trim()"
                class="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ searching ? "Searching..." : "Search" }}
              </button>
            </div>
          </div>

          <!-- Search Results -->
          <div v-if="searchResults.length > 0" class="space-y-2">
            <p class="text-sm text-muted-foreground">
              Found {{ searchResults.length }} result(s). Click to select:
            </p>
            <div
              v-for="game in searchResults"
              :key="game.id"
              @click="selectSearchResult(game)"
              class="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
            >
              <div class="flex gap-3">
                <div
                  v-if="game.background_image"
                  class="w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-muted"
                >
                  <img
                    :src="game.background_image"
                    :alt="game.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold line-clamp-1">{{ game.name }}</h3>
                  <p class="text-sm text-muted-foreground">
                    <span v-if="game.released">
                      {{ new Date(game.released).getFullYear() }}
                    </span>
                    <span v-if="game.platforms?.length > 0" class="ml-1">
                      • {{ game.platforms[0].platform.name }}
                    </span>
                    <span v-if="game.genres?.length > 0" class="ml-1">
                      • {{ game.genres.map((g: any) => g.name).join(", ") }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recognition Status -->
        <div v-if="recognizing" class="text-center py-8">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"
          ></div>
          <p class="text-muted-foreground">Analyzing game image...</p>
        </div>

        <!-- Recognition Error -->
        <div
          v-if="recognitionError && !recognizing"
          class="bg-destructive/10 border border-destructive/20 rounded-lg p-4"
        >
          <p class="text-destructive text-sm">{{ recognitionError }}</p>
          <button
            @click="recognizeGame"
            class="mt-2 text-sm text-primary hover:underline"
          >
            Try again
          </button>
        </div>

        <GameForm
          v-if="recognitionResult"
          v-model="formData"
          @save="saveGame"
          @reset="resetForm"
          :saving="saving"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Camera, Search } from "lucide-vue-next";
import { RawgService } from "~/services/rawgService";

const imageUploadRef = ref();
const activeTab = ref<"scan" | "search">("scan");
const selectedFile = ref<File | null>(null);
const recognizing = ref(false);
const recognitionResult = ref<any>(null);
const recognitionError = ref<string | null>(null);
const saving = ref(false);
const searchQuery = ref("");
const searching = ref(false);
const searchResults = ref<any[]>([]);

const formData = ref({
  title: "",
  description: "",
  category: "",
  genre: "",
  platform: "",
  year: null as number | null,
  image_url: "",
});

const gamesStore = useGamesStore();
const { recognizeGame: recognizeGameAI, searchGame: searchGameAPI } =
  useGameRecognition();

const handleFileSelected = async (file: File) => {
  selectedFile.value = file;
  recognitionError.value = null;
  recognitionResult.value = null;

  // Auto-start recognition when file is selected
  await recognizeGame();
};

const handleFileRemoved = () => {
  selectedFile.value = null;
  recognitionError.value = null;
  recognitionResult.value = null;
};

const recognizeGame = async () => {
  if (!selectedFile.value) return;

  recognizing.value = true;
  recognitionError.value = null;

  try {
    const result = await recognizeGameAI(selectedFile.value);
    recognitionResult.value = result;

    formData.value = {
      title: result.title || "",
      description: result.description || "",
      category: result.category || "",
      genre: result.genre || "",
      platform: result.platform || "",
      year: result.year ? parseInt(result.year) : null,
      image_url: result.image_url || "",
    };
  } catch (error: any) {
    recognitionError.value =
      error.message ||
      "Failed to recognize game. Please try again or enter information manually.";
    console.error("Recognition error:", error);
  } finally {
    recognizing.value = false;
  }
};

const saveGame = async () => {
  if (!formData.value.title) return;

  saving.value = true;
  try {
    await gamesStore.addGame({
      title: formData.value.title,
      description: formData.value.description || undefined,
      category: formData.value.category || undefined,
      genre: formData.value.genre || undefined,
      platform: formData.value.platform || undefined,
      year: formData.value.year || undefined,
      image_url: formData.value.image_url || undefined,
    });

    resetForm();
    await navigateTo("/catalog");
  } catch (error: any) {
    recognitionError.value = error.message || "Failed to save game";
    console.error("Save error:", error);
  } finally {
    saving.value = false;
  }
};

const searchGame = async () => {
  if (!searchQuery.value.trim()) return;

  searching.value = true;
  recognitionError.value = null;
  searchResults.value = [];

  try {
    const results = await searchGameAPI(searchQuery.value);

    // Check if results is an array (multiple results) or single object
    if (Array.isArray(results)) {
      if (results.length === 0) {
        recognitionError.value = "No games found";
      } else if (results.length === 1) {
        // Single result - use it directly
        const mapped = RawgService.mapRawgToGameRecognition(results[0]);
        recognitionResult.value = mapped;
        formData.value = {
          title: mapped.title || "",
          description: mapped.description || "",
          category: mapped.category || "",
          genre: mapped.genre || "",
          platform: mapped.platform || "",
          year: mapped.year || null,
          image_url: mapped.image_url || "",
        };
        activeTab.value = "scan"; // Switch to scan tab to show form
      } else {
        // Multiple results - show selection
        searchResults.value = results;
      }
    } else {
      // Single result object
      recognitionResult.value = results;
      formData.value = {
        title: results.title || "",
        description: results.description || "",
        category: results.category || "",
        genre: results.genre || "",
        platform: results.platform || "",
        year: results.year ? parseInt(results.year.toString()) : null,
        image_url: results.image_url || "",
      };
      activeTab.value = "scan"; // Switch to scan tab to show form
    }
  } catch (error: any) {
    recognitionError.value =
      error.message || "Failed to search game. Please try again.";
    console.error("Search error:", error);
  } finally {
    searching.value = false;
  }
};

const selectSearchResult = (game: any) => {
  const mapped = RawgService.mapRawgToGameRecognition(game);
  recognitionResult.value = mapped;
  formData.value = {
    title: mapped.title || "",
    description: mapped.description || "",
    category: mapped.category || "",
    genre: mapped.genre || "",
    platform: mapped.platform || "",
    year: mapped.year || null,
    image_url: mapped.image_url || "",
  };
  activeTab.value = "scan"; // Switch to scan tab to show form
  searchResults.value = [];
  searchQuery.value = "";
};

const resetForm = () => {
  imageUploadRef.value?.removeImage();
  selectedFile.value = null;
  recognitionResult.value = null;
  recognitionError.value = null;
  searchResults.value = [];
  searchQuery.value = "";
  formData.value = {
    title: "",
    description: "",
    category: "",
    genre: "",
    platform: "",
    year: null,
    image_url: "",
  };
};
</script>
