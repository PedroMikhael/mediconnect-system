"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, User, Save, Stethoscope, MapPin, Clock, Star } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DoctorProfile() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "Dr. Ana Silva",
    email: "ana.silva@email.com",
    phone: "(11) 99999-9999",
    crm: "CRM/SP 123456",
    specialty: "Cardiologia",
    subSpecialties: ["Cardiologia Preventiva", "Ecocardiografia"],
    description:
      "Especialista em cardiologia preventiva com mais de 15 anos de experiência. Atuo no diagnóstico e tratamento de doenças cardiovasculares, com foco em prevenção.",
    education: "Formada pela USP, Residência em Cardiologia no InCor",
    experience: "15",
    healthPlans: ["Unimed", "Bradesco Saúde", "SulAmérica"],
    consultationFee: "280",
    address: "Rua dos Médicos, 456",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
    clinicName: "Clínica CardioVida",
    workingHours: {
      monday: { start: "08:00", end: "17:00", active: true },
      tuesday: { start: "08:00", end: "17:00", active: true },
      wednesday: { start: "08:00", end: "17:00", active: true },
      thursday: { start: "08:00", end: "17:00", active: true },
      friday: { start: "08:00", end: "17:00", active: true },
      saturday: { start: "08:00", end: "12:00", active: false },
      sunday: { start: "08:00", end: "12:00", active: false },
    },
  })

  const specialties = [
    "Cardiologia",
    "Dermatologia",
    "Ortopedia",
    "Pediatria",
    "Ginecologia",
    "Neurologia",
    "Psiquiatria",
    "Clínico Geral",
    "Endocrinologia",
    "Gastroenterologia",
  ]

  const healthPlans = ["Unimed", "Bradesco Saúde", "SulAmérica", "Amil", "NotreDame"]
  const states = ["SP", "RJ", "MG", "RS", "PR", "SC", "BA", "GO", "DF", "ES"]

  useEffect(() => {
    // Check if user is logged in as doctor
    const userType = localStorage.getItem("userType")
    if (userType !== "doctor") {
      router.push("/login")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSuccess("Perfil atualizado com sucesso!")

      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (err) {
      setError("Erro ao atualizar perfil. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleHealthPlanToggle = (plan: string) => {
    setFormData((prev) => ({
      ...prev,
      healthPlans: prev.healthPlans.includes(plan)
        ? prev.healthPlans.filter((p) => p !== plan)
        : [...prev.healthPlans, plan],
    }))
  }

  const handleWorkingHoursChange = (day: string, field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day as keyof typeof prev.workingHours],
          [field]: value,
        },
      },
    }))
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
                Meu Perfil Médico
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-xl border-2 border-blue-100">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">
                    {formData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-900">Perfil Profissional</CardTitle>
                  <CardDescription className="text-gray-600">
                    Mantenha suas informações profissionais atualizadas
                  </CardDescription>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">4.8 (127 avaliações)</span>
                  </div>
                </div>
              </div>
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

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Informações Pessoais
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="border-2 border-blue-100 focus:border-blue-300"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="crm">CRM</Label>
                      <Input
                        id="crm"
                        value={formData.crm}
                        onChange={(e) => handleInputChange("crm", e.target.value)}
                        className="border-2 border-blue-100 focus:border-blue-300"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="border-2 border-blue-100 focus:border-blue-300"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="border-2 border-blue-100 focus:border-blue-300"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Stethoscope className="h-5 w-5 mr-2 text-blue-600" />
                    Informações Profissionais
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Especialidade Principal</Label>
                      <Select
                        value={formData.specialty}
                        onValueChange={(value) => handleInputChange("specialty", value)}
                      >
                        <SelectTrigger className="border-2 border-blue-100 focus:border-blue-300">
                          <SelectValue placeholder="Selecione a especialidade" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialties.map((specialty) => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Anos de Experiência</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={formData.experience}
                        onChange={(e) => handleInputChange("experience", e.target.value)}
                        className="border-2 border-blue-100 focus:border-blue-300"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="consultationFee">Valor da Consulta (R$)</Label>
                      <Input
                        id="consultationFee"
                        type="number"
                        value={formData.consultationFee}
                        onChange={(e) => handleInputChange("consultationFee", e.target.value)}
                        className="border-2 border-blue-100 focus:border-blue-300"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clinicName">Nome da Clínica</Label>
                      <Input
                        id="clinicName"
                        value={formData.clinicName}
                        onChange={(e) => handleInputChange("clinicName", e.target.value)}
                        className="border-2 border-blue-100 focus:border-blue-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label htmlFor="description">Descrição Profissional</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="border-2 border-blue-100 focus:border-blue-300"
                      rows={4}
                      placeholder="Descreva sua experiência, especialidades e diferenciais..."
                      required
                    />
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label htmlFor="education">Formação Acadêmica</Label>
                    <Textarea
                      id="education"
                      value={formData.education}
                      onChange={(e) => handleInputChange("education", e.target.value)}
                      className="border-2 border-blue-100 focus:border-blue-300"
                      rows={3}
                      placeholder="Ex: Medicina pela USP, Residência em Cardiologia..."
                      required
                    />
                  </div>
                </div>

                {/* Health Plans */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Planos de Saúde Aceitos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {healthPlans.map((plan) => (
                      <label
                        key={plan}
                        className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border-2 border-blue-100 hover:bg-blue-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.healthPlans.includes(plan)}
                          onChange={() => handleHealthPlanToggle(plan)}
                          className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium">{plan}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Endereço do Consultório
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="border-2 border-blue-100 focus:border-blue-300"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="border-2 border-blue-100 focus:border-blue-300"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                        <SelectTrigger className="border-2 border-blue-100 focus:border-blue-300">
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">CEP</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        className="border-2 border-blue-100 focus:border-blue-300"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Horários de Atendimento
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(formData.workingHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center space-x-4 p-3 rounded-lg border-2 border-blue-100">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={hours.active}
                            onChange={(e) => handleWorkingHoursChange(day, "active", e.target.checked)}
                            className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="font-medium capitalize w-20">
                            {day === "monday" && "Segunda"}
                            {day === "tuesday" && "Terça"}
                            {day === "wednesday" && "Quarta"}
                            {day === "thursday" && "Quinta"}
                            {day === "friday" && "Sexta"}
                            {day === "saturday" && "Sábado"}
                            {day === "sunday" && "Domingo"}
                          </span>
                        </label>
                        {hours.active && (
                          <div className="flex items-center space-x-2">
                            <Input
                              type="time"
                              value={hours.start}
                              onChange={(e) => handleWorkingHoursChange(day, "start", e.target.value)}
                              className="w-32 border-2 border-blue-100 focus:border-blue-300"
                            />
                            <span className="text-gray-600">às</span>
                            <Input
                              type="time"
                              value={hours.end}
                              onChange={(e) => handleWorkingHoursChange(day, "end", e.target.value)}
                              className="w-32 border-2 border-blue-100 focus:border-blue-300"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white py-3 text-lg font-semibold shadow-lg"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {isLoading ? "Salvando..." : "Salvar Alterações"}
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
  )
}
