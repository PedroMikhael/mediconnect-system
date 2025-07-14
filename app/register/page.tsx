"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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
    healthPlan: "",
  })

  const [doctorForm, setDoctorForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    crm: "",
    specialty: "",
    phone: "",
    healthPlans: [] as string[],
    description: "",
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
  ]

  const healthPlans = ["Unimed", "Bradesco Saúde", "SulAmérica", "Amil", "NotreDame"]

  const handlePatientRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
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

    // Mock registration - replace with actual API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call
      setSuccess("Cadastro realizado com sucesso! Redirecionando...")

      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      setError("Erro ao criar conta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDoctorRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
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

    // Mock registration - replace with actual API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call
      setSuccess("Cadastro realizado com sucesso! Aguarde aprovação. Redirecionando...")

      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      setError("Erro ao criar conta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleHealthPlanToggle = (plan: string) => {
    setDoctorForm((prev) => ({
      ...prev,
      healthPlans: prev.healthPlans.includes(plan)
        ? prev.healthPlans.filter((p) => p !== plan)
        : [...prev.healthPlans, plan],
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-25 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
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

              <TabsContent value="patient" className="space-y-4">
                <form onSubmit={handlePatientRegister} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-name" className="text-blue-700">
                        Nome Completo
                      </Label>
                      <Input
                        id="patient-name"
                        placeholder="Seu nome completo"
                        value={patientForm.name}
                        onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patient-age" className="text-blue-700">
                        Idade
                      </Label>
                      <Input
                        id="patient-age"
                        type="number"
                        placeholder="Sua idade"
                        value={patientForm.age}
                        onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient-email" className="text-blue-700">
                      Email
                    </Label>
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
                    <Label htmlFor="patient-phone" className="text-blue-700">
                      Telefone
                    </Label>
                    <Input
                      id="patient-phone"
                      placeholder="(11) 99999-9999"
                      value={patientForm.phone}
                      onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient-health-plan" className="text-blue-700">
                      Plano de Saúde
                    </Label>
                    <Select
                      value={patientForm.healthPlan}
                      onValueChange={(value) => setPatientForm({ ...patientForm, healthPlan: value })}
                    >
                      <SelectTrigger className="bg-blue-50 border-blue-300">
                        <SelectValue placeholder="Selecione seu plano (opcional)" />
                      </SelectTrigger>
                      <SelectContent className="bg-blue-50 border-blue-300">
                        <SelectItem value="none" className="text-blue-700 hover:bg-blue-100">
                          Não tenho plano
                        </SelectItem>
                        {healthPlans.map((plan) => (
                          <SelectItem key={plan} value={plan} className="text-blue-700 hover:bg-blue-100">
                            {plan}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-password" className="text-blue-700">
                        Senha
                      </Label>
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
                      <Label htmlFor="patient-confirm-password" className="text-blue-700">
                        Confirmar Senha
                      </Label>
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

              <TabsContent value="doctor" className="space-y-4">
                <form onSubmit={handleDoctorRegister} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor-name" className="text-blue-700">
                        Nome Completo
                      </Label>
                      <Input
                        id="doctor-name"
                        placeholder="Dr(a). Seu nome completo"
                        value={doctorForm.name}
                        onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="doctor-crm" className="text-blue-700">
                        CRM
                      </Label>
                      <Input
                        id="doctor-crm"
                        placeholder="CRM/UF 123456"
                        value={doctorForm.crm}
                        onChange={(e) => setDoctorForm({ ...doctorForm, crm: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor-specialty" className="text-blue-700">
                      Especialidade
                    </Label>
                    <Select
                      value={doctorForm.specialty}
                      onValueChange={(value) => setDoctorForm({ ...doctorForm, specialty: value })}
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor-email" className="text-blue-700">
                        Email
                      </Label>
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
                      <Label htmlFor="doctor-phone" className="text-blue-700">
                        Telefone
                      </Label>
                      <Input
                        id="doctor-phone"
                        placeholder="(11) 99999-9999"
                        value={doctorForm.phone}
                        onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-blue-700">Planos de Saúde Aceitos</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {healthPlans.map((plan) => (
                        <label key={plan} className="flex items-center space-x-2 cursor-pointer text-blue-700">
                          <input
                            type="checkbox"
                            checked={doctorForm.healthPlans.includes(plan)}
                            onChange={() => handleHealthPlanToggle(plan)}
                            className="rounded border-blue-300 focus:ring-blue-500"
                          />
                          <span className="text-sm">{plan}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor-description" className="text-blue-700">
                      Descrição Profissional
                    </Label>
                    <Textarea
                      id="doctor-description"
                      placeholder="Descreva sua experiência e especialidades..."
                      value={doctorForm.description}
                      onChange={(e) => setDoctorForm({ ...doctorForm, description: e.target.value })}
                      rows={3}
                      className="border-blue-300 focus-visible:ring-blue-500"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor-password" className="text-blue-700">
                        Senha
                      </Label>
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
                      <Label htmlFor="doctor-confirm-password" className="text-blue-700">
                        Confirmar Senha
                      </Label>
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

                <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
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
