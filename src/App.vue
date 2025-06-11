<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

import { getUserByEmail } from './api/users';
import { getLocalStorage } from './utils/getLocalStorage';

const store = useStore();
const needLogin = ref(true);
const gettingUser = async (email) => {
  try {
    const { data } = await getUserByEmail(email);

    if (data.length !== 0) {
      store.commit('setUserId', data[0].id);
      needLogin.value = false;
    } else {
      needLogin.value = true;
      store.commit('setUserId', null);
    }
  } catch (err) {
    console.error('Failed to get user by email:', err);
    needLogin.value = true;
    store.commit('setUserId', null);
  }
};

onMounted(() => {
  const user = getLocalStorage('user');

  if (user && user.email) {
    gettingUser(user.email);
  } else {
    needLogin.value = true;
    store.commit('setUserId', null);
  }
});
</script>

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style></style>
