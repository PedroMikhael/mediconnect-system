"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Heart, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

// --- CORREÇÃO APLICADA AQUI ---
// Importa os serviços de login a partir dos nomes de arquivo corretos que você especificou.
import { loginService as patientLoginService } from "../api/services/loginPatientService"
import { loginService as doctorLoginService } from "../api/services/loginDoctorService"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (userType: "patient" | "doctor") => {
    setIsLoading(true)
    setError("")

    try {
      let response
      if (userType === "patient") {
        response = await patientLoginService.login(email, password)
      } else {
        response = await doctorLoginService.login(email, password)
      }

      // Se o login for bem-sucedido:
      // 1. Salve o token e os dados do usuário
      localStorage.setItem("authToken", response.token)
      localStorage.setItem("userId", String(response.id))
      localStorage.setItem("userType", userType)

      // 2. Redirecione para o painel apropriado
      // (ajuste a rota "/dashboard" se necessário)
      router.push(`/${userType}/dashboard`)

    } catch (err: any) {
      setError(err.message || "Falha no login. Verifique suas credenciais.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-25 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-blue-900">MediConnect</h1>
          </Link>
          <h2 className="text-3xl font-bold text-blue-900">Acesse sua Conta</h2>
          <p className="text-blue-600 mt-2">Que bom te ver de volta!</p>
        </div>

        <Card className="shadow-xl border-blue-300">
          <CardHeader>
            <CardTitle className="text-blue-900">Login</CardTitle>
            <CardDescription className="text-blue-600">
              Selecione seu tipo de conta e insira suas credenciais.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="patient" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="patient"
                  className="text-blue-700 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
                >
                  Sou Paciente
                </TabsTrigger>
                <TabsTrigger
                  value="doctor"
                  className="text-blue-700 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
                >
                  Sou Médico
                </TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-blue-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-blue-700">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
              </div>

              <TabsContent value="patient">
                <Button onClick={() => handleLogin('patient')} className="w-full mt-6 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar como Paciente"}
                </Button>
              </TabsContent>
              <TabsContent value="doctor">
                <Button onClick={() => handleLogin('doctor')} className="w-full mt-6 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar como Médico"}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-blue-600">
                Não tem uma conta?{" "}
                <Link href="/register" className="text-blue-600 hover:underline font-medium">
                  Cadastre-se aqui
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}