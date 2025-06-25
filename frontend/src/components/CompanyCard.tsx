import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { Company as ApiCompany } from "brain/data-contracts";
import { Pin } from "lucide-react";

interface CompanyCardProps {
  company: ApiCompany;
}

export const CompanyCard = ({ company }: CompanyCardProps) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/company?id=${company.id}`);
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg flex flex-col">
      <CardHeader>
        <h3 className="font-bold text-xl truncate">{company.name}</h3>
        <div className="flex items-center text-sm text-muted-foreground pt-1">
          <Pin className="h-4 w-4 mr-1.5" />
          <span>{company.city}, {company.state}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {company.description || "Este fornecedor ainda não adicionou uma descrição."}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handleViewProfile}>
          Ver Perfil
        </Button>
      </CardFooter>
    </Card>
  );
};
