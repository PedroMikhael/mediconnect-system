"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, User, Heart, FileText, DollarSign, Save, Clock, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface FinalizeConsultationProps {
  params: {
    appointmentId: string
  }
}

interface Patient {
  id: number
  name: string
  dateOfBirth: string
  healthPlan: string
  healthPlanNumber: string
  email: string
  initials: string
}

interface Appointment {
  id: number
  patient: Patient
  date: string
  time: string
  type: string
  status: string
}

export default function FinalizeConsultation({ params }: FinalizeConsultationProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingAppointment, setLoadingAppointment] = useState(true)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    prescription: "",
    consultationFee: "",
    requiresPayment: false,
  })

  const [appointment, setAppointment] = useState<Appointment | null>(null)

  function calculateAge(dateOfBirth: string): number {
    const birth = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  useEffect(() => {
    // Check if user is logged in as doctor
    const userType = localStorage.getItem("userType")
    if (userType !== "doctor") {
      router.push("/login")
      return
    }

    // Fetch appointment data
    fetchAppointmentData()
  }, [router])

  const fetchAppointmentData = async () => {
    try {
      setLoadingAppointment(true)
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Usuário não autenticado")
      }

      const response = await fetch(`/api/appointments/${params.appointmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Erro ao buscar dados da consulta")
      }

      const data = await response.json()

      // Generate initials
      const initials = data.patient.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()

      setAppointment({
        id: data.id,
        patient: {
          id: data.patient.id,
          name: data.patient.name,
          dateOfBirth: data.patient.dateOfBirth,
          healthPlan: data.patient.healthPlan || "Não informado",
          healthPlanNumber: data.patient.healthPlanNumber || "Não informado",
          email: data.patient.email,
          initials,
        },
        date: data.date,
        time: data.time,
        type: data.type || "Consulta",
        status: data.status,
      })
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados da consulta")
    } finally {
      setLoadingAppointment(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRequiresPaymentChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      requiresPayment: checked,
      consultationFee: checked ? prev.consultationFee : "",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (!formData.prescription.trim()) {
      setError("Por favor, adicione uma prescrição médica")
      setIsLoading(false)
      return
    }

    if (formData.requiresPayment && !formData.consultationFee) {
      setError("Por favor, informe o valor da consulta")
      setIsLoading(false)
      return
    }

    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Usuário não autenticado")
      }

      const response = await fetch(`/api/appointments/${params.appointmentId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prescription: formData.prescription,
          consultationFee: formData.requiresPayment ? formData.consultationFee : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao finalizar consulta")
      }

      setSuccess("Consulta finalizada com sucesso!")

      setTimeout(() => {
        router.push("/doctor/dashboard")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Erro ao finalizar consulta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (loadingAppointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <p>Carregando dados da consulta...</p>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <Card className="shadow-xl border-2 border-blue-100">
          <CardContent className="text-center py-12">
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error || "Não foi possível carregar os dados da consulta"}
              </AlertDescription>
            </Alert>
            <Button
              className="mt-6 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
              onClick={() => router.push("/doctor/dashboard")}
            >
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/doctor/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Finalizar Consulta
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Patient Info */}
            <div className="lg:col-span-1">
              <Card className="shadow-xl border-2 border-blue-100">
                <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-blue-100">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white text-2xl font-bold">{appointment.patient.initials}</span>
                  </div>
                  <CardTitle className="text-xl text-gray-900">{appointment.patient.name}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {calculateAge(appointment.patient.dateOfBirth)} anos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Plano de Saúde</p>
                    <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200">
                      {appointment.patient.healthPlan}
                    </Badge>
                    <p className="text-xs text-gray-600 mt-1">Nº: {appointment.patient.healthPlanNumber}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-600">{appointment.patient.email}</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Consulta Atual:</h4>
                    <div className="space-y-1 text-sm text-gray-700">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(appointment.date).toLocaleDateString("pt-BR")}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {typeof appointment.time === "string" 
                          ? appointment.time 
                          : `${String(appointment.time.hour).padStart(2, '0')}:${String(appointment.time.minute).padStart(2, '0')}`}
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        {appointment.type}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Consultation Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-2 border-blue-100">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <CardTitle className="flex items-center text-2xl text-gray-900">
                    <FileText className="h-6 w-6 mr-2 text-blue-600" />
                    Finalização da Consulta
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Preencha as informações da consulta realizada
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {error && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="mb-6 border-green-200 bg-green-50">
                      <AlertDescription className="text-green-800">{success}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Prescription/Recipe */}
                    <div className="space-y-3">
                      <Label htmlFor="prescription" className="text-lg font-semibold text-gray-900 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-600" />
                        Prescrição Médica
                      </Label>
                      <Textarea
                        id="prescription"
                        placeholder="Digite aqui a prescrição médica, medicamentos, orientações, receitas, etc..."
                        value={formData.prescription}
                        onChange={(e) => handleInputChange("prescription", e.target.value)}
                        rows={10}
                        className="border-2 border-blue-100 focus:border-blue-300 text-sm"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Inclua medicamentos, dosagens, orientações e recomendações para o paciente
                      </p>
                    </div>

                    {/* Payment Section */}
                    <div className="space-y-4 bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-200">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                        Cobrança da Consulta
                      </h3>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="requiresPayment"
                          checked={formData.requiresPayment}
                          onChange={(e) => handleRequiresPaymentChange(e.target.checked)}
                          className="rounded border-blue-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                        <Label htmlFor="requiresPayment" className="text-sm font-medium text-gray-700 cursor-pointer">
                          Paciente não possui cobertura do plano / Consulta particular
                        </Label>
                      </div>

                      {formData.requiresPayment && (
                        <div className="space-y-2 ml-7">
                          <Label htmlFor="consultationFee" className="text-sm font-medium text-gray-700">
                            Valor da Consulta (R$)
                          </Label>
                          <Input
                            id="consultationFee"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0,00"
                            value={formData.consultationFee}
                            onChange={(e) => handleInputChange("consultationFee", e.target.value)}
                            className="border-2 border-blue-200 focus:border-blue-400 max-w-xs"
                            required={formData.requiresPayment}
                          />
                          <p className="text-xs text-gray-600">
                            Valor a ser cobrado do paciente (apenas se não coberto pelo plano)
                          </p>
                        </div>
                      )}

                      {!formData.requiresPayment && (
                        <div className="flex items-center space-x-2 ml-7">
                          <Heart className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">
                            Consulta coberta pelo plano {appointment.patient.healthPlan}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Summary */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Resumo da Finalização:</h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p>
                          <strong>Paciente:</strong> {appointment.patient.name}
                        </p>
                        <p>
                          <strong>Data/Hora:</strong> {new Date(appointment.date).toLocaleDateString("pt-BR")} às{" "}
                          {typeof appointment.time === "string" 
                            ? appointment.time 
                            : `${String(appointment.time.hour).padStart(2, '0')}:${String(appointment.time.minute).padStart(2, '0')}`}
                        </p>
                        <p>
                          <strong>Plano:</strong> {appointment.patient.healthPlan}
                        </p>
                        <p>
                          <strong>Cobrança:</strong>{" "}
                          {formData.requiresPayment
                            ? `R$ ${formData.consultationFee || "0,00"} (Particular)`
                            : "Coberto pelo plano"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white py-3 text-lg font-semibold shadow-lg"
                      >
                        <Save className="h-5 w-5 mr-2" />
                        {isLoading ? "Finalizando..." : "Finalizar Consulta"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        disabled={isLoading}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}