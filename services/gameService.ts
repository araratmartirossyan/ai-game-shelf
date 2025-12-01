import type { Game } from "~/types/game";

export class GameService {
  private static getClient() {
    return useSupabaseClient();
  }

  static async fetchAll(): Promise<Game[]> {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .order("title", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async create(
    game: Omit<Game, "id" | "created_at" | "updated_at">
  ): Promise<Game> {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from("games")
      .insert(game as any)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("Failed to create game");
    return data;
  }

  static async update(id: string, updates: Partial<Game>): Promise<Game> {
    const supabase = this.getClient();
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("games")
      // @ts-expect-error - Supabase types need database schema definition
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("Failed to update game");
    return data;
  }

  static async delete(id: string): Promise<void> {
    const supabase = this.getClient();
    const { error } = await supabase.from("games").delete().eq("id", id);

    if (error) throw error;
  }
}

