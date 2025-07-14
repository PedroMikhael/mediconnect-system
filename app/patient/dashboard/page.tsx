"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Star, Plus, Search, Bell, User, LogOut, Heart } from "lucide-react"
import { id } from "date-fns/locale"

export default function PatientDashboard() {
  const router = useRouter()
  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: 1,
      doctor: "Dr. Ana Silva",
      specialty: "Cardiologia",
      date: "2024-01-15",
      time: "14:30",
      location: "Clínica São Paulo",
      status: "confirmado",
      doctorInitials: "AS",
    },
    {
      id: 2,
      doctor: "Dra. Maria Oliveira",
      specialty: "Dermatologia",
      date: "2024-01-20",
      time: "10:00",
      location: "Hospital Central",
      status: "pendente",
      doctorInitials: "MO",
    },
  ])

  const [recentConsultations, setRecentConsultations] = useState([
    {
      id: 1,
      doctor: "Dr. Carlos Santos",
      specialty: "Ortopedia",
      date: "2024-01-05",
      rating: 5,
      notes: "Consulta excelente, médico muito atencioso.",
      doctorInitials: "CS",
    },
    {
      id: 2,
      doctor: "Dr. Pedro Lima",
      specialty: "Clínico Geral",
      date: "2023-12-20",
      rating: 4,
      notes: "Boa consulta, diagnóstico preciso.",
      doctorInitials: "PL",
    },
  ])

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    if (userType !== "patient") {
      router.push("/login")
      return
    }

    async function fetchPatient() {
      try {
        const token = localStorage.getItem("authToken")
        const id = localStorage.getItem("userId")
        if (!token || !id) {
          setError("Usuário não autenticado")
          setLoading(false)
          return
        }
        if (!token) {
          setError("Usuário não autenticado")
          setLoading(false)
          return
        }

        const res = await fetch(`/api/patient/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (res.status === 404) {
          setError("Paciente não encontrado. Por favor, faça login novamente.")
          setLoading(false)
          return
        }

        if (!res.ok) {
          throw new Error(`Erro ao buscar dados do paciente: ${res.statusText}`)
        }

        const data = await res.json()

        setPatient({
          name: data.name || "Nome não informado",
          birthDate: data.birthDate || "Não informado",
          healthPlan: data.healthPlan || "Não informado",
          email: data.email || "Não informado",
          initials: data.name
            ? data.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
            : "NA",
        })

        setLoading(false)
      } catch (err: any) {
        setError(err.message || "Erro desconhecido")
        setLoading(false)
      }
    }

    fetchPatient()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("userId")
    localStorage.removeItem("authToken")
    router.push("/")
  }

  // Calcula idade com base na data de nascimento
 function calculateAge(birthDateStr: string) {
  if (!birthDateStr || birthDateStr === "Não informado") return "Não informado"
  const birthDate = new Date(birthDateStr)
  const today = new Date()

  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  const dayDiff = today.getDate() - birthDate.getDate()

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--
  }

  return age
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

  if (loading) return <p className="text-center mt-8">Carregando dados do paciente...</p>
  if (error) return <p className="text-center mt-8 text-red-600">Erro: {error}</p>
  if (!patient) return <p className="text-center mt-8">Nenhum dado do paciente disponível.</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-3 rounded-xl shadow-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  MediConnect
                </h1>
                <p className="text-sm text-gray-600">Dashboard do Paciente</p>
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
                  <span className="text-white text-2xl font-bold">{patient.initials}</span>
                </div>
                <CardTitle className="text-gray-900">{patient.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {calculateAge(patient.birthDate)} anos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Plano de Saúde</p>
                  <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200">
                    {patient.healthPlan}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-600">{patient.email}</p>
                </div>
                <div>
              
                </div>
                <Button
                  variant="outline"
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                  asChild
                >
                  <Link href="/patient/profile">
                    <User className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl">
              <h2 className="text-3xl font-bold mb-2">Bem-vindo, {patient.name.split(" ")[0]}!</h2>
              <p className="text-blue-100">Gerencie suas consultas e acompanhe seu histórico médico.</p>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-full">
                      <Search className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Buscar Médicos</h3>
                      <p className="text-sm text-gray-600">Encontre especialistas</p>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg"
                    asChild
                  >
                    <Link href="/patient/search">Buscar Agora</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-3 rounded-full">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Agendar Consulta</h3>
                      <p className="text-sm text-gray-600">Marque uma consulta</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
                    asChild
                  >
                    <Link href="/patient/search">Agendar</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Appointments */}
            <Card className="shadow-xl border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="flex items-center text-gray-900">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Próximas Consultas
                </CardTitle>
                <CardDescription>Suas consultas agendadas para os próximos dias</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border-2 border-blue-100 rounded-lg p-4 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{appointment.doctorInitials}</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-semibold text-gray-900">{appointment.doctor}</h4>
                                <Badge variant="outline" className="border-blue-200 text-blue-600">
                                  {appointment.specialty}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {new Date(appointment.date).toLocaleDateString("pt-BR")}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {appointment.time}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {appointment.location}
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                          >
                            Reagendar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma consulta agendada</p>
                    <Button
                      className="mt-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                      asChild
                    >
                      <Link href="/patient/search">Agendar Primeira Consulta</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Consultations */}
            <Card className="shadow-xl border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="flex items-center text-gray-900">
                  <Star className="h-5 w-5 mr-2 text-blue-600" />
                  Consultas Recentes
                </CardTitle>
                <CardDescription>Histórico das suas últimas consultas</CardDescription>
              </CardHeader>
              <CardContent>
                {recentConsultations.length > 0 ? (
                  <div className="space-y-4">
                    {recentConsultations.map((consultation) => (
                      <div key={consultation.id} className="border-2 border-blue-100 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{consultation.doctorInitials}</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{consultation.doctor}</h4>
                              <p className="text-sm text-gray-600">{consultation.specialty}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              {new Date(consultation.date).toLocaleDateString("pt-BR")}
                            </p>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < consultation.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        {consultation.notes && (
                          <p className="text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-100">
                            {consultation.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma consulta realizada ainda</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
