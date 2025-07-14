"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, MapPin, Filter, Calendar } from "lucide-react"
import Link from "next/link"

export default function SearchDoctors() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [selectedHealthPlan, setSelectedHealthPlan] = useState("all")

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

  const healthPlans = ["Unimed", "Bradesco Saúde", "SulAmérica", "Amil", "NotreDame", "Particular"]

  const [doctors] = useState([
    {
      id: 1,
      name: "Dr. Ana Silva",
      specialty: "Cardiologia",
      rating: 4.8,
      reviews: 127,
      healthPlans: ["Unimed", "Bradesco Saúde", "SulAmérica"],
      location: "São Paulo, SP",
      nextAvailable: "2024-01-15",
      image: "/placeholder.svg?height=100&width=100",
      description: "Especialista em cardiologia preventiva com mais de 15 anos de experiência.",
    },
    {
      id: 2,
      name: "Dr. Carlos Santos",
      specialty: "Ortopedia",
      rating: 4.9,
      reviews: 89,
      healthPlans: ["Amil", "Unimed", "NotreDame"],
      location: "São Paulo, SP",
      nextAvailable: "2024-01-12",
      image: "/placeholder.svg?height=100&width=100",
      description: "Cirurgião ortopédico especializado em joelho e quadril.",
    },
    {
      id: 3,
      name: "Dra. Maria Oliveira",
      specialty: "Dermatologia",
      rating: 4.7,
      reviews: 156,
      healthPlans: ["Bradesco Saúde", "SulAmérica"],
      location: "São Paulo, SP",
      nextAvailable: "2024-01-18",
      image: "/placeholder.svg?height=100&width=100",
      description: "Dermatologista clínica e estética, especialista em câncer de pele.",
    },
    {
      id: 4,
      name: "Dr. Pedro Lima",
      specialty: "Clínico Geral",
      rating: 4.6,
      reviews: 203,
      healthPlans: ["Unimed", "Amil", "Particular"],
      location: "São Paulo, SP",
      nextAvailable: "2024-01-10",
      image: "/placeholder.svg?height=100&width=100",
      description: "Clínico geral com foco em medicina preventiva e cuidados primários.",
    },
    {
      id: 5,
      name: "Dra. Julia Costa",
      specialty: "Pediatria",
      rating: 4.9,
      reviews: 178,
      healthPlans: ["Unimed", "Bradesco Saúde", "NotreDame"],
      location: "São Paulo, SP",
      nextAvailable: "2024-01-14",
      image: "/placeholder.svg?height=100&width=100",
      description: "Pediatra especializada em desenvolvimento infantil e vacinação.",
    },
  ])

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialty = selectedSpecialty === "all" || doctor.specialty === selectedSpecialty
    const matchesHealthPlan =
      selectedHealthPlan === "all" ||
      doctor.healthPlans.includes(selectedHealthPlan) ||
      selectedHealthPlan === "Particular"

    return matchesSearch && matchesSpecialty && matchesHealthPlan
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/patient/dashboard" className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-blue-900">Buscar Médicos</h1>
            </Link>
            <Link href="/patient/dashboard">
              <Button variant="outline">Voltar ao Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtros de Busca
            </CardTitle>
            <CardDescription>Encontre o médico ideal para suas necessidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar por nome ou especialidade</label>
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
                    <SelectItem value="all">Todas as especialidades</SelectItem>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
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
                    <SelectItem value="all">Todos os planos</SelectItem>
                    {healthPlans.map((plan) => (
                      <SelectItem key={plan} value={plan}>
                        {plan}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Médicos Encontrados ({filteredDoctors.length})</h2>
          </div>

          {filteredDoctors.length > 0 ? (
            <div className="grid gap-6">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={doctor.image || "/placeholder.svg"} alt={doctor.name} />
                        <AvatarFallback className="text-lg">
                          {doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl font-semibold">{doctor.name}</h3>
                          <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                          <p className="text-gray-600 text-sm mt-1">{doctor.description}</p>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="font-semibold">{doctor.rating}</span>
                            <span className="ml-1">({doctor.reviews} avaliações)</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {doctor.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Próxima: {new Date(doctor.nextAvailable).toLocaleDateString("pt-BR")}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Planos aceitos:</p>
                          <div className="flex flex-wrap gap-1">
                            {doctor.healthPlans.map((plan) => (
                              <Badge
                                key={plan}
                                variant="secondary"
                                className="text-xs bg-blue-100 text-blue-800 border-blue-200"
                              >
                                {plan}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button className="bg-blue-500 hover:bg-blue-700 text-white" asChild>
                          <Link href={`/patient/appointment/schedule/${doctor.id}`}>Agendar Consulta</Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="text-blue-500 border-blue-500 hover:bg-blue-50 hover:text-blue-700 bg-transparent"
                          asChild
                        >
                          <Link href={`/doctor/${doctor.id}`}>Ver Perfil</Link>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum médico encontrado</h3>
                <p className="text-gray-600 mb-4">Tente ajustar os filtros de busca para encontrar mais resultados.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedSpecialty("all")
                    setSelectedHealthPlan("all")
                  }}
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
