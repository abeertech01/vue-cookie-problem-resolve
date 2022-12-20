<script setup>
import axios from "axios"
import { ref } from "vue"

const username = ref("")
const password = ref("")

const login = () => {
  axios({
    method: "POST",
    data: {
      username: username.value,
      password: password.value,
    },
    withCredentials: true,
    url: "http://localhost:4000/login",
  }).then((res) => console.log(res.data))
}
</script>

<template>
  <div>
    <h1>Test App</h1>

    <input type="text" v-model="username" />
    <input type="text" v-model="password" />
    <button @click="login">Login</button>
  </div>
</template>

<style scoped></style>
