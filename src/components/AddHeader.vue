<script setup>
import { ref, onMounted } from 'vue';
import { getLocalStorage } from '@/utils/getLocalStorage';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const isActive = ref(false);
const toggleMenu = () => {
  isActive.value = !isActive.value;
};

const userName = ref('');

const store = useStore();
const router = useRouter();

const emit = defineEmits(['logout']);

onMounted(() => {
  const user = getLocalStorage('user');
  userName.value = user?.name || '';
});

const logout = () => {
  window.localStorage.removeItem('user');

  store.commit('setUserId', null);
  store.commit('addPostList', []);

  emit('logout');
  router.push('/login');
};
</script>

<template>
  <header class="navbar is-dark" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item"></a>
      <a
        role="button"
        class="navbar-burger"
        :class="{ 'is-active': isActive }"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
        @click="toggleMenu"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div
      id="navbarBasicExample"
      class="navbar-menu"
      :class="{ 'is-active': isActive }"
    >
      <div class="navbar-start">
        <RouterLink to="/" class="navbar-item">My App</RouterLink>
        <RouterLink to="/" class="navbar-item">Home</RouterLink>
        <RouterLink to="/posts" class="navbar-item">Posts</RouterLink>
        <RouterLink to="/posts/create" class="navbar-item">Add Post</RouterLink>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <template v-if="userName">
              <span class="navbar-item">Вітаємо, {{ userName }}!</span>
              <a class="button is-danger" @click="logout">Log out</a>
            </template>
            <template v-else>
              <RouterLink to="/register" class="button is-primary">
                <strong>Sign up</strong>
              </RouterLink>
              <RouterLink to="/login" class="button is-light">
                Log in
              </RouterLink>
            </template>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style></style>
