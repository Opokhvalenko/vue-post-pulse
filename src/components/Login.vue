<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { getUserByEmail, registrationUser } from '@/api/users';
import { setLocalStorage } from '@/utils/setLocalStorage';

import NeedToRegister from './NeedToRegister.vue';

const router = useRouter();
const store = useStore();

const email = ref('');
const name = ref('');
const errMessage = ref('');
const isLoading = ref(false);
const needRegistration = ref(false);
const errMessageRegistration = ref('');

const validation = () => {
  errMessage.value = '';
  errMessageRegistration.value = '';

  if (email.value.trim() === '') {
    errMessage.value = 'Email is required';
    return false;
  }

  if (needRegistration.value && name.value.trim() === '') {
    errMessageRegistration.value = 'Name is required';
    return false;
  }

  return true;
};

const login = async () => {
  isLoading.value = true;
  try {
    const { data } = await getUserByEmail(email.value);

    if (data.length !== 0) {
      setLocalStorage('user', data[0]);
      store.commit('setUserId', data[0].id);
      router.push('/');
    } else {
      needRegistration.value = true;
      errMessage.value = '';
      name.value = '';
      errMessageRegistration.value = '';
    }
  } catch (error) {
    console.error('Error during login:', error);
    errMessage.value =
      'Ops, something went wrong during login. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const registration = async () => {
  isLoading.value = true;
  try {
    const { data } = await registrationUser(email.value, name.value);
    setLocalStorage('user', data);
    store.commit('setUserId', data.id);
    router.push('/');
  } catch (error) {
    console.error('Error during registration:', error);
    errMessageRegistration.value =
      'Ops, something went wrong during registration. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const submit = () => {
  if (!validation()) {
    return;
  }

  if (!needRegistration.value) {
    login();
  } else {
    registration();
  }
};

const onEmailInput = () => {
  errMessage.value = '';
  needRegistration.value = false;
};
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form class="box mt-5" @submit.prevent="submit">
      <h1 class="title is-3">
        {{
          needRegistration ? 'You need to register' : 'Login to your account'
        }}
      </h1>

      <div class="field">
        <label class="label" for="user-email">Email</label>
        <div class="control has-icons-left">
          <input
            id="user-email"
            v-model.trim="email"
            :class="{ 'is-danger': errMessage }"
            :disabled="isLoading"
            type="email"
            name="email"
            class="input"
            placeholder="Enter your email"
            required
            @input="onEmailInput"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
        <p v-if="errMessage" class="help is-danger">
          {{ errMessage }}
        </p>
      </div>

      <NeedToRegister
        v-if="needRegistration"
        v-model.trim="name"
        :err-message="errMessageRegistration"
        @on-input="errMessageRegistration = ''"
      />

      <div class="field">
        <button
          type="submit"
          class="button is-primary"
          :class="{ 'is-loading': isLoading }"
        >
          {{ needRegistration ? 'Register' : 'Login' }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped></style>
