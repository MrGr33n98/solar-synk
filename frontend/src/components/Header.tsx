import React from "react";
import { Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <a className="flex items-center gap-2" href="#">
            <Sun className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">SolarSync</h1>
          </a>
          <nav className="space-x-4">
            <a
              className="transition-colors hover:text-primary"
              href="#features"
            >
              Como Funciona
            </a>
            <a
              className="transition-colors hover:text-primary"
              href="#categories"
            >
              Categorias
            </a>
            <a
              className="transition-colors hover:text-primary"
              href="#testimonials"
            >
              Depoimentos
            </a>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline">Cadastrar Fornecedor</Button>
            <Button>Cadastrar Instalador</Button>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </nav>
    </header>
  );
};
