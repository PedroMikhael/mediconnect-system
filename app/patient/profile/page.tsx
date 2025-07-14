// Novo PatientProfile.tsx com confirmação de senha e opção de deletar conta

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, Trash2, User } from "lucide-react"

export default function PatientProfile() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    healthPlan: "",
  })

  const healthPlans = ["Unimed", "Bradesco Saúde", "SulAmérica", "Amil", "NotreDame", "Particular"]

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const token = localStorage.getItem("authToken")
    const id = localStorage.getItem("userId")

    if (userType !== "patient" || !token || !id) {
      router.push("/login")
      return
    }

    async function fetchData() {
      try {
        const res = await fetch(`/api/patient/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error("Erro ao buscar dados")

        const data = await res.json()

        setFormData((prev) => ({
          ...prev,
          name: data.name || "",
          email: data.email || "",
          birthDate: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "",
          healthPlan: data.healthPlan || "",
        }))
      } catch (err) {
        setError("Erro ao carregar dados do paciente.")
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

  const updateData: Record<string, string | null> = {
    name: formData.name,
    email: formData.email,
    dateOfBirth: formData.birthDate,
    healthPlan: formData.healthPlan === "none" ? null : formData.healthPlan,
  }

  // Só inclui a senha se ela for preenchida
  if (formData.password.trim() !== "") {
    updateData.password = formData.password
  }

  try {
    const res = await fetch(`/api/patient/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })

    if (!res.ok) throw new Error()

    setSuccess("Perfil atualizado com sucesso!")
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
      const res = await fetch(`/api/patient/${id}`, {
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
            <Link href="/patient/dashboard">
              <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Meu Perfil
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-2 border-blue-100">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">
                    {formData.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-900">Editar Informações</CardTitle>
                  <CardDescription className="text-gray-600">Atualize seus dados pessoais</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Nova Senha (opcional)</Label>
                  <Input id="password" type="password" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={(e) => handleInputChange("confirmPassword", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input id="birthDate" type="date" value={formData.birthDate} onChange={(e) => handleInputChange("birthDate", e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label>Plano de Saúde</Label>
                  <Select value={formData.healthPlan} onValueChange={(value) => handleInputChange("healthPlan", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu plano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Não tenho plano</SelectItem>
                      {healthPlans.map((plan) => (
                        <SelectItem key={plan} value={plan}>{plan}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full bg-blue-700 text-white font-semibold">
                  <Save className="w-4 h-4 mr-2" /> {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </form>

              <Button onClick={handleDelete} variant="destructive" className="w-full mt-6">
                <Trash2 className="w-4 h-4 mr-2" /> Deletar Conta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
