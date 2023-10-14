import type { IUser } from "../helper/api/types"
import { defineStore } from "pinia"
import fetchWrapper from "../helper/fetch-wrapper"
import router from "../router"
import axios from "axios"

// const baseUrl = `${import.meta.env.VITE_API_URL}`
const baseUrl = "http://localhost:5000/v1"
export type AuthStoreState = {
  authUser: IUser | null
  access_token: IUser | null
  returnUrl: null
}

export const useAuthStore = defineStore({
  id: "auth",
  state: () =>
    ({
      access_token: null,
      authUser: null,
      returnUrl: null,
    } as AuthStoreState),
  actions: {
    async login(email: string, password: string) {
      this.access_token = await fetchWrapper.post(`${baseUrl}/signIn`, {
        email,
        password,
      })

      // store access_token details and jwt in local storage to keep access_token logged in between page refreshes
      localStorage.setItem("access_token", JSON.stringify(this.access_token))

      // redirect to previous url or default to home page
      router.push(this.returnUrl || "/dashboard")
    },
    async getUserWithToken() {
      // Lakukan permintaan untuk mendapatkan data pengguna dengan token
      try {
        const token = JSON.parse(localStorage.getItem("access_token") || "")
        const user = await axios.get(`${baseUrl}/user`, {
          // Tambahkan token ke header permintaan
          headers: {
            Authorization: `Bearer ${token.auth}`,
          },
        })

        localStorage.setItem("user_data", JSON.stringify(user.data))

        this.authUser = user.data
      } catch (error) {
        // Tangani kesalahan jika gagal mengambil data pengguna
        console.error("Gagal mengambil data pengguna:", error)
      }
    },
    setAuthUser(user: IUser | null) {
      this.authUser = user
    },
  },
})