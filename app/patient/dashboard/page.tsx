"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Star, Plus, Search, Bell, User, LogOut, Heart } from "lucide-react"

export default function PatientDashboard() {
  const router = useRouter()
  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([])

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

        const res = await fetch(`/api/patient/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) {
          throw new Error("Erro ao buscar dados do paciente")
        }

        const data = await res.json()

        const initials = data.name
          ? data.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
          : "NA"

        setPatient({
          ...data,
          initials,
        })

        fetchAppointments(id, token)
        setLoading(false)
      } catch (err: any) {
        setError(err.message || "Erro desconhecido")
        setLoading(false)
      }
    }

    async function fetchAppointments(patientId: string, token: string) {
      try {
        const res = await fetch(`/api/appointments/patient/${patientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error("Erro ao buscar consultas")

        const data = await res.json()

        console.log("Consultas recebidas:", data)

        const activeAppointments = data.filter(
          (appointment: any) =>
            appointment.status &&
            appointment.status.toLowerCase() !== "cancelado"
        )

        console.log("Consultas filtradas:", activeAppointments)

        setUpcomingAppointments(
          data.filter((appointment: any) => appointment.status?.toLowerCase() !== "cancelled")
        )

      } catch (err) {
        console.error("Erro ao buscar próximas consultas:", err)
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

  function calculateAge(dateOfBirth: string): number | string {
    if (!dateOfBirth) return "Não informado"
    const birth = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  if (loading) return <p className="text-center mt-8">Carregando dados do paciente...</p>
  if (error) return <p className="text-center mt-8 text-red-600">Erro: {error}</p>
  if (!patient) return <p className="text-center mt-8">Nenhum dado do paciente disponível.</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
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

      <main className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl mb-8">
          <h2 className="text-3xl font-bold mb-2">Bem-vindo, {patient.name.split(" ")[0]}!</h2>
          <p className="text-blue-100">Gerencie suas consultas e acompanhe seu histórico médico.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
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

          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-blue-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-3 rounded-full">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Avaliar Consultas</h3>
                  <p className="text-sm text-gray-600">Avalie suas consultas</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 border-blue-400 text-blue-700 hover:bg-blue-50 bg-transparent"
                asChild
              >
                <Link href="/patient/review">Avaliar</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-2 border-blue-100">
              <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-2xl font-bold">{patient.initials}</span>
                </div>
                <CardTitle className="text-gray-900">{patient.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {calculateAge(patient.dateOfBirth)} anos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Plano de Saúde</p>
                  <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200">
                    {patient.healthPlan || "Não informado"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-600">{patient.email}</p>
                </div>
                <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent" asChild>
                  <Link href="/patient/profile">
                    <User className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <Card className="shadow-xl border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-gray-900">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Próximas Consultas
                  </CardTitle>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    asChild
                  >
                    
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => {
                      const [year, month, day] = appointment.date.split("-")
                      const formattedDate = `${day}/${month}/${year}`

                      let formattedTime = "Horário inválido"

                      if (typeof appointment.time === "string") {
                        const [hourStr, minuteStr] = appointment.time.split(":")
                        formattedTime = `${hourStr}:${minuteStr}`
                      } else if (appointment.time && typeof appointment.time === "object") {
                        const hour = String(appointment.time.hour).padStart(2, "0")
                        const minute = String(appointment.time.minute).padStart(2, "0")
                        formattedTime = `${hour}:${minute}`
                      }

                      const status = appointment.waitingList ? "Lista de Espera" : "Confirmado"
                      const statusColor = appointment.waitingList
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                        : "bg-green-100 text-green-800 border-green-200"
                      const doctorInitials = appointment.doctorName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                      return (
                        <div key={appointment.id} className="border-2 border-blue-100 rounded-lg p-4 hover:bg-blue-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">{doctorInitials}</span>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-semibold text-gray-900">{appointment.doctorName}</h4>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {formattedDate}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {formattedTime}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Badge className={statusColor}>{status}</Badge>
                          </div>

                          <div className="mt-3 flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                              onClick={async () => {
                                const token = localStorage.getItem("authToken")
                                if (!token) return
                                await fetch(`/api/appointments/${appointment.id}`, {
                                  method: "DELETE",
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                })
                                setUpcomingAppointments((prev) => prev.filter((a) => a.id !== appointment.id))
                              }}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma consulta agendada</p>
                    <Button className="mt-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900" asChild>
                      <Link href="/patient/search">Agendar Primeira Consulta</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}