import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import brain from "brain";
import type { Company as ApiCompany } from "brain/data-contracts";
import { CompanyCard } from "components/CompanyCard";

// A real app would get this from a database or a dedicated endpoint
const statesOfBrazil = [
    { value: "AC", label: "Acre" },
    { value: "AL", label: "Alagoas" },
    { value: "AP", label: "Amapá" },
    { value: "AM", label: "Amazonas" },
    { value: "BA", label: "Bahia" },
    { value: "CE", label: "Ceará" },
    { value: "DF", label: "Distrito Federal" },
    { value: "ES", label: "Espírito Santo" },
    { value: "GO", label: "Goiás" },
    { value: "MA", label: "Maranhão" },
    { value: "MT", label: "Mato Grosso" },
    { value: "MS", label: "Mato Grosso do Sul" },
    { value: "MG", label: "Minas Gerais" },
    { value: "PA", label: "Pará" },
    { value: "PB", label: "Paraíba" },
    { value: "PR", label: "Paraná" },
    { value: "PE", label: "Pernambuco" },
    { value: "PI", label: "Piauí" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "RN", label: "Rio Grande do Norte" },
    { value: "RS", label: "Rio Grande do Sul" },
    { value: "RO", label: "Rondônia" },
    { value: "RR", label: "Roraima" },
    { value: "SC", label: "Santa Catarina" },
    { value: "SP", label: "São Paulo" },
    { value: "SE", label: "Sergipe" },
    { value: "TO", label: "Tocantins" }
];


export default function SearchPage() {
  const [companies, setCompanies] = useState<ApiCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const fetchCompanies = async (searchState?: string, searchCity?: string) => {
    setLoading(true);
    try {
      const response = await brain.search_companies({ state: searchState, city: searchCity });
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error("Failed to fetch companies", error);
      setCompanies([]); // Clear on error
    }
    setLoading(false);
  };

  // Initial fetch for all companies
  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSearch = () => {
    fetchCompanies(state, city);
  };
  
  const handleClearFilters = () => {
      setState("");
      setCity("");
      fetchCompanies();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Encontre Fornecedores</h1>
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 bg-card p-6 rounded-lg self-start sticky top-8">
          <h2 className="text-xl font-semibold mb-6">Filtros de Localização</h2>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="state" className="font-semibold">Estado</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Selecione um estado" />
                </SelectTrigger>
                <SelectContent>
                  {statesOfBrazil.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="city" className="font-semibold">Cidade</Label>
              <Input 
                id="city" 
                placeholder="Digite o nome da cidade"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <Button className="w-full" onClick={handleSearch}>Buscar</Button>
            <Button variant="ghost" className="w-full" onClick={handleClearFilters}>Limpar Filtros</Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              {loading ? "Carregando..." : `Mostrando ${companies.length} resultados`}
            </p>
             <Select defaultValue="relevance">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevância</SelectItem>
                  <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
                </SelectContent>
              </Select>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="h-16 w-16 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {companies.length > 0 ? (
                companies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))
              ) : (
                <div className="col-span-full text-center text-muted-foreground py-16">
                  <h3 className="text-xl font-semibold">Nenhuma empresa encontrada</h3>
                   <p>Tente ajustar seus filtros de busca.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}


