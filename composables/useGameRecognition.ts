import { RawgService } from "~/services/rawgService";

export const useGameRecognition = () => {
  const config = useRuntimeConfig();

  // Initialize RAWG service with API key
  if (config.public.rawgApiKey) {
    RawgService.setApiKey(config.public.rawgApiKey);
  }

  const recognizeGameWithOpenAI = async (imageBase64: string): Promise<any> => {
    const apiKey = config.public.openaiApiKey;
    if (!apiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const response = await $fetch<{
      choices: Array<{
        message: {
          content: string;
        };
      }>;
    }>("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: {
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a game recognition assistant. Always respond with valid JSON only, no markdown, no code blocks, no additional text.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: 'Analyze this image of a physical game (board game, card game, video game, etc.). Extract the following information and return it as a JSON object with these exact keys: {"title": "Game Title", "description": "Brief description of the game", "category": "Category (e.g., Board Game, Card Game, Video Game, etc.)", "genre": "Genre (e.g., Action, RPG, Strategy, Puzzle, Adventure, etc.)", "platform": "Platform if it\'s a video game (e.g., PC, PS5, PS4, Xbox, Nintendo Switch, etc.) or leave empty for board/card games", "year": "Release year as a number (e.g., 2023)", "image_url": "URL to a high-quality image of the game box or cover if available"}. Be as accurate as possible with the title, genre, platform, and year. If you can identify the game, provide a detailed description and suggest an image URL from a reliable source. Return ONLY the JSON object, nothing else.',
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
      },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    // Log the raw response for debugging
    console.log("OpenAI raw response:", content);

    // Try multiple parsing strategies
    let parsedContent: any;

    // Strategy 1: Try parsing directly (if response_format worked)
    try {
      parsedContent = JSON.parse(content);
      if (parsedContent && typeof parsedContent === "object") {
        return parsedContent;
      }
    } catch (e) {
      // Continue to other strategies
    }

    // Strategy 2: Remove markdown code blocks if present
    let cleanedContent = content.trim();
    // Remove ```json and ``` markers
    cleanedContent = cleanedContent.replace(/^```json\s*/i, "");
    cleanedContent = cleanedContent.replace(/^```\s*/i, "");
    cleanedContent = cleanedContent.replace(/\s*```$/i, "");
    cleanedContent = cleanedContent.trim();

    // Strategy 3: Extract JSON object from text
    const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsedContent = JSON.parse(jsonMatch[0]);
        if (parsedContent && typeof parsedContent === "object") {
          return parsedContent;
        }
      } catch (e) {
        console.error("Failed to parse extracted JSON:", e);
      }
    }

    // Strategy 4: Try parsing the cleaned content directly
    try {
      parsedContent = JSON.parse(cleanedContent);
      if (parsedContent && typeof parsedContent === "object") {
        return parsedContent;
      }
    } catch (e) {
      // Final fallback
    }

    // If all strategies fail, throw error with the content for debugging
    throw new Error(
      `Could not parse response from OpenAI. Raw response: ${content.substring(
        0,
        200
      )}...`
    );
  };

  const recognizeGame = async (imageFile: File): Promise<any> => {
    // Convert image to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });

    const config = useRuntimeConfig();

    // Use OpenAI for game recognition
    if (!config.public.openaiApiKey) {
      throw new Error(
        "OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file"
      );
    }

    try {
      const result = await recognizeGameWithOpenAI(base64);

      // Try to fetch image from RAWG API if we have a title
      if (result.title && config.public.rawgApiKey) {
        try {
          const rawgResults = await RawgService.searchGames(result.title);
          const bestMatch = RawgService.findBestMatch(
            result.title,
            rawgResults
          );

          if (bestMatch && bestMatch.background_image) {
            result.image_url = bestMatch.background_image;
            // Also update other fields if they're missing
            if (!result.platform && bestMatch.platforms?.length > 0) {
              result.platform = bestMatch.platforms[0].platform.name;
            }
            if (!result.genre && bestMatch.genres?.length > 0) {
              result.genre = bestMatch.genres.map((g) => g.name).join(", ");
            }
            if (!result.year && bestMatch.released) {
              result.year = new Date(bestMatch.released)
                .getFullYear()
                .toString();
            }
          }
        } catch (rawgError) {
          console.warn("Failed to fetch image from RAWG:", rawgError);
          // Continue with OpenAI result even if RAWG fails
        }
      }

      return result;
    } catch (error: any) {
      console.error("OpenAI recognition failed:", error);
      throw new Error(
        error.message ||
          "Failed to recognize game. Please try again or enter information manually."
      );
    }
  };

  const searchGame = async (query: string): Promise<any> => {
    if (!config.public.rawgApiKey) {
      throw new Error("RAWG API key not configured");
    }

    try {
      const results = await RawgService.searchGames(query);
      if (results.length === 0) {
        throw new Error("No games found");
      }

      // Return all results for selection, or best match if single result
      if (results.length === 1) {
        return RawgService.mapRawgToGameRecognition(results[0]);
      }

      // Return results array for user selection
      return results;
    } catch (error: any) {
      console.error("RAWG search failed:", error);
      throw new Error(
        error.message || "Failed to search game. Please try again."
      );
    }
  };

  return {
    recognizeGame,
    searchGame,
  };
};
