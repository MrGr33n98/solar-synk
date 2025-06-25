import React from "react";
import { Header } from "components/Header";
import { Footer } from "components/Footer";
import { GlassCard } from "components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Users,
  Briefcase,
  Recycle,
  Star,
  Zap,
  Battery,
  Wind,
} from "lucide-react";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background solar-grid-bg">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-16 text-center bg-gradient-to-b from-background via-transparent to-transparent">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
              Avaliações Autênticas para um Futuro Solar
            </h1>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-8">
              Conectando instaladores às melhores tecnologias e fornecedores do
              mercado solar. Baseado em experiências reais.
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Buscar painéis, inversores, fornecedores..."
                  className="w-full pl-12 pr-4 py-3 rounded-full text-lg"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="features" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Como a SolarSync Transforma o Mercado
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <GlassCard className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Para Instaladores</h3>
                </div>
                <p className="text-muted-foreground">
                  Acesse avaliações honestas, compare especificações técnicas e
                  encontre os melhores equipamentos para seus projetos. Economize
                  tempo e garanta a qualidade que seu cliente merece.
                </p>
              </GlassCard>
              <GlassCard className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Briefcase className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Para Fornecedores</h3>
                </div>
                <p className="text-muted-foreground">
                  Aumente a visibilidade dos seus produtos, receba feedback
                  direto do mercado e gere leads qualificados. Posicione sua
                  marca como líder em qualidade e confiança.
                </p>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Explore as Principais Categorias
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <CategoryCard icon={<Zap size={32} />} name="Painéis Solares" />
              <CategoryCard icon={<Recycle size={32} />} name="Inversores" />
              <CategoryCard icon={<Battery size={32} />} name="Baterias" />
              <CategoryCard icon={<Wind size={32} />} name="Estruturas" />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              O que os Instaladores Dizem
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <TestimonialCard
                text="A SolarSync mudou a forma como escolho meus fornecedores. A confiança que as avaliações trazem não tem preço."
                author="João Silva"
                company="Silva Solar"
              />
              <TestimonialCard
                text="Finalmente uma plataforma que entende as nossas necessidades. Encontrar especificações e comparar produtos nunca foi tão fácil."
                author="Maria Oliveira"
                company="Solução Energética"
              />
              <TestimonialCard
                text="Excelente ferramenta para validar a qualidade dos equipamentos antes da compra. Recomendo a todos os profissionais da área."
                author="Carlos Pereira"
                company="CP Instalações"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Pronto para Começar?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Junte-se à comunidade que está elevando o padrão do mercado de
              energia solar no Brasil.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg">Cadastrar como Instalador</Button>
              <Button size="lg" variant="outline">
                Cadastrar sua Empresa
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

const CategoryCard = ({ icon, name }: { icon: any; name: string }) => (
  <GlassCard className="p-6 flex flex-col items-center justify-center text-center">
    <div className="p-4 bg-primary/10 rounded-full mb-4">{icon}</div>
    <h4 className="font-bold text-lg">{name}</h4>
  </GlassCard>
);

const TestimonialCard = ({ text, author, company }: { text: string; author: string; company: string }) => (
  <GlassCard className="p-6">
    <div className="flex mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="h-5 w-5 text-primary fill-primary" />
      ))}
    </div>
    <p className="text-muted-foreground mb-4">"{text}"</p>
    <p className="font-semibold">{author}</p>
    <p className="text-sm text-muted-foreground">{company}</p>
  </GlassCard>
);
