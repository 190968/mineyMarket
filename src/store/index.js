import { defineStore } from 'pinia'

export const userStore = defineStore({
    // id is required so that Pinia can connect the store to the devtools
    id: 'loggedInUser',
    state: () => ({ name: 'Bob', age: 55, newfamily: 'ivanov' }),
    getters: {
        full: (state) => {
            return (userId) => state.name + ' ' + userId  
        },
    },
    actions: {
        // since we rely on `this`, we cannot use an arrow function
        increment() {
            this.age++
        },
        setfamily(a) {
            this.newfamily = a
        }       
    },
})