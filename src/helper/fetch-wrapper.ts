import axios from "axios"

const axiosInstance = axios.create({
  baseURL: 'https://shoeslab.id/v1/', // Ganti dengan URL API Anda
})

export default {
  async get(url: any, params = {}) {
    try {
      const response = await axiosInstance.get(url, { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  async post(url: any, data = {}) {
    try {
      const response = await axiosInstance.post(url, data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async put(url: any, data = {}) {
    try {
      const response = await axiosInstance.put(url, data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async delete(url: any) {
    try {
      const response = await axiosInstance.delete(url)
      return response.data
    } catch (error) {
      throw error
    }
  }
}
