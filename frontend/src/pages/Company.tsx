import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import brain from "brain";
import type { CompanyProfile as ApiCompanyProfile } from "brain/data-contracts";
import { Loader2, Building, Mail, Phone, Globe, MapPin, Package, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "components/ProductCard";
import type { Product } from "components/ProductCard";
import { useStackApp } from "../app";

const mapApiProductToCardProduct = (apiProduct: any): Product => ({
  id: apiProduct.id,
  name: apiProduct.name,
  category: "Painel Solar", // This should be dynamic based on category_id
  brand: apiProduct.brand || "N/A",
  rating: 4, // This should come from reviews
  reviews: 0, // This should come from reviews
  price: apiProduct.price_info || "N/A",
  image: apiProduct.image_url || "https://images.unsplash.com/photo-1545208942-e1c9c0356613?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
});

export default function CompanyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState<ApiCompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const companyId = searchParams.get("id");
    if (!companyId) {
      setError("Nenhum ID de empresa fornecido.");
      setLoading(false);
      return;
    }

    const fetchCompanyProfile = async () => {
      setLoading(true);
      try {
        const response = await brain.get_company_profile({ companyId: parseInt(companyId) });
        const data = await response.json();
        setCompany(data);
      } catch (err) {
        console.error("Failed to fetch company profile", err);
        setError("Não foi possível carregar o perfil da empresa.");
      }
      setLoading(false);
    };

    fetchCompanyProfile();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <p className="text-xl text-destructive mb-4">{error}</p>
        <Button onClick={() => navigate("/search")}>Voltar para a busca</Button>
      </div>
    );
  }

  if (!company) {
    return null;
  }

  const productsForCard = company.products.map(mapApiProductToCardProduct);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="bg-card p-8 rounded-lg mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={`https://avatar.vercel.sh/${company.name}.png`} alt={company.name} />
                <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-4xl font-bold">{company.name}</h1>
                    <p className="text-muted-foreground mt-1">
                        {company.years_in_business ? `${company.years_in_business} anos no mercado` : "Novo no mercado"}
                    </p>
                </div>
            </div>
            <Button>Solicitar Orçamento</Button>
          </div>
        <Separator className="my-6" />
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
           <InfoItem icon={<MapPin className="h-4 w-4 text-primary"/>} text={`${company.city}, ${company.state}`} />
           <InfoItem icon={<Globe className="h-4 w-4 text-primary"/>} text={company.website || "Website não informado"} href={company.website || undefined} />
           <InfoItem icon={<Mail className="h-4 w-4 text-primary"/>} text="contato@empresa.com" href="mailto:contato@empresa.com" />
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 flex items-center"><Package className="h-6 w-6 mr-3 text-primary"/> Produtos Oferecidos</h2>
            {productsForCard.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {productsForCard.map(p => <ProductCard key={p.id} product={p}/>)}
                </div>
            ) : (
                <p className="text-muted-foreground">Esta empresa ainda não cadastrou produtos.</p>
            )}
        </div>
        <aside className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Sobre a {company.name}</CardTitle>
                </CardHeader>
                <CardContent>
                   <p className="text-muted-foreground">
                    {company.description || "Nenhuma descrição disponível."}
                   </p>
                </CardContent>
            </Card>
        </aside>
      </main>
    </div>
  );
}

const InfoItem = ({ icon, text, href }: { icon: React.ReactNode, text: string, href?: string }) => {
    const content = <div className="flex items-center gap-3">{icon}<span className="text-muted-foreground">{text}</span></div>;
    if (href) {
        return <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline">{content}</a>
    }
    return content;
}
