import { defineStore } from "pinia"
import fetchWrapper from "../helper/fetch-wrapper"

const baseUrl = import.meta.env.VITE_API_URL as string
export type Product = {
  productData: null | any,
  image: string
}

export const useProductStore = defineStore({
  id: "products",
  state: () =>
    ({
      productData: null,
      image: `${baseUrl} + `
    } as Product),
  actions: {
    async getProduct() {
      try {
        this.productData = await fetchWrapper.get(baseUrl + "product")
      } catch (error) {}
    },
    async getImage() {
      fetchWrapper.get(baseUrl + "/user")
    },
  }
})
