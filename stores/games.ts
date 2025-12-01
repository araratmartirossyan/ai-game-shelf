import { defineStore } from "pinia";
import Fuse from "fuse.js";
import type { Game } from "~/types/game";
import { GameService } from "~/services/gameService";
import { SEARCH_CONFIG } from "~/constants/search";

export const useGamesStore = defineStore("games", {
  state: () => ({
    games: [] as Game[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    sortedGames: (state) => {
      return [...state.games].sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
      );
    },

    gamesByCategory: (state) => {
      const grouped: Record<string, Game[]> = {};
      state.games.forEach((game) => {
        const category = game.category || "Uncategorized";
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(game);
      });
      return grouped;
    },

    searchGames: (state) => (query: string) => {
      if (!query.trim()) return state.games;

      const fuse = new Fuse(state.games, SEARCH_CONFIG);

      const results = fuse.search(query);
      return results.map((result) => result.item);
    },
  },

  actions: {
    async fetchGames() {
      this.loading = true;
      this.error = null;

      try {
        const games = await GameService.fetchAll();
        this.games = games;
      } catch (error: any) {
        this.error = error.message;
        console.error("Error fetching games:", error);
      } finally {
        this.loading = false;
      }
    },

    async addGame(game: Omit<Game, "id" | "created_at" | "updated_at">) {
      this.loading = true;
      this.error = null;

      try {
        const newGame = await GameService.create(game);
        this.games.push(newGame);
        return newGame;
      } catch (error: any) {
        this.error = error.message;
        console.error("Error adding game:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateGame(id: string, updates: Partial<Game>) {
      this.loading = true;
      this.error = null;

      try {
        const updatedGame = await GameService.update(id, updates);
        const index = this.games.findIndex((g) => g.id === id);
        if (index !== -1) {
          this.games[index] = updatedGame;
        }
        return updatedGame;
      } catch (error: any) {
        this.error = error.message;
        console.error("Error updating game:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteGame(id: string) {
      this.loading = true;
      this.error = null;

      try {
        await GameService.delete(id);
        this.games = this.games.filter((g) => g.id !== id);
      } catch (error: any) {
        this.error = error.message;
        console.error("Error deleting game:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
