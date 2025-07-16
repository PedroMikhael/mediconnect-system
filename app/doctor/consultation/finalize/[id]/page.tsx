"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Stethoscope,
  User,
  Heart,
  FileText,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Save,
} from "lucide-react"
import Link from "next/link"

export default function CompleteAppointmentPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [appointment, setAppointment] = useState<any>(null)
  const [doctor, setDoctor] = useState<any>(null)
  const [patient, setPatient] = useState<any>(null)
  const [notes, setNotes] = useState("")
  const [fee, setFee] = useState<number | "">("")
  const [feeEditable, setFeeEditable] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem("authToken")
        if (!token) throw new Error("Usuário não autenticado")
        if (!id) throw new Error("ID da consulta não fornecido")

        const userId = localStorage.getItem("userId")
        if (!userId) throw new Error("Usuário não autenticado")

        const doctorRes = await fetch(`/api/doctor/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!doctorRes.ok) throw new Error("Erro ao buscar dados do médico")
        const doctorData = await doctorRes.json()
        setDoctor(doctorData)

        const apptsRes = await fetch(`/api/appointments/doctor/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!apptsRes.ok) throw new Error("Erro ao buscar consultas do médico")
        const apptsData = await apptsRes.json()
        const currentAppt = apptsData.find((a: any) => String(a.id) === String(id))
        if (!currentAppt) throw new Error("Consulta não encontrada")
        setAppointment(currentAppt)

        const patientRes = await fetch(`/api/patient/${currentAppt.patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!patientRes.ok) throw new Error("Erro ao buscar dados do paciente")
        const patientData = await patientRes.json()
        setPatient(patientData)

        setNotes(currentAppt.consultationNotes || "")
        const doctorPlan = doctorData.healthPlan || ""
        const patientPlan = patientData.healthPlan || ""
        const plansAreEqual = doctorPlan.trim().toLowerCase() === patientPlan.trim().toLowerCase()
        setFeeEditable(!plansAreEqual)
        setFee(plansAreEqual ? 0 : (currentAppt.consultationFee ?? ""))
      } catch (err: any) {
        setError(err.message || "Erro desconhecido")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleSubmit = async () => {
    if (!id) return
    setSaving(true)
    setError(null)

    try {
      const token = localStorage.getItem("authToken")
      if (!token) throw new Error("Usuário não autenticado")

      const body = {
        consultationNotes: notes,
        consultationFee: feeEditable ? (typeof fee === "number" && !isNaN(fee) ? fee : 0) : 0,
      }

      const res = await fetch(`/api/appointment/${id}/complete`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        let message = `Erro ao salvar consulta. Status: ${res.status}`
        try {
          const data = await res.json()
          console.error("Resposta da API (erro):", data)
          message = data?.message || message
        } catch {
          console.error("Não foi possível ler JSON da resposta de erro")
        }
        throw new Error(message)
      }

      alert("Consulta finalizada com sucesso!")
      router.push("/doctor/dashboard")
    } catch (err: any) {
      setError(err.message || "Erro desconhecido")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando dados da consulta...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto shadow-xl border-2 border-red-200">
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-semibold">Erro: {error}</p>
            <Button
              className="mt-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
              onClick={() => router.push("/doctor/dashboard")}
            >
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!appointment || !doctor || !patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto shadow-xl border-2 border-blue-100">
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Não foi possível carregar os dados necessários.</p>
          </CardContent>
        </Card>
      </div>
    )
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
                Finalizar Consulta
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-2 border-blue-100">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="flex items-center text-2xl text-gray-900">
                <Stethoscope className="h-6 w-6 mr-2 text-blue-600" />
                Finalizar Consulta
              </CardTitle>
              <CardDescription className="text-gray-600">
                Confira os dados da consulta e finalize o atendimento
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Informações da Consulta */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Dados do Médico */}
                <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg text-gray-900">
                      <User className="h-5 w-5 mr-2 text-blue-600" />
                      Médico Responsável
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {doctor.name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("") || "DR"}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{doctor.name}</p>
                        <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200">
                          {doctor.healthPlan || "Não informado"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Dados do Paciente */}
                <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg text-gray-900">
                      <Heart className="h-5 w-5 mr-2 text-blue-600" />
                      Paciente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {appointment.patientName
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("") || "PT"}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{appointment.patientName}</p>
                        <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200">
                          {patient.healthPlan || "Não informado"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Status do Plano */}
              {feeEditable ? (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 font-medium">
                    <strong>Atenção:</strong> Como os planos são diferentes, a consulta deve ser paga pelo paciente.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 font-medium">
                    <strong>Plano Coberto:</strong> O plano de saúde cobre automaticamente os custos da consulta.
                  </AlertDescription>
                </Alert>
              )}

              {/* Descrição da Consulta */}
              <div className="space-y-3">
                <label htmlFor="notes" className="flex items-center text-lg font-semibold text-gray-900">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Descrição da Consulta
                </label>
                <Textarea
                  id="notes"
                  rows={6}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Descreva detalhadamente a consulta, diagnóstico, prescrições e orientações..."
                  className="border-2 border-blue-100 focus:border-blue-300 focus:ring-blue-500 rounded-lg p-4 text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Valor da Consulta */}
              <div className="space-y-3">
                <label htmlFor="fee" className="flex items-center text-lg font-semibold text-gray-900">
                  <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                  Valor da Consulta (R$)
                </label>
                {feeEditable ? (
                  <Input
                    id="fee"
                    type="number"
                    min={0}
                    step={0.01}
                    value={fee}
                    onChange={(e) => setFee(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="Digite o valor da consulta"
                    className="border-2 border-blue-100 focus:border-blue-300 focus:ring-blue-500 rounded-lg p-4 text-gray-700 text-lg"
                  />
                ) : (
                  <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-semibold text-lg flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Consulta paga pelo plano de saúde
                    </p>
                  </div>
                )}
              </div>

              {/* Botão de Finalizar */}
              <div className="pt-6">
                <Button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {saving ? "Finalizando Consulta..." : "Finalizar Consulta"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}