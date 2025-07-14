"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Clock, MapPin, Star, CalendarIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ScheduleAppointmentProps {
  params: {
    doctorId: string
  }
}

export default function ScheduleAppointment({ params }: ScheduleAppointmentProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState("")
  const [appointmentType, setAppointmentType] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // Mock doctor data
  const doctor = {
    id: params.doctorId,
    name: "Dr. Ana Silva",
    specialty: "Cardiologia",
    rating: 4.8,
    reviews: 127,
    healthPlans: ["Unimed", "Bradesco Saúde", "SulAmérica"],
    location: "Clínica CardioVida - São Paulo, SP",
    initials: "AS",
    description: "Especialista em cardiologia preventiva com mais de 15 anos de experiência.",
    consultationFee: 280,
  }

  // Mock available times
  const availableTimes = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ]

  const appointmentTypes = [
    { value: "consulta", label: "Consulta" },
    { value: "retorno", label: "Retorno" },
    { value: "exame", label: "Avaliação de Exames" },
    { value: "preventiva", label: "Consulta Preventiva" },
  ]

  useEffect(() => {
    // Check if user is logged in
    const userType = localStorage.getItem("userType")
    if (userType !== "patient") {
      router.push("/login")
    }
  }, [router])

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!selectedDate || !selectedTime || !appointmentType) {
      setError("Por favor, preencha todos os campos obrigatórios")
      setIsLoading(false)
      return
    }

    // Mock scheduling - replace with actual API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSuccess("Consulta agendada com sucesso! Você receberá uma confirmação por email.")

      setTimeout(() => {
        router.push("/patient/dashboard")
      }, 3000)
    } catch (err) {
      setError("Erro ao agendar consulta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  // Disable past dates
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
                  <span className="text-white text-2xl font-bold">{doctor.initials}</span>
                </div>
                <CardTitle className="text-xl text-gray-900">{doctor.name}</CardTitle>
                <CardDescription className="text-lg font-medium text-blue-600">{doctor.specialty}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-semibold text-gray-900">{doctor.rating}</span>
                  </div>
                  <span className="text-gray-600">({doctor.reviews} avaliações)</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{doctor.location}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Planos aceitos:</p>
                  <div className="flex flex-wrap gap-1">
                    {doctor.healthPlans.map((plan) => (
                      <Badge
                        key={plan}
                        className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 border-blue-300"
                      >
                        {plan}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">Valor da consulta:</p>
                  <p className="text-2xl font-bold text-blue-600">R$ {doctor.consultationFee}</p>
                  <p className="text-xs text-gray-600">*Valor pode variar conforme plano de saúde</p>
                </div>
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
                        <h3 className="text-lg font-semibold text-gray-900">Horário Disponível</h3>
                        <Select value={selectedTime} onValueChange={setSelectedTime}>
                          <SelectTrigger className="border-2 border-blue-100 focus:border-blue-300">
                            <SelectValue placeholder="Selecione um horário" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTimes.map((time) => (
                              <SelectItem key={time} value={time}>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-2 text-blue-600" />
                                  {time}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900">Tipo de Consulta</h3>
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
                        <h3 className="text-lg font-semibold text-gray-900">Observações (Opcional)</h3>
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
                  {selectedDate && selectedTime && appointmentType && (
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-100">
                      <h4 className="font-semibold text-gray-900 mb-2">Resumo da Consulta:</h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p>
                          <strong>Data:</strong> {selectedDate.toLocaleDateString("pt-BR")}
                        </p>
                        <p>
                          <strong>Horário:</strong> {selectedTime}
                        </p>
                        <p>
                          <strong>Tipo:</strong> {appointmentTypes.find((t) => t.value === appointmentType)?.label}
                        </p>
                        <p>
                          <strong>Médico:</strong> {doctor.name} - {doctor.specialty}
                        </p>
                        <p>
                          <strong>Local:</strong> {doctor.location}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white py-3 text-lg font-semibold shadow-lg"
                    >
                      {isLoading ? "Agendando..." : "Confirmar Agendamento"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
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
  )
}
