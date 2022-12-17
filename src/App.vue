<script>


export default {
    data() {
    return {
     
    }
  },
   
}
</script>
<template>
  <div class="flex text-lg justify-around py-5">  
    <router-link to="/">Tikers</router-link> 
    <router-link to="/websocket">Messages</router-link> 
  </div>
    <router-view></router-view>
</template>