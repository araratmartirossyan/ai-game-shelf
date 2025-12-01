<template>
  <div
    v-if="showPrompt"
    class="fixed bottom-4 left-4 right-4 z-50 bg-card border rounded-lg shadow-lg p-4 md:left-auto md:max-w-sm"
  >
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0">
        <div
          class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"
        >
          <Download class="w-6 h-6 text-primary" />
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-sm mb-1">Install GameShelf</h3>
        <p class="text-xs text-muted-foreground mb-3">
          Install this app on your device for a better experience
        </p>
        <div class="flex gap-2">
          <button
            @click="installApp"
            class="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Install
          </button>
          <button
            @click="dismissPrompt"
            class="px-4 py-2 border border-input rounded-lg text-sm hover:bg-accent transition-colors"
          >
            Later
          </button>
        </div>
      </div>
      <button
        @click="dismissPrompt"
        class="flex-shrink-0 p-1 hover:bg-accent rounded transition-colors"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Download, X } from "lucide-vue-next";

const showPrompt = ref(false);
const installPrompt = ref<any>(null);

const checkInstallable = () => {
  if (process.client) {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      installPrompt.value = e;

      // Show prompt after a delay if not dismissed
      setTimeout(() => {
        const dismissed = localStorage.getItem("pwa-install-dismissed");
        if (!dismissed && installPrompt.value) {
          showPrompt.value = true;
        }
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Cleanup
    onUnmounted(() => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    });
  }
};

const installApp = async () => {
  if (installPrompt.value) {
    (installPrompt.value as any).prompt();
    const choiceResult = await (installPrompt.value as any).userChoice;

    if (choiceResult.outcome === "accepted") {
      showPrompt.value = false;
    }
    installPrompt.value = null;
  }
};

const dismissPrompt = () => {
  showPrompt.value = false;
  localStorage.setItem("pwa-install-dismissed", "true");
  // Reset after 7 days
  setTimeout(() => {
    localStorage.removeItem("pwa-install-dismissed");
  }, 7 * 24 * 60 * 60 * 1000);
};

onMounted(() => {
  checkInstallable();
});
</script>
