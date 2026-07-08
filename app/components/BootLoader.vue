<script setup lang="ts">
defineProps<{
  visible: boolean;
}>();
</script>

<template>
  <div
    class="boot-loader"
    :class="{ 'is-hidden': !visible }"
    aria-label="Caricamento sito"
    aria-live="polite"
  >
    <div class="boot-box">
      <p class="boot-kicker">&gt; boot MatteoOS</p>
      <p class="boot-title">Cowabunga!</p>
      <ul class="boot-steps">
        <li class="boot-step">loading creative systems...</li>
        <li class="boot-step">syncing community memories...</li>
        <li class="boot-step">warming up pixel engine...</li>
        <li class="boot-step">preparing corporate profile...</li>
        <li class="boot-step">ready to build.</li>
      </ul>
      <div class="boot-progress" aria-hidden="true">
        <span class="boot-progress-bar" />
      </div>
      <p class="boot-status">READY</p>
    </div>
  </div>
</template>
