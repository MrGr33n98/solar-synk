import { Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <a className="flex items-center gap-2" href="#">
          <Sun className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">SolarSync</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
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
    </header>
  );
};
