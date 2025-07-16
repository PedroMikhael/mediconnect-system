"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Star, Calendar, MapPin, Heart, Send } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface CompletedConsultation {
  id: number
  doctor: string
  specialty: string
  date: string
  time: string
  location: string
  type: string
  healthPlan: string
  doctorInitials: string
  rating?: number
  comment?: string
  status: string
}

export default function PatientEvaluations() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingConsultations, setLoadingConsultations] = useState(true)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [selectedConsultation, setSelectedConsultation] = useState<CompletedConsultation | null>(null)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [completedConsultations, setCompletedConsultations] = useState<CompletedConsultation[]>([])

  useEffect(() => {
    // Verificar se o usuário está logado
    const userType = localStorage.getItem("userType")
    if (userType !== "patient") {
      router.push("/login")
      return
    }

    // Buscar consultas concluídas
    fetchCompletedConsultations()
  }, [router])

  const fetchCompletedConsultations = async () => {
    try {
      setLoadingConsultations(true)
      const token = localStorage.getItem("authToken")
      const patientId = localStorage.getItem("userId")
      
      if (!token || !patientId) {
        throw new Error("Usuário não autenticado")
      }

      // Buscar consultas do paciente
      const res = await fetch(`/api/appointments/patient/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error("Erro ao buscar consultas")
      }

      const data = await res.json()

      // Filtrar apenas consultas concluídas
      const completed = data.filter(
        (appointment: any) => appointment.status == "COMPLETED"
      )

      // Buscar avaliações existentes
      const reviewsRes = await fetch(`/api/reviews?patientId=${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const reviewsData = reviewsRes.ok ? await reviewsRes.json() : []

      // Mapear consultas para o formato esperado
      const mappedConsultations = completed.map((consultation: any) => {
        const doctorInitials = consultation.doctorName
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()

        // Encontrar avaliação existente para esta consulta
        const existingReview = reviewsData.find(
          (review: any) => review.appointmentId === consultation.id
        )

        return {
          id: consultation.id,
          doctor: consultation.doctorName,
          specialty: consultation.specialty || "Não informado",
          date: consultation.date,
          time: consultation.time,
          location: consultation.location || "Não informado",
          type: consultation.type || "Consulta",
          healthPlan: consultation.healthPlan || "Não informado",
          doctorInitials,
          rating: existingReview?.rating,
          comment: existingReview?.comment,
          status: consultation.status
        }
      })

      setCompletedConsultations(mappedConsultations)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar consultas")
    } finally {
      setLoadingConsultations(false)
    }
  }

  const handleOpenDialog = (consultation: CompletedConsultation) => {
    setSelectedConsultation(consultation)
    setRating(consultation.rating || 0)
    setComment(consultation.comment || "")
    setIsDialogOpen(true)
    setError("")
    setSuccess("")
  }

  const handleSubmitEvaluation = async () => {
    if (!selectedConsultation) return

    if (rating === 0) {
      setError("Por favor, selecione uma avaliação de 1 a 5 estrelas")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("authToken")
      const patientId = localStorage.getItem("userId")
      
      if (!token || !patientId) {
        throw new Error("Usuário não autenticado")
      }

      // Enviar avaliação para a API
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointmentId: selectedConsultation.id,
          rating,
          comment
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao enviar avaliação")
      }

      setSuccess("Avaliação enviada com sucesso!")

      // Atualizar a lista de consultas localmente
      setCompletedConsultations((prev) =>
        prev.map((consultation) =>
          consultation.id === selectedConsultation.id
            ? {
                ...consultation,
                rating,
                comment
              }
            : consultation
        )
      )

      setTimeout(() => {
        setIsDialogOpen(false)
        setSuccess("")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Erro ao enviar avaliação. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedConsultation(null)
    setRating(0)
    setHoverRating(0)
    setComment("")
    setError("")
    setSuccess("")
  }

  const renderStars = (interactive = false, currentRating = 0) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          >
            <Star
              className={`h-8 w-8 ${
                star <= (interactive ? hoverRating || rating : currentRating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const hasEvaluation = (consultation: CompletedConsultation) => {
    return consultation.rating !== undefined && consultation.rating !== null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/patient/dashboard">
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
                Avaliar Consultas
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-2 border-blue-100 mb-8">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="flex items-center text-2xl text-gray-900">
                <Star className="h-6 w-6 mr-2 text-blue-600" />
                Consultas Concluídas
              </CardTitle>
              <CardDescription className="text-gray-600">
                Avalie suas consultas e ajude outros pacientes com sua experiência
              </CardDescription>
            </CardHeader>
          </Card>

          {loadingConsultations ? (
            <div className="text-center py-12">
              <p>Carregando consultas...</p>
            </div>
          ) : error ? (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          ) : completedConsultations.length > 0 ? (
            <div className="space-y-6">
              {completedConsultations.map((consultation) => {
                const [year, month, day] = consultation.date.split("-")
                const formattedDate = `${day}/${month}/${year}`
                
                let formattedTime = "Horário inválido"
                if (typeof consultation.time === "string") {
                  const [hourStr, minuteStr] = consultation.time.split(":")
                  formattedTime = `${hourStr}:${minuteStr}`
                } else if (consultation.time && typeof consultation.time === "object") {
                  const hour = String(consultation.time.hour).padStart(2, "0")
                  const minute = String(consultation.time.minute).padStart(2, "0")
                  formattedTime = `${hour}:${minute}`
                }

                return (
                  <Card
                    key={consultation.id}
                    className={`shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
                      hasEvaluation(consultation)
                        ? "border-green-200 bg-green-50/30"
                        : "border-blue-200 hover:border-blue-300"
                    }`}
                    onClick={() => handleOpenDialog(consultation)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center shadow-lg">
                            <span className="text-white text-xl font-bold">{consultation.doctorInitials}</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-xl font-semibold text-gray-900">{consultation.doctor}</h3>
                              <Badge variant="outline" className="border-blue-200 text-blue-600">
                                {consultation.specialty}
                              </Badge>
                              <Badge variant="outline" className="border-blue-300 text-blue-700">
                                {consultation.type}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formattedDate} às {formattedTime}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {consultation.location}
                              </div>
                              <div className="flex items-center">
                                <Heart className="h-4 w-4 mr-1" />
                                {consultation.healthPlan}
                              </div>
                            </div>
                            {hasEvaluation(consultation) && (
                              <div className="flex items-center space-x-2 mt-2">
                                {renderStars(false, consultation.rating || 0)}
                                <span className="text-sm text-gray-600">Avaliado</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          {hasEvaluation(consultation) ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200">Avaliado</Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                          >
                            {hasEvaluation(consultation) ? "Ver/Editar" : "Avaliar"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="shadow-xl border-2 border-blue-100">
              <CardContent className="text-center py-12">
                <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma consulta para avaliar</h3>
                <p className="text-gray-600 mb-6">Você ainda não possui consultas concluídas para avaliar.</p>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                  asChild
                >
                  <Link href="/patient/search">Agendar Primeira Consulta</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Evaluation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl text-gray-900">
              <Star className="h-5 w-5 mr-2 text-blue-600" />
              Avaliar Consulta
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {selectedConsultation && (
                <>
                  Avalie sua consulta com <strong>{selectedConsultation.doctor}</strong> -{" "}
                  {selectedConsultation.specialty}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

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

          <div className="space-y-6 py-4">
            <div className="text-center space-y-3">
              <p className="text-sm font-medium text-gray-700">Como você avalia esta consulta?</p>
              {renderStars(true)}
              <p className="text-xs text-gray-500">Clique nas estrelas para avaliar</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Comentário (opcional)</label>
              <Textarea
                placeholder="Compartilhe sua experiência com esta consulta..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="border-2 border-blue-100 focus:border-blue-300"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 text-right">{comment.length}/500</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitEvaluation}
              disabled={isLoading || rating === 0}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
            >
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? "Enviando..." : "Enviar Avaliação"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}