import { AxiosError } from 'axios'
import request from '../request'

export type DoctorRegisterRequest = {
  name: string
  email: string
  password: string
  speciality: string
  healthPlan: string
}

export const doctorService = {
  register: async (data: DoctorRegisterRequest): Promise<void> => {
    try {
      await request({
        method: 'POST',
        url: '/api/doctor',
        data,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error: unknown) {
      throw (
        (error as AxiosError).response?.data || { message: 'Erro ao cadastrar médico' }
      )
    }
  },
}