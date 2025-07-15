"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Clock, CalendarIcon, Star } from "lucide-react"

interface Doctor {
  id: string
  name: string
  speciality: string
  averageRating: number
  healthPlan: string
  location: string
  initials: string
}

export default function ScheduleAppointment() {
  const router = useRouter()
  const params = useParams()
  const doctorId = params.doctorId

  // Estados para dados do médico e agendamento
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState("")
  const [appointmentType, setAppointmentType] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [hasAvailability, setHasAvailability] = useState(true)

  // Estado para patientId, carregado do localStorage somente no cliente
  const [patientId, setPatientId] = useState<string | null>(null)

  const appointmentTypes = [
    { value: "consulta", label: "Consulta" },
    { value: "retorno", label: "Retorno" },
    { value: "exame", label: "Avaliação de Exames" },
    { value: "preventiva", label: "Consulta Preventiva" },
  ]

  // Componente para renderizar estrelas
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star key="half" className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-5 w-5 text-yellow-400" />
        ))}
        <span className="ml-1 font-semibold text-gray-700">{rating.toFixed(1)}</span>
      </div>
    )
  }

  // Proteção: verifica se usuário está logado e é paciente
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const userType = localStorage.getItem("userType")
    const id = localStorage.getItem("userId")

    if (!token || userType !== "patient" || !id) {
      router.push("/login")
    } else {
      setPatientId(id)
    }
  }, [router])

  // Busca os dados do médico com token e id
  useEffect(() => {
    if (!doctorId) return

    const fetchDoctor = async () => {
      try {
        setError("")
        const token = localStorage.getItem("authToken")
        if (!token) {
          setError("Usuário não autenticado")
          return
        }

        const response = await fetch(`/api/doctor/${doctorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const text = await response.text()
          throw new Error(`Erro ao buscar dados do médico: ${text}`)
        }

        const data = await response.json()
        setDoctor(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message || "Erro ao buscar dados do médico")
      }
    }

    fetchDoctor()
  }, [doctorId])

  // Busca horários disponíveis quando a data muda
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimes(selectedDate)
      setSelectedTime("")
    }
  }, [selectedDate])

  const fetchAvailableTimes = async (date: Date) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) return

      const response = await fetch("/api/appointments/available-times", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: Number(doctorId),
          date: date.toISOString().split("T")[0],
        }),
      })

      if (!response.ok) throw new Error("Erro ao buscar horários disponíveis")

      const data = await response.json()
      setAvailableTimes(data.availableTimes)
      setHasAvailability(data.hasAvailability)
    } catch (error) {
      console.error("Error fetching available times:", error)
      setAvailableTimes([])
      setHasAvailability(false)
    }
  }

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!selectedDate || (!selectedTime && hasAvailability)) {
      setError("Por favor, preencha todos os campos obrigatórios")
      setIsLoading(false)
      return
    }

    if (!patientId) {
      setError("Paciente não identificado. Faça login novamente.")
      setIsLoading(false)
      return
    }

    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        setError("Usuário não autenticado")
        setIsLoading(false)
        return
      }

      const body = {
        doctorId: Number(doctorId),
        patientId: Number(patientId),
        date: selectedDate.toISOString().split("T")[0],
        time: hasAvailability ? selectedTime.split(":")[0] + ":" + selectedTime.split(":")[1] : null,
        acceptWaitingList: !hasAvailability,
      }

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (response.status === 201) {
        setSuccess(
          hasAvailability
            ? "Consulta agendada com sucesso!"
            : "Você foi adicionado à lista de espera. Você será notificado quando um horário ficar disponível."
        )
        setTimeout(() => {
          router.push("/patient/dashboard")
        }, 3000)
      } else {
        const data = await safeParseJson(response)
        setError(data?.message || "Erro ao agendar consulta.")
      }
    } catch (err: any) {
      setError(err.message || "Erro ao agendar consulta.")
    } finally {
      setIsLoading(false)
    }
  }

  async function safeParseJson(response: Response) {
    try {
      return await response.json()
    } catch {
      return null
    }
  }

  // Desabilita datas passadas
  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/patient/search">
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
                Agendar Consulta
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Doctor Info */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-2 border-blue-100">
              <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-2xl font-bold">
                    {doctor?.name ? doctor.name.charAt(0).toUpperCase() : "?"}
                  </span>
                </div>

                <CardTitle className="text-xl text-gray-900">
                  {doctor?.name ?? "Carregando..."}
                </CardTitle>
                <CardDescription className="text-lg font-medium text-blue-600">
                  {doctor?.speciality ?? ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {doctor && (
                  <>
                    {/* Avaliação com estrelas */}
                    <div className="flex items-center justify-center">
                      {renderStars(doctor.averageRating || 0)}
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        Plano aceito:
                      </p>
                      <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 border-blue-300">
                        {doctor.healthPlan}
                      </Badge>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2">Valor da consulta:</p>
                      <p className="text-sm text-gray-600">
                        *O valor será definido pelo médico após a consulta, caso seu plano de saúde não seja compatível
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Scheduling Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="flex items-center text-2xl text-gray-900">
                  <CalendarIcon className="h-6 w-6 mr-2 text-blue-600" />
                  Agendar Consulta
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Selecione a data, horário e tipo de consulta desejados
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

                <form onSubmit={handleSchedule} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Date Selection */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900">Escolha a Data</h3>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={isDateDisabled}
                        className="rounded-lg border-2 border-blue-100 p-3"
                      />
                    </div>

                    {/* Time and Type Selection */}
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Horário Disponível
                        </h3>
                        <Select
                          value={selectedTime}
                          onValueChange={setSelectedTime}
                          disabled={!hasAvailability}
                        >
                          <SelectTrigger className="border-2 border-blue-100 focus:border-blue-300">
                            <SelectValue placeholder={
                              hasAvailability
                                ? "Selecione um horário"
                                : "Nenhum horário disponível - Lista de espera"
                            } />
                          </SelectTrigger>
                          {hasAvailability && (
                            <SelectContent>
                              {availableTimes.map((time) => (
                                <SelectItem key={time} value={time}>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-blue-600" />
                                    {time.split(":")[0] + ":" + time.split(":")[1]}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          )}
                        </Select>
                        {!hasAvailability && (
                          <p className="text-sm text-yellow-600 mt-2">
                            Não há horários disponíveis para esta data. Ao confirmar, você será adicionado à lista de espera.
                          </p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Tipo de Consulta
                        </h3>
                        <Select value={appointmentType} onValueChange={setAppointmentType}>
                          <SelectTrigger className="border-2 border-blue-100 focus:border-blue-300">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {appointmentTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Observações (Opcional)
                        </h3>
                        <Textarea
                          placeholder="Descreva brevemente o motivo da consulta ou sintomas..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={4}
                          className="border-2 border-blue-100 focus:border-blue-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  {selectedDate && (hasAvailability ? selectedTime : true) && appointmentType && (
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-100">
                      <h4 className="font-semibold text-gray-900 mb-2">Resumo da Consulta:</h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p>
                          <strong>Data:</strong> {selectedDate.toLocaleDateString("pt-BR")}
                        </p>
                        {hasAvailability && (
                          <p>
                            <strong>Horário:</strong> {selectedTime}
                          </p>
                        )}
                        {!hasAvailability && (
                          <p>
                            <strong>Situação:</strong> Lista de espera
                          </p>
                        )}
                        <p>
                          <strong>Tipo:</strong>{" "}
                          {appointmentTypes.find((t) => t.value === appointmentType)?.label}
                        </p>
                        {notes && (
                          <p>
                            <strong>Observações:</strong> {notes}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isLoading || !selectedDate || (hasAvailability && !selectedTime) || !appointmentType}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isLoading
                        ? "Processando..."
                        : hasAvailability
                          ? "Agendar Consulta"
                          : "Entrar na Lista de Espera"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}