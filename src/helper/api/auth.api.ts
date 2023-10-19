import axios from "axios"
import { GenericResponse, ILoginResponse, IUserResponse } from "./types"

const BASE_URL = 'https://shoeslab.id/v1'

const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

authApi.defaults.headers.common["Content-Type"] = "application/json"

export const loginUserFn = async (user: ILoginResponse) => {
  const response = await authApi.post<ILoginResponse>("signIn", user)
  return response.data
}

export const getUser = async () => {
  const response = await authApi.get<IUserResponse>("user")
  return response.data
}
