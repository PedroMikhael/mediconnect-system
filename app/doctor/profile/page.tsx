"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, Trash2 } from "lucide-react"

export default function DoctorProfile() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialty: "",
    healthPlan: "",
    password: "",
    confirmPassword: "",
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

  const healthPlansOptions = [
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

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const token = localStorage.getItem("authToken")
    const id = localStorage.getItem("userId")

    if (userType !== "doctor" || !token || !id) {
      router.push("/login")
      return
    }

    async function fetchData() {
      try {
        const res = await fetch(`/api/doctor/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error("Erro ao buscar dados")

        const data = await res.json()

        setFormData({
          name: data.name || "",
          email: data.email || "",
          specialty: data.specialty || "",
          healthPlan: data.healthPlan || "",
          password: "",
          confirmPassword: "",
        })
      } catch {
        setError("Erro ao carregar dados do médico.")
      }
    }

    fetchData()
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    const token = localStorage.getItem("authToken")
    const id = localStorage.getItem("userId")

    if (!token || !id) {
      setError("Usuário não autenticado.")
      setIsLoading(false)
      return
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.")
      setIsLoading(false)
      return
    }

    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        specialty: formData.specialty,
        healthPlan: formData.healthPlan,
      }

      if (formData.password) {
        payload.password = formData.password
      }

      const res = await fetch(`/api/doctor/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error()

      setSuccess("Perfil atualizado com sucesso!")
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }))
      setTimeout(() => setSuccess(""), 3000)
    } catch {
      setError("Erro ao atualizar perfil. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    const confirm = window.confirm("Tem certeza que deseja excluir sua conta?")
    if (!confirm) return

    const token = localStorage.getItem("authToken")
    const id = localStorage.getItem("userId")

    try {
      const res = await fetch(`/api/doctor/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error()

      localStorage.clear()
      router.push("/login")
    } catch {
      setError("Erro ao deletar a conta. Tente novamente.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/doctor/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Meu Perfil Médico
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
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
                  <CardTitle className="text-2xl text-gray-900">
                    Editar Informações
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Atualize suas informações profissionais e senha (opcional)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
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
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidade Principal</Label>
                  <Select
                    value={formData.specialty}
                    onValueChange={(value) => handleInputChange("specialty", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {formData.specialty || "Selecione a especialidade"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="healthPlan">Plano de Saúde Principal</Label>
                  <Select
                    value={formData.healthPlan}
                    onValueChange={(value) => handleInputChange("healthPlan", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {formData.healthPlan || "Selecione o plano de saúde"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {healthPlansOptions.map((plan) => (
                        <SelectItem key={plan} value={plan}>
                          {plan}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Alterar Senha (opcional)
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Nova Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="Digite a nova senha"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        placeholder="Confirme a nova senha"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 font-semibold shadow-lg"
                  >
                    <Save className="w-5 h-5 mr-2 inline" />
                    {isLoading ? "Salvando..." : "Salvar Alterações"}
                  </Button>

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <Trash2 className="w-5 h-5 mr-2 inline" />
                    Deletar Conta
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