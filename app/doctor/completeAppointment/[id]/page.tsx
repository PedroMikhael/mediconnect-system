"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function CompleteAppointmentPage() {
  const router = useRouter()
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [appointment, setAppointment] = useState<any>(null)

  const [notes, setNotes] = useState("")
  const [fee, setFee] = useState<number | "">("")
  const [feeEditable, setFeeEditable] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedData, setSavedData] = useState<any>(null)

  useEffect(() => {
    async function fetchAppointment() {
      try {
        const token = localStorage.getItem("authToken")
        if (!token) throw new Error("Usuário não autenticado")
        if (!id) throw new Error("Id da consulta não fornecido")

        const res = await fetch(`/api/appointments/doctor/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error("Erro ao buscar dados da consulta")

        const data = await res.json()
        setAppointment(data)

        setNotes(data.consultationNotes || "")

        const samePlan = data.healthPlan === data.doctorHealthPlan
        setFeeEditable(!samePlan)
        setFee(samePlan ? 0 : data.consultationFee ?? "")

        setLoading(false)
      } catch (err: any) {
        setError(err.message || "Erro desconhecido")
        setLoading(false)
      }
    }

    fetchAppointment()
  }, [id])

  const handleSubmit = async () => {
    if (!id) return
    setSaving(true)
    setError(null)

    try {
      const token = localStorage.getItem("authToken")
      if (!token) throw new Error("Usuário não autenticado")

      const res = await fetch(`/api/appointment/${id}/complete`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consultationNotes: notes,
          consultationFee: feeEditable ? fee : 0,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Erro ao salvar consulta")
      }

      const data = await res.json()
      setSavedData(data)
    } catch (err: any) {
      setError(err.message || "Erro desconhecido")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-center mt-8">Carregando consulta...</p>
  if (error) return <p className="text-center mt-8 text-red-600">Erro: {error}</p>
  if (!appointment) return <p className="text-center mt-8">Consulta não encontrada.</p>

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-6">Realizar Consulta</h1>

      <p className="mb-2">
        <strong>Paciente:</strong> {appointment.patientName}
      </p>

      <p className="mb-4">
        <strong>Plano do Médico:</strong> {appointment.doctorHealthPlan ?? "Não informado"} <br />
        <strong>Plano do Paciente:</strong> {appointment.healthPlan ?? "Não informado"}
      </p>

      <label className="block mb-2 font-semibold" htmlFor="notes">
        Anotações da Consulta
      </label>
      <textarea
        id="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={6}
        className="w-full border border-gray-300 rounded p-2 mb-4"
      />

      <label className="block mb-2 font-semibold" htmlFor="fee">
        Valor da Consulta (R$)
      </label>
      {feeEditable ? (
        <input
          id="fee"
          type="number"
          min={0}
          step={0.01}
          value={fee}
          onChange={(e) => setFee(e.target.value === "" ? "" : Number(e.target.value))}
          className="w-full border border-gray-300 rounded p-2 mb-4"
        />
      ) : (
        <p className="mb-4 text-green-600 font-semibold">Consulta paga pelo plano de saúde.</p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={saving}
        className="bg-blue-600 hover:bg-blue-700 text-white w-full"
      >
        {saving ? "Salvando..." : "Salvar Consulta"}
      </Button>

      {savedData && (
        <div className="mt-6 p-4 bg-green-100 rounded">
          <h2 className="text-lg font-semibold mb-2">Consulta realizada com sucesso!</h2>
          <p>
            <strong>Anotações:</strong> {savedData.consultationNotes}
          </p>
          <p>
            <strong>Valor:</strong> R$ {savedData.consultationFee.toFixed(2)}
          </p>
          {feeEditable && savedData.consultationFee > 0 && (
            <p className="text-sm text-gray-700 mt-2">
              Lembre-se de informar o pagamento ao paciente.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
