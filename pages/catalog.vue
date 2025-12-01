<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header
      class="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
    >
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <NuxtLink
              to="/"
              class="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <Menu class="w-6 h-6" />
            </NuxtLink>
            <h1 class="text-xl font-semibold">
              Games ({{ filteredGames.length }})
            </h1>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="showSearch = !showSearch"
              class="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <Search class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Search Bar (Conditional) -->
    <div v-if="showSearch" class="border-b bg-background">
      <div class="container mx-auto px-4 py-3">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search games..."
            class="w-full px-4 py-2 pl-10 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            @blur="if (!searchQuery) showSearch = false;"
          />
          <Search
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
          />
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="border-b bg-background">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between gap-4">
          <button
            @click="showFilters = true"
            class="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <Filter class="w-5 h-5" />
            <span>Filters</span>
            <span
              v-if="activeFilterCount > 0"
              class="px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full"
            >
              {{ activeFilterCount }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-4">
      <!-- Loading State -->
      <div v-if="gamesStore.loading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"
        ></div>
        <p class="text-muted-foreground">Loading games...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="gamesStore.error"
        class="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6"
      >
        <p class="text-destructive">{{ gamesStore.error }}</p>
      </div>

      <!-- Games List -->
      <div v-else-if="filteredGames.length > 0" class="space-y-3">
        <CatalogGameCard
          v-for="game in filteredGames"
          :key="game.id"
          :game="game"
          @edit="editGame"
          @delete="deleteGame"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="flex justify-center mb-4">
          <BookOpen class="w-16 h-16 text-muted-foreground" />
        </div>
        <h2 class="text-2xl font-semibold mb-2">
          {{
            searchQuery || activeFilterCount > 0
              ? "No games found"
              : "No games yet"
          }}
        </h2>
        <p class="text-muted-foreground mb-6">
          {{
            searchQuery || activeFilterCount > 0
              ? "Try adjusting your filters or search"
              : "Start by scanning your first game!"
          }}
        </p>
        <NuxtLink
          v-if="!searchQuery && activeFilterCount === 0"
          to="/scan"
          class="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Scan Your First Game
        </NuxtLink>
      </div>
    </main>

    <CatalogFilterModal
      :show="showFilters"
      :active-count="activeFilterCount"
      @close="showFilters = false"
      @apply="applyFilters"
      @reset="resetFilters"
    >
      <CatalogFilterSection
        label="CATEGORY"
        :items="availableCategories"
        :selected="selectedCategories"
        @toggle="toggleCategory"
      />
      <CatalogFilterSection
        label="GENRE"
        :items="availableGenres"
        :selected="selectedGenres"
        @toggle="toggleGenre"
      />
      <CatalogFilterSection
        label="PLATFORM"
        :items="availablePlatforms"
        :selected="selectedPlatforms"
        @toggle="togglePlatform"
      />
      <div>
        <label class="block text-sm font-medium mb-3">YEAR</label>
        <input
          v-model.number="selectedYear"
          type="number"
          :min="yearRange.min"
          :max="yearRange.max"
          class="w-full px-4 py-2 border border-input rounded-lg bg-background"
          placeholder="Filter by year (e.g., 2023)"
        />
      </div>
    </CatalogFilterModal>
  </div>
</template>

<script setup lang="ts">
import { BookOpen, Menu, Search, Filter } from "lucide-vue-next";

const gamesStore = useGamesStore();
const searchQuery = ref("");
const showSearch = ref(false);
const showFilters = ref(false);
const selectedCategories = ref<string[]>([]);
const appliedCategories = ref<string[]>([]);
const selectedGenres = ref<string[]>([]);
const appliedGenres = ref<string[]>([]);
const selectedPlatforms = ref<string[]>([]);
const appliedPlatforms = ref<string[]>([]);
const selectedYear = ref<number | null>(null);
const appliedYear = ref<number | null>(null);

// Get all unique categories from games
const availableCategories = computed(() => {
  const categories = new Set<string>();
  gamesStore.games.forEach((game) => {
    if (game.category) {
      categories.add(game.category);
    }
  });
  return Array.from(categories).sort();
});

// Get all unique genres from games
const availableGenres = computed(() => {
  const genres = new Set<string>();
  gamesStore.games.forEach((game) => {
    if (game.genre) {
      genres.add(game.genre);
    }
  });
  return Array.from(genres).sort();
});

// Get all unique platforms from games
const availablePlatforms = computed(() => {
  const platforms = new Set<string>();
  gamesStore.games.forEach((game) => {
    if (game.platform) {
      platforms.add(game.platform);
    }
  });
  return Array.from(platforms).sort();
});

// Get year range from games
const yearRange = computed(() => {
  const years = gamesStore.games
    .map((game) => game.year)
    .filter((year): year is number => year !== null && year !== undefined);
  if (years.length === 0) return { min: 1900, max: new Date().getFullYear() };
  return {
    min: Math.min(...years),
    max: Math.max(...years),
  };
});

// Active filter count
const activeFilterCount = computed(() => {
  return (
    appliedCategories.value.length +
    appliedGenres.value.length +
    appliedPlatforms.value.length +
    (appliedYear.value ? 1 : 0)
  );
});

// Filtered games based on search and all filters
const filteredGames = computed(() => {
  let games = gamesStore.sortedGames;

  // Apply category filter
  if (appliedCategories.value.length > 0) {
    games = games.filter((game) => {
      if (!game.category) return false;
      return appliedCategories.value.includes(game.category);
    });
  }

  // Apply genre filter
  if (appliedGenres.value.length > 0) {
    games = games.filter((game) => {
      if (!game.genre) return false;
      return appliedGenres.value.includes(game.genre);
    });
  }

  // Apply platform filter
  if (appliedPlatforms.value.length > 0) {
    games = games.filter((game) => {
      if (!game.platform) return false;
      return appliedPlatforms.value.includes(game.platform);
    });
  }

  // Apply year filter
  if (appliedYear.value) {
    games = games.filter((game) => {
      return game.year === appliedYear.value;
    });
  }

  // Apply search filter
  if (searchQuery.value.trim()) {
    const searchResults = gamesStore.searchGames(searchQuery.value);
    // Filter search results by applied filters
    games = searchResults.filter((game) => {
      if (appliedCategories.value.length > 0) {
        if (
          !game.category ||
          !appliedCategories.value.includes(game.category)
        ) {
          return false;
        }
      }
      if (appliedGenres.value.length > 0) {
        if (!game.genre || !appliedGenres.value.includes(game.genre)) {
          return false;
        }
      }
      if (appliedPlatforms.value.length > 0) {
        if (!game.platform || !appliedPlatforms.value.includes(game.platform)) {
          return false;
        }
      }
      if (appliedYear.value && game.year !== appliedYear.value) {
        return false;
      }
      return true;
    });
  }

  return games;
});

const toggleCategory = (category: string) => {
  const index = selectedCategories.value.indexOf(category);
  if (index > -1) {
    selectedCategories.value.splice(index, 1);
  } else {
    selectedCategories.value.push(category);
  }
};

const toggleGenre = (genre: string) => {
  const index = selectedGenres.value.indexOf(genre);
  if (index > -1) {
    selectedGenres.value.splice(index, 1);
  } else {
    selectedGenres.value.push(genre);
  }
};

const togglePlatform = (platform: string) => {
  const index = selectedPlatforms.value.indexOf(platform);
  if (index > -1) {
    selectedPlatforms.value.splice(index, 1);
  } else {
    selectedPlatforms.value.push(platform);
  }
};

const applyFilters = () => {
  appliedCategories.value = [...selectedCategories.value];
  appliedGenres.value = [...selectedGenres.value];
  appliedPlatforms.value = [...selectedPlatforms.value];
  appliedYear.value = selectedYear.value;
  showFilters.value = false;
};

const resetFilters = () => {
  selectedCategories.value = [];
  appliedCategories.value = [];
  selectedGenres.value = [];
  appliedGenres.value = [];
  selectedPlatforms.value = [];
  appliedPlatforms.value = [];
  selectedYear.value = null;
  appliedYear.value = null;
  searchQuery.value = "";
};

const editGame = (game: any) => {
  navigateTo(`/edit/${game.id}`);
};

const deleteGame = async (id: string) => {
  if (confirm("Are you sure you want to delete this game?")) {
    try {
      await gamesStore.deleteGame(id);
    } catch (error) {
      console.error("Error deleting game:", error);
    }
  }
};

onMounted(() => {
  gamesStore.fetchGames();
});
</script>
