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

      <h1 class="text-3xl font-bold mb-8">Scan New Game</h1>

      <div class="bg-card p-6 rounded-lg border space-y-6">
        <ImageUpload
          ref="imageUploadRef"
          @file-selected="handleFileSelected"
          @file-removed="handleFileRemoved"
        />

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
const imageUploadRef = ref();
const selectedFile = ref<File | null>(null);
const recognizing = ref(false);
const recognitionResult = ref<any>(null);
const recognitionError = ref<string | null>(null);
const saving = ref(false);

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
const { recognizeGame: recognizeGameAI } = useGameRecognition();

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

const resetForm = () => {
  imageUploadRef.value?.removeImage();
  selectedFile.value = null;
  recognitionResult.value = null;
  recognitionError.value = null;
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
