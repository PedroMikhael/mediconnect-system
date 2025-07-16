"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield, Calendar, Star, Search, ChevronLeft, ChevronRight, Clock, Award } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Conecte-se com os melhores médicos",
      subtitle: "Agende consultas de forma rápida e segura",
      description: "Mais de 5.000 médicos especialistas prontos para atender você",
      icon: <Heart className="h-16 w-16 text-white" />,
      gradient: "from-blue-600 to-blue-800",
    },
    {
      title: "Sua saúde em primeiro lugar",
      subtitle: "Atendimento de qualidade garantido",
      description: "Avaliações reais de pacientes e médicos certificados",
      icon: <Shield className="h-16 w-16 text-white" />,
      gradient: "from-blue-500 to-blue-700",
    },
    {
      title: "Facilidade em cada clique",
      subtitle: "Gerencie tudo pelo app",
      description: "Histórico médico, receitas e agendamentos em um só lugar",
      icon: <Clock className="h-16 w-16 text-white" />,
      gradient: "from-blue-700 to-blue-900",
    },
  ]

  const featuredDoctors = [
    {
      id: 1,
      name: "Dr. Ana Silva",
      specialty: "Cardiologia",
      rating: 4.8,
      reviews: 127,
      healthPlans: ["Unimed", "Bradesco Saúde", "SulAmérica"],
      initials: "AS",
    },
    {
      id: 2,
      name: "Dr. Carlos Santos",
      specialty: "Ortopedia",
      rating: 4.9,
      reviews: 89,
      healthPlans: ["Amil", "Unimed", "NotreDame"],
      initials: "CS",
    },
    {
      id: 3,
      name: "Dra. Maria Oliveira",
      specialty: "Dermatologia",
      rating: 4.7,
      reviews: 156,
      healthPlans: ["Bradesco Saúde", "SulAmérica"],
      initials: "MO",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-blue-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-3 rounded-xl shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  MediConnect
                </h1>
                <p className="text-sm text-gray-600">Sua saúde, nossa prioridade</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
                  Entrar
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg">
                  Cadastrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Slider */}
      <section className="relative h-96 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className={`h-full bg-gradient-to-r ${slide.gradient} flex items-center justify-center`}>
              <div className="container mx-auto px-4 text-center text-white">
                <div className="mb-6">{slide.icon}</div>
                <h2 className="text-5xl font-bold mb-4">{slide.title}</h2>
                <p className="text-xl mb-2">{slide.subtitle}</p>
                <p className="text-lg opacity-90">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">Encontre seu médico ideal</h3>
          <div className="max-w-2xl mx-auto">
            
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Por que escolher o MediConnect?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-xl text-blue-900">Agendamento Inteligente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Sistema inteligente que encontra o melhor horário para você e o médico.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-xl text-blue-900">Segurança Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">Seus dados médicos protegidos com criptografia de ponta.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-xl text-blue-900">Médicos Certificados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">Apenas médicos com CRM ativo e especialização comprovada.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Médicos em Destaque</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredDoctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-blue-200"
              >
                <CardHeader className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white text-2xl font-bold">{doctor.initials}</span>
                  </div>
                  <CardTitle className="text-xl text-gray-900">{doctor.name}</CardTitle>
                  <CardDescription className="text-lg font-medium text-blue-600">{doctor.specialty}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-semibold text-gray-900">{doctor.rating}</span>
                    </div>
                    <span className="text-gray-600">({doctor.reviews} avaliações)</span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Planos aceitos:</p>
                    <div className="flex flex-wrap gap-1">
                      {doctor.healthPlans.map((plan) => (
                        <Badge
                          key={plan}
                          className="bg-gradient-to-r from-blue-100 to-blue-100 text-blue-800 border-blue-300"
                        >
                          {plan}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg"
                    asChild
                  >
                    <Link href={`/doctor/${doctor.id}`}>Ver Perfil</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-bold text-white mb-6">Pronto para cuidar da sua saúde?</h3>
          <p className="text-xl text-white/90 mb-8">Junte-se a milhares de pessoas que já confiam no MediConnect</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg">
                Cadastre-se Grátis
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg bg-transparent"
              >
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">MediConnect</h3>
              </div>
              <p className="text-gray-400">
                Conectando pacientes e médicos para um cuidado de saúde mais eficiente e acessível.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Para Pacientes</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/patient/search" className="hover:text-white transition-colors">
                    Buscar Médicos
                  </Link>
                </li>
                <li>
                  <Link href="/patient/appointments" className="hover:text-white transition-colors">
                    Minhas Consultas
                  </Link>
                </li>
                <li>
                  <Link href="/patient/history" className="hover:text-white transition-colors">
                    Histórico Médico
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Para Médicos</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/doctor/dashboard" className="hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/doctor/schedule" className="hover:text-white transition-colors">
                    Agenda
                  </Link>
                </li>
                <li>
                  <Link href="/doctor/patients" className="hover:text-white transition-colors">
                    Pacientes
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contato
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacidade
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MediConnect. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
