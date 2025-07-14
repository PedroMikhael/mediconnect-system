import { AxiosError } from 'axios'
import request from '../request'

// Tipo para o registro do paciente
export type PatientRegisterRequest = {
  name: string
  email: string
  password: string
  dateOfBirth: string 
  healthPlan: string // string simples (um plano)
}

// Exporta APENAS o serviço de registro aqui
export const patientService = {
  register: async (data: PatientRegisterRequest): Promise<void> => {
    try {
      await request({
        method: 'POST',
        url: '/api/patient',
        data,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error: unknown) {
      throw (
        (error as AxiosError).response?.data || { message: 'Erro ao cadastrar paciente' }
      )
    }
  },
}