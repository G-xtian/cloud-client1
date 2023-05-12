// stores/counter.js
import { defineStore } from 'pinia'

export const usePermissionsStore = defineStore({
  id: 'permission',
  state: () => ({
    userInformation: null,
  }),


})


