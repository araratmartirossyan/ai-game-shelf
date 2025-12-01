<template>
  <div>
    <label class="block text-sm font-medium mb-2">Take or Upload Photo</label>
    <div
      class="border-2 border-dashed border-border rounded-lg p-8 text-center"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        capture="environment"
        class="hidden"
        @change="handleFileSelect"
      />
      <div v-if="!previewImage" class="space-y-4">
        <div class="flex justify-center">
          <Camera class="w-16 h-16 text-muted-foreground" />
        </div>
        <div>
          <button
            @click="fileInput?.click()"
            class="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Choose Photo
          </button>
        </div>
        <p class="text-sm text-muted-foreground">
          Take a photo or select from gallery
        </p>
      </div>
      <div v-else class="space-y-4">
        <img
          :src="previewImage"
          alt="Preview"
          class="max-w-full h-auto max-h-64 mx-auto rounded-lg"
        />
        <div class="flex gap-2 justify-center">
          <button
            @click="fileInput?.click()"
            class="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm hover:bg-secondary/80 transition-colors"
          >
            Change Photo
          </button>
          <button
            @click="removeImage"
            class="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-sm hover:bg-destructive/90 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Camera } from "lucide-vue-next";

const fileInput = ref<HTMLInputElement | null>(null);
const previewImage = ref<string | null>(null);
const selectedFile = ref<File | null>(null);

const emit = defineEmits<{
  fileSelected: [file: File];
  fileRemoved: [];
}>();

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    emit("fileSelected", file);
  }
};

const removeImage = () => {
  previewImage.value = null;
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
  emit("fileRemoved");
};

defineExpose({
  removeImage,
});
</script>

