import { defineStore } from "pinia"
import fetchWrapper from "../helper/fetch-wrapper"

// const baseUrl = import.meta.env.VITE_API_URL
const baseUrl = "http://localhost:5000/v1"

export const useUsersStore = defineStore({
  id: "users",
  state: () => ({
    users: {},
  }),
  actions: {
    async getUser() {
      this.users = { loading: true }
      fetchWrapper
        .get(baseUrl + "/user")
        .then((users) => (this.users = users))
        .catch((error) => (this.users = { error }))
    },
  },
})
