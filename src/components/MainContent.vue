<script setup>
import AddHeader from './AddHeader.vue';

const emit = defineEmits(['logout']);
</script>

<template>
  <AddHeader @logout="emit('logout')" />

  <main class="section">
    <div class="container">
      <div class="block">
        <h1 class="title is-2">Welcome to My App!</h1>
        <p class="subtitle is-4">Your personal space for managing posts.</p>
      </div>

      <div class="box">
        <p>
          Navigate through the menu above to explore posts, create new ones, or
          manage existing entries.
        </p>
        <p>This is a simple blog application built with Vue 3.</p>
        <p>Feel free to try out all the features!</p>
      </div>
      <div class="tile is-ancestor custom-container">
        <router-view></router-view>
      </div>
    </div>
  </main>
</template>

<style>
.container {
  padding: 20px;
}
.box {
  margin-top: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.title,
.subtitle {
  text-align: center;
  margin-bottom: 10px;
}
.tile {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;
}

@media (min-width: 769px) {
  .tile:not(.is-child) {
    display: flex;
    align-items: stretch;
    flex-grow: 1;
  }
}
</style>
