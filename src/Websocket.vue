<script setup>
import { reactive, onMounted } from "vue";

// import io from 'vue-3-socket.io';

// onMounted(() => {
//   const socket = io('http://localhost:5000');
//   socket.on("connect", () => {
//     console.log(socket.id); // x8WIv7-mJelg7on_ALbx
//   });
// });


const state = reactive({name:'Bob'});


</script>
<template>
  <h1>This is websocket {{state.name}}</h1>
 
</template>
