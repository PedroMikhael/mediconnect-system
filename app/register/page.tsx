"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Importações dos serviços
import { doctorService, type DoctorRegisterRequest } from "../api/services/doctorService"
import { patientService, type PatientRegisterRequest } from "../api/services/patientService"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const [patientForm, setPatientForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    phone: "",
    healthPlan: "", // string simples, vazio se não escolher plano
    birthDate: "", // Para data de nascimento
  })

  const [doctorForm, setDoctorForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialty: "",
    healthPlan: "", // string simples
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
    "Oftalmologia",
    "Urologia",
    "Reumatologia",
    "Gastroenterologia",
    "Pneumologia",
  ]

  const healthPlans = [
    "Unimed",
    "Bradesco Saúde",
    "SulAmérica",
    "Amil",
    "NotreDame Intermédica",
    "Hapvida",
    "São Francisco Saúde",
    "Porto Seguro Saúde",
    "Não tenho plano",
  ]

  const handlePatientHealthPlanChange = (value: string) => {
    setPatientForm({
      ...patientForm,
      healthPlan: value === "Não tenho plano" ? "" : value,
    })
  }

  const handlePatientRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (patientForm.password !== patientForm.confirmPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }
    if (patientForm.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setIsLoading(false)
      return
    }

    const dataToSubmit: PatientRegisterRequest = {
      name: patientForm.name,
      email: patientForm.email,
      password: patientForm.password,
      healthPlan: patientForm.healthPlan,
      dateOfBirth: patientForm.birthDate,
    }

    try {
      await patientService.register(dataToSubmit)
      setSuccess("Cadastro realizado com sucesso! Redirecionando...")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDoctorRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (doctorForm.password !== doctorForm.confirmPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }
    if (doctorForm.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setIsLoading(false)
      return
    }

    const dataToSubmit: DoctorRegisterRequest = {
      name: doctorForm.name,
      email: doctorForm.email,
      password: doctorForm.password,
      speciality: doctorForm.specialty,
      healthPlan: doctorForm.healthPlan,
    }

    try {
      await doctorService.register(dataToSubmit)
      setSuccess("Cadastro realizado com sucesso! Aguarde aprovação. Redirecionando...")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-25 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-blue-900">MediConnect</h1>
          </Link>
          <h2 className="text-3xl font-bold text-blue-900">Criar sua conta</h2>
          <p className="text-blue-600 mt-2">Junte-se à nossa plataforma de saúde</p>
        </div>

        <Card className="shadow-xl border-blue-300">
          <CardHeader>
            <CardTitle className="text-blue-900">Cadastro</CardTitle>
            <CardDescription className="text-blue-600">Escolha o tipo de conta que deseja criar</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="patient" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="patient"
                  className="text-blue-700 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
                >
                  Paciente
                </TabsTrigger>
                <TabsTrigger
                  value="doctor"
                  className="text-blue-700 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
                >
                  Médico
                </TabsTrigger>
              </TabsList>

              {error && (
                <Alert className="mt-4 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="mt-4 border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {/* FORMULÁRIO DO PACIENTE */}
              <TabsContent value="patient" className="space-y-4 pt-4">
                <form onSubmit={handlePatientRegister} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-name" className="text-blue-700">Nome Completo</Label>
                      <Input
                        id="patient-name"
                        placeholder="Seu nome completo"
                        value={patientForm.name}
                        onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient-email" className="text-blue-700">Email</Label>
                    <Input
                      id="patient-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={patientForm.email}
                      onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient-birthDate" className="text-blue-700">Data de Nascimento</Label>
                    <Input
                      id="patient-birthDate"
                      type="date"
                      value={patientForm.birthDate || ""}
                      onChange={(e) => setPatientForm({ ...patientForm, birthDate: e.target.value })}
                      required
                      className="border-2 border-blue-100 focus:border-blue-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient-health-plan" className="text-blue-700">Plano de Saúde</Label>
                    <Select
                      value={patientForm.healthPlan || "none"}
                      onValueChange={handlePatientHealthPlanChange}
                    >
                      <SelectTrigger className="bg-blue-50 border-blue-300">
                        <SelectValue placeholder="Selecione seu plano (opcional)" />
                      </SelectTrigger>
                      <SelectContent className="bg-blue-50 border-blue-300">
                        <SelectItem value="none" className="text-blue-700 hover:bg-blue-100">
                          Nenhum
                        </SelectItem>
                        {healthPlans
                          .filter((plan) => plan !== "Não tenho plano")
                          .map((plan) => (
                            <SelectItem key={plan} value={plan} className="text-blue-700 hover:bg-blue-100">
                              {plan}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-password" className="text-blue-700">Senha</Label>
                      <div className="relative">
                        <Input
                          id="patient-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 6 caracteres"
                          value={patientForm.password}
                          onChange={(e) => setPatientForm({ ...patientForm, password: e.target.value })}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-blue-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patient-confirm-password" className="text-blue-700">Confirmar Senha</Label>
                      <Input
                        id="patient-confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirme sua senha"
                        value={patientForm.confirmPassword}
                        onChange={(e) => setPatientForm({ ...patientForm, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Criando conta..." : "Criar Conta de Paciente"}
                  </Button>
                </form>
              </TabsContent>

              {/* FORMULÁRIO DO MÉDICO */}
              <TabsContent value="doctor" className="space-y-4 pt-4">
                <form onSubmit={handleDoctorRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-name" className="text-blue-700">Nome Completo</Label>
                    <Input
                      id="doctor-name"
                      placeholder="Dr(a). Seu nome completo"
                      value={doctorForm.name}
                      onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor-specialty" className="text-blue-700">Especialidade</Label>
                    <Select
                      value={doctorForm.specialty}
                      onValueChange={(value) => setDoctorForm({ ...doctorForm, specialty: value })}
                      required
                    >
                      <SelectTrigger className="bg-blue-50 border-blue-300">
                        <SelectValue placeholder="Selecione sua especialidade" />
                      </SelectTrigger>
                      <SelectContent className="bg-blue-50 border-blue-300">
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty} className="text-blue-700 hover:bg-blue-100">
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor-email" className="text-blue-700">Email</Label>
                    <Input
                      id="doctor-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={doctorForm.email}
                      onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor-health-plan" className="text-blue-700">Plano de Saúde Atendido</Label>
                    <Select
                      value={doctorForm.healthPlan}
                      onValueChange={(value) => setDoctorForm({ ...doctorForm, healthPlan: value })}
                    >
                      <SelectTrigger className="bg-blue-50 border-blue-300">
                        <SelectValue placeholder="Selecione o principal plano atendido" />
                      </SelectTrigger>
                      <SelectContent className="bg-blue-50 border-blue-300">
                        {healthPlans
                          .filter((plan) => plan !== "Não tenho plano")
                          .map((plan) => (
                            <SelectItem key={plan} value={plan} className="text-blue-700 hover:bg-blue-100">
                              {plan}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor-password" className="text-blue-700">Senha</Label>
                      <div className="relative">
                        <Input
                          id="doctor-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 6 caracteres"
                          value={doctorForm.password}
                          onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-blue-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor-confirm-password" className="text-blue-700">Confirmar Senha</Label>
                      <Input
                        id="doctor-confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirme sua senha"
                        value={doctorForm.confirmPassword}
                        onChange={(e) => setDoctorForm({ ...doctorForm, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Criando conta..." : "Criar Conta de Médico"}
                  </Button>
                </form>
                <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg mt-4">
                  <p className="font-medium">Nota:</p>
                  <p>Contas de médicos passam por um processo de verificação antes da aprovação.</p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-blue-600">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                  Faça login aqui
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
