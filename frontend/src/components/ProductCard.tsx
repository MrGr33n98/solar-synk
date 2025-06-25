import { Star } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/product?id=${product.id}`);
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.brand}</p>
        <div className="flex items-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < product.rating ? "text-primary fill-primary" : "text-muted-foreground"
              }`}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-1">({product.reviews})</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <p className="font-semibold text-lg">{product.price}</p>
        <Button variant="outline" onClick={handleViewDetails}>Ver Detalhes</Button>
      </CardFooter>
    </Card>
  );
};
