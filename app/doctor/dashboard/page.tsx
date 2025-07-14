"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Star, Bell, User, LogOut, Stethoscope, Heart, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DoctorDashboard() {
  const router = useRouter()
  const [doctor, setDoctor] = useState({
    name: "Dr. Ana Silva",
    specialty: "Cardiologia",
    crm: "CRM/SP 123456",
    rating: 4.8,
    totalReviews: 127,
    healthPlans: ["Unimed", "Bradesco Saúde", "SulAmérica"],
    email: "ana.silva@email.com",
    phone: "(11) 99999-9999",
    initials: "AS",
  })

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
    {
      id: 3,
      patient: "Pedro Oliveira",
      age: 28,
      time: "14:00",
      type: "Consulta",
      status: "pendente",
      healthPlan: "Particular",
      patientInitials: "PO",
    },
  ])

  const [waitingList, setWaitingList] = useState([
    {
      id: 1,
      patient: "Carlos Lima",
      requestedDate: "2024-01-15",
      healthPlan: "SulAmérica",
      patientInitials: "CL",
    },
    {
      id: 2,
      patient: "Ana Costa",
      requestedDate: "2024-01-16",
      healthPlan: "Unimed",
      patientInitials: "AC",
    },
  ])

  const [stats, setStats] = useState({
    todayAppointments: 3,
    weeklyAppointments: 18,
    monthlyAppointments: 72,
    waitingListCount: 2,
  })

  useEffect(() => {
    // Check if user is logged in as doctor
    const userType = localStorage.getItem("userType")
    if (userType !== "doctor") {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("userId")
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
      case "concluido":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

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
                <p className="text-sm text-gray-600">Dashboard Médico</p>
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
                <p className="text-sm text-gray-600">{doctor.crm}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-semibold text-gray-900">{doctor.rating}</span>
                  </div>
                  <span className="text-gray-600">({doctor.totalReviews} avaliações)</span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Planos Aceitos</p>
                  <div className="flex flex-wrap gap-1">
                    {doctor.healthPlans.map((plan) => (
                      <Badge
                        key={plan}
                        className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200 text-xs"
                      >
                        {plan}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-600">{doctor.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Telefone</p>
                  <p className="text-sm text-gray-600">{doctor.phone}</p>
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
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl">
              <h2 className="text-3xl font-bold mb-2">Bem-vindo, {doctor.name.split(" ")[1]}!</h2>
              <p className="text-blue-100">Gerencie sua agenda e acompanhe seus pacientes.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Hoje</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.todayAppointments}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-full">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Esta Semana</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.weeklyAppointments}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-blue-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Este Mês</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.monthlyAppointments}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-700 to-blue-800 p-3 rounded-full">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-blue-400">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Lista de Espera</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.waitingListCount}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-3 rounded-full">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Appointments */}
            <Card className="shadow-xl border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="flex items-center text-gray-900">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Consultas de Hoje
                </CardTitle>
                <CardDescription>Sua agenda para hoje, {new Date().toLocaleDateString("pt-BR")}</CardDescription>
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
                                  <Heart className="h-4 w-4 mr-1" />
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
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma consulta agendada para hoje</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Waiting List */}
            <Card className="shadow-xl border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="flex items-center text-gray-900">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Lista de Espera
                </CardTitle>
                <CardDescription>Pacientes aguardando agendamento</CardDescription>
              </CardHeader>
              <CardContent>
                {waitingList.length > 0 ? (
                  <div className="space-y-4">
                    {waitingList.map((item) => (
                      <div
                        key={item.id}
                        className="border-2 border-blue-100 rounded-lg p-4 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{item.patientInitials}</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{item.patient}</h4>
                              <p className="text-sm text-gray-600">
                                Data solicitada: {new Date(item.requestedDate).toLocaleDateString("pt-BR")}
                              </p>
                              <Badge className="mt-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200">
                                {item.healthPlan}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                            >
                              Agendar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                            >
                              Contatar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum paciente na lista de espera</p>
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
