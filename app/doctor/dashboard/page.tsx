"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Star, Bell, User, LogOut, Stethoscope } from "lucide-react"

export default function DoctorDashboard() {
  const router = useRouter()
  const [doctor, setDoctor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [todayAppointments, setTodayAppointments] = useState([
    {
      id: 1,
      patient: "João Silva",
      age: 35,
      time: "09:00",
      type: "Consulta",
      status: "confirmado",
      healthPlan: "Unimed",
      patientInitials: "JS",
    },
    {
      id: 2,
      patient: "Maria Santos",
      age: 42,
      time: "10:30",
      type: "Retorno",
      status: "confirmado",
      healthPlan: "Bradesco Saúde",
      patientInitials: "MS",
    },
  ])

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    if (userType !== "doctor") {
      router.push("/login")
      return
    }

    async function fetchDoctor() {
      try {
        const token = localStorage.getItem("authToken")
        const id = localStorage.getItem("userId")
        if (!token || !id) {
          setError("Usuário não autenticado")
          setLoading(false)
          return
        }

        const res = await fetch(`/api/doctor/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (res.status === 404) {
          setError("Médico não encontrado. Por favor, faça login novamente.")
          setLoading(false)
          return
        }

        if (!res.ok) {
          throw new Error(`Erro ao buscar dados do médico: ${res.statusText}`)
        }

        const data = await res.json()

        setDoctor({
          name: data.name || "Nome não informado",
          specialty: data.speciality || "Especialidade não informada", // <- alterado aqui
          email: data.email || "Email não informado",
          rating: data.rating ?? 0,
          totalReviews: data.totalReviews ?? 0,
          healthPlan: data.healthPlan || "Plano não informado",
          initials: data.name
            ? data.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
            : "MD",
        })

        setLoading(false)
      } catch (err: any) {
        setError(err.message || "Erro desconhecido")
        setLoading(false)
      }
    }

    fetchDoctor()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("userId")
    localStorage.removeItem("authToken")
    router.push("/")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado":
        return "bg-green-100 text-green-800 border-green-200"
      case "pendente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelado":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) return <p className="text-center mt-8">Carregando dados do médico...</p>
  if (error) return <p className="text-center mt-8 text-red-600">Erro: {error}</p>
  if (!doctor) return <p className="text-center mt-8">Nenhum dado do médico disponível.</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-3 rounded-xl shadow-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  MediConnect
                </h1>
                <p className="text-sm text-gray-600">Dashboard do Médico</p>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-blue-600 hover:bg-blue-50">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-2 border-blue-100">
              <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-2xl font-bold">{doctor.initials}</span>
                </div>
                <CardTitle className="text-gray-900">{doctor.name}</CardTitle>
                <CardDescription className="text-blue-600 font-medium">{doctor.specialty}</CardDescription>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-semibold text-gray-900">{doctor.rating}</span>
                    </div>
                    <span className="text-gray-600">({doctor.totalReviews} avaliações)</span>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Plano Aceito</p>
                    <p className="text-center text-blue-700 font-semibold bg-blue-100 rounded px-3 py-1 text-sm max-w-xs mx-auto">
                      {doctor.healthPlan}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-600">{doctor.email}</p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                    asChild
                  >
                    <Link href="/doctor/profile">
                      <User className="h-4 w-4 mr-2" />
                      Editar Perfil
                    </Link>
                  </Button>
                </CardContent>
              </CardHeader>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl">
              <h2 className="text-3xl font-bold mb-2">Bem-vindo, {doctor.name.split(" ")[0]}!</h2>
              <p className="text-blue-100">Gerencie sua agenda e acompanhe seus pacientes.</p>
            </div>

            <Card className="shadow-xl border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="flex items-center text-gray-900">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Consultas de Hoje
                </CardTitle>
                <CardDescription>{new Date().toLocaleDateString("pt-BR")}</CardDescription>
              </CardHeader>
              <CardContent>
                {todayAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {todayAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border-2 border-blue-100 rounded-lg p-4 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{appointment.patientInitials}</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-semibold text-gray-900">{appointment.patient}</h4>
                                <Badge variant="outline" className="border-blue-200 text-blue-600">
                                  {appointment.age} anos
                                </Badge>
                                <Badge variant="outline" className="border-blue-300 text-blue-700">
                                  {appointment.type}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {appointment.time}
                                </div>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 mr-1" />
                                  {appointment.healthPlan}
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                          >
                            Iniciar Consulta
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                          >
                            Ver Histórico
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent"
                          >
                            Reagendar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-gray-500">Nenhuma consulta agendada para hoje</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
