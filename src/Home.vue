<script setup>
import axios from "axios";
import BarChart from "./components/diagram.vue";
import { reactive, watch, onMounted, ref } from "vue";
const api = "6c5ab38a103628d4ff33108390974409192cbfb896e671cdad74b78f45444c89";

const state = reactive({
  connection: null,
  item: "",
  price: "",
  tiker: "",
  tikers: [],
  connection: null,
});

onMounted(() => {
  const tikers = localStorage.tikers;
  if (tikers) {
    axios
      .get(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tikers}&tsyms=USD,EUR`
      )
      .then((res) => {
        const names = Object.keys(res.data);
        const prices = Object.values(res.data);
        const all = names.map(
          (i, index) => (i = { name: i, price: prices[index].USD })
        );
        state.tikers = all;
      });
  } else {
    return;
  }
}),
  watch(
    () => state.tiker,
    () => {
      console.log(state.tiker);
      if (state.tiker.length > 2) {
        axios
          .get(
            `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${state.tiker}&tsyms=USD`
          )
          // .then(res => this.error = res.data.Response ? false : true)
          // .then(res=> this.price = res.data.display[newTiker].usd.price))
          .then(
            (res) => 
              (state.price = res.data.DISPLAY[
                state.tiker.toUpperCase()
              ].USD.PRICE.replace("$", ""))
          )
          .catch(err=>console.log(err.message));
      } else {
      }
    }
  ),
  watch(
    ()=>state.tikers, 
    () => {
    localStorage.tikers = state.tikers.map((i) => i.name).join(",");
  });
  function addItem() {
    console.log('Add')
    state.tikers = [...state.tikers, { name: state.tiker, price: state.price }];
    state.price = "";
    state.tiker = "";
  };
function delItem(item) {
  state.tikers = state.tikers.filter((i) => i.name != item);
};
function chatItem(item) {
  state.item = state.item ? "" : item;
};
function close(){
  console.log('Connection close');
  state.connection.close();
};
function view(a) {
  const connection = new WebSocket(
    `wss://streamer.cryptocompare.com/v2?api_key=${api}`
  );
  state.connection = connection;
  (connection.onopen = function onStreamOpen() {
    var subRequest = {
      action: "SubAdd",
      subs: [`2~Coinbase~${a}~USD`],
    };
    connection.send(JSON.stringify(subRequest));
  }),
    (connection.onmessage = function onStreamMessage(message) {
      var message = event.data;
      const newMessage = JSON.parse(message);
      console.log("Message", JSON.parse(message).TYPE);
      if (newMessage.TYPE === "429") {
        connection.onclose = (event) => {
          console.log("The connection has been closed successfully.");
        };
      }
      console.log("Price", JSON.parse(message));
      state.count = 1000;
      const new_price = JSON.parse(message).PRICE;
      if (JSON.parse(message).TYPE === "2") {
        state.tikers = state.tikers.map((i) =>
          i.name === a ? { name: a, price: new_price } : i
        );
      }
    });
};
</script>
<template>
  <div class="h-3/4 min-h-screen p-6 sm:p-2 bg-[#F3F4F6]">
    <div class="p-4 bg-white rounded-lg mb-4 sm:mb-2">
      <div :class="state.tiker ? 'h-14':'h-12'">
        Тикер
        <p v-if="state.price" class="text-xl">
          {{ state.tiker.toUpperCase() }}
        </p>
      </div>
      <button
        @click="addItem"
        :disabled="!state.price"
        :title="!state.price?'disabled':''"
        class="bg-[#471F7A] leading-6 h-12 text-white active:scale-95"
      >
        Добавить
      </button>
    </div>
    <div class="relative">
      <img
        class="absolute top-4 left-2"
        src="./assets/search.png"
        width="15"
        height="15"
      />
      <input
        class="w-33 sm:w-full pl-10 pr-4 border border-slate-300"
        v-model="state.tiker"
        type="search"
        placeholder="Найти тикер"
      />
    </div>
    <div class="grid grid-cols-3 gap-3 my-4 sm:my-2 sm:block">
      <div
        class="p-4 bg-white rounded-lg border border-slate-300 sm:mb-2 cursor-pointer"
        :key="item"
        v-for="item in state.tikers"
        @click="view(item.name)"
      >
        <p class="text-sm font-medium">
          {{ item.name.toUpperCase() }}

          <img
            class="float-right cursor-pointer mt-0.5"
            src="./assets/delete.png"
            width="14"
            height="16"
            @click.stop="delItem(item.name)"
          />
          <img
            class="float-right cursor-pointer mr-4"
            src="./assets/chart.png"
            width="18"
            height="12"
            @click.stop="chatItem(item.name)"
          />
        </p>
        <p class="text-4xl font-normal">{{ item.price }}$</p>
      </div>
    </div>   
    <div v-if="state.item" class="w-full h-80 sm:h-1/4">
      <BarChart :item="state.item" />
    </div>
    <div class="w-full py-4">
      <span class="leading-6 sm:text-xs"
        >Показано {{ state.tikers.length }} результатов из
        {{ state.tikers.length }}</span
      >
      <div class="inline-block float-right">
        <button
          class="w-20 h-12 sm:h-8 sm:w-16 text-slate-700 bg-white border border-gray-300 text-sm sm:text-xs"
        >
          Назад
        </button>
        <button
          class="w-20 h-12 sm:h-8 sm:w-16 text-slate-700 bg-white border border-gray-300 text-sm sm:text-xs ml-3"
        >
          Вперед
        </button>
      </div>
    </div>
  </div>
</template>

<style>
button {
  width: 127px;
  left: 16px;
  top: 86px;
  border-radius: 6px;
  cursor: pointer;
}

input {
  height: 42px;
  left: 24px;
  top: 192px;
  border-radius: 6px;
  padding: 9px 13px;
  outline: none;
}
</style>
