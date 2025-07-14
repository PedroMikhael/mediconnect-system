import { AxiosError } from 'axios'
import request from '../request'

export type LoginResponse = {
  token: string
  id: number
}

export const loginService = {

  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await request({
        method: 'POST',
        url: '/api/auth/login/doctor',
        data: {
          email,
          password,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })

      return response as LoginResponse
    } catch (error: unknown) {
      throw (
        (error as AxiosError).response?.data || { message: 'Erro desconhecido' }
      )
    }
  },
}