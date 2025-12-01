interface RawgGame {
  id: number;
  name: string;
  slug: string;
  background_image: string | null;
  released: string | null;
  platforms: Array<{ platform: { id: number; name: string; slug: string } }>;
  genres: Array<{ id: number; name: string; slug: string }>;
  rating: number;
  rating_top: number;
  description?: string;
}

interface RawgSearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawgGame[];
}

export class RawgService {
  private static readonly BASE_URL = "https://api.rawg.io/api";
  private static apiKey: string | null = null;

  static setApiKey(key: string) {
    this.apiKey = key;
  }

  static async searchGames(query: string): Promise<RawgGame[]> {
    if (!this.apiKey) {
      throw new Error("RAWG API key not configured");
    }

    const response = await $fetch<RawgSearchResponse>(
      `${this.BASE_URL}/games`,
      {
        params: {
          search: query,
          key: this.apiKey,
          page_size: 10,
        },
      }
    );

    return response.results || [];
  }

  static async getGameById(id: number): Promise<RawgGame | null> {
    if (!this.apiKey) {
      throw new Error("RAWG API key not configured");
    }

    try {
      const response = await $fetch<RawgGame>(`${this.BASE_URL}/games/${id}`, {
        params: {
          key: this.apiKey,
        },
      });
      return response;
    } catch (error) {
      console.error("Error fetching game from RAWG:", error);
      return null;
    }
  }

  static findBestMatch(
    gameTitle: string,
    results: RawgGame[]
  ): RawgGame | null {
    if (results.length === 0) return null;

    // Try exact match first
    const exactMatch = results.find(
      (game) => game.name.toLowerCase() === gameTitle.toLowerCase()
    );
    if (exactMatch) return exactMatch;

    // Try partial match
    const partialMatch = results.find(
      (game) =>
        game.name.toLowerCase().includes(gameTitle.toLowerCase()) ||
        gameTitle.toLowerCase().includes(game.name.toLowerCase())
    );
    if (partialMatch) return partialMatch;

    // Return first result as fallback
    return results[0];
  }

  static mapRawgToGameRecognition(rawgGame: RawgGame): {
    title: string;
    description?: string;
    image_url?: string;
    category?: string;
    genre?: string;
    platform?: string;
    year?: number;
  } {
    const platforms =
      rawgGame.platforms?.map((p) => p.platform.name).join(", ") || "";

    const genres = rawgGame.genres?.map((g) => g.name).join(", ") || "";

    // Extract year from release date
    const year = rawgGame.released
      ? new Date(rawgGame.released).getFullYear()
      : null;

    return {
      title: rawgGame.name,
      description: rawgGame.description || undefined,
      image_url: rawgGame.background_image || undefined,
      category: "Video Game",
      genre: genres || undefined,
      platform: platforms || undefined,
      year: year || undefined,
    };
  }
}
