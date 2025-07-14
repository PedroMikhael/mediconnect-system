"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import Link from "next/link"

interface Doctor {
  id: string | number
  name: string
  speciality: string
  healthPlan: string
  description: string
}

export default function SearchDoctors() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [selectedHealthPlan, setSelectedHealthPlan] = useState("all")
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(false)

  const specialties = [
    "Cardiologia",
    "Dermatologia",
    "Ortopedia",
    "Pediatria",
    "Ginecologia",
    "Neurologia",
    "Psiquiatria",
    "Clínico Geral",
  ]

  const healthPlans = [
    "Unimed",
    "Bradesco Saúde",
    "SulAmérica",
    "Amil",
    "NotreDame",
    "Particular",
  ]

  useEffect(() => {
    async function fetchDoctors() {
      setLoading(true)
      try {
        const res = await fetch("/api/doctor")
        if (!res.ok) throw new Error("Erro ao buscar médicos")
        const data = await res.json()
        setDoctors(data)
      } catch (error) {
        console.error(error)
        setDoctors([])
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  const filteredDoctors = doctors.filter((doctor) => {
    const term = searchTerm.trim().toLowerCase()

    const matchesSearch =
      doctor.name.toLowerCase().includes(term) ||
      doctor.speciality.toLowerCase().includes(term)

    const matchesSpecialty =
      selectedSpecialty === "all" || doctor.speciality === selectedSpecialty

    const matchesHealthPlan =
      selectedHealthPlan === "all" ||
      doctor.healthPlan === selectedHealthPlan ||
      selectedHealthPlan === "Particular"

    return matchesSearch && matchesSpecialty && matchesHealthPlan
  })

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedSpecialty("all")
    setSelectedHealthPlan("all")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/patient/dashboard" className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-blue-900">Buscar Médicos</h1>
            </Link>
            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filtros */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtros de Busca
            </CardTitle>
            <CardDescription>
              Encontre o médico ideal para suas necessidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome ou Especialidade</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Ex: Dr. João ou Cardiologia"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Especialidade</label>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as especialidades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {specialties.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Plano de Saúde</label>
                <Select value={selectedHealthPlan} onValueChange={setSelectedHealthPlan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os planos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {healthPlans.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Médicos Encontrados ({filteredDoctors.length})
          </h2>

          {loading ? (
            <p className="text-center text-gray-500">Carregando médicos...</p>
          ) : filteredDoctors.length > 0 ? (
            <div className="grid gap-6">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Avatar com iniciais */}
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center shadow-md">
                        <span className="text-white text-2xl font-bold">
                          {doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>

                      <div className="flex-1 space-y-2">
                        <h3 className="text-xl font-semibold">{doctor.name}</h3>
                        <p className="text-gray-600 text-sm">{doctor.description}</p>

                        <div className="flex items-center gap-4 text-sm mt-2">
                          <div>
                            <span className="font-medium">Plano: </span>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs">
                              {doctor.healthPlan}
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium">Especialidade: </span>
                            <span className="text-blue-600 text-sm">
                              {doctor.speciality}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button
                          className="bg-blue-500 hover:bg-blue-700 text-white"
                          asChild
                        >
                          <Link href={`/patient/appointment/schedule/${doctor.id}`}>
                            Agendar Consulta
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum médico encontrado
                </h3>
                <p className="text-gray-600 mb-4">
                  Tente ajustar os filtros de busca para encontrar mais resultados.
                </p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="text-blue-500 border-blue-500 hover:bg-blue-50 hover:text-blue-700"
                >
                  Limpar Filtros
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
