import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Star, Loader2, MessageSquareWarning, ArrowLeft } from "lucide-react";
import type { Product, Review } from "brain/data-contracts";
import brain from "brain";
import ReviewCard from "components/ReviewCard";
import { useNavigate } from "react-router-dom";

export default function ProductPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get("id");

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setError("ID do produto não encontrado.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const productResponse = await brain.get_product({ productId: parseInt(productId) });
        const productData = await productResponse.json();
        setProduct(productData);

        const reviewsResponse = await brain.list_reviews_for_product({
          productId: parseInt(productId),
        });
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
      } catch (e) {
        console.error("Failed to fetch product data", e);
        setError("Falha ao carregar os dados do produto.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <MessageSquareWarning className="h-16 w-16 mx-auto text-destructive" />
        <h1 className="text-2xl font-bold mt-4">Ocorreu um erro</h1>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => navigate("/search")} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a busca
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
         <MessageSquareWarning className="h-16 w-16 mx-auto text-muted-foreground" />
        <h1 className="text-2xl font-bold mt-4">Produto não encontrado</h1>
        <Button onClick={() => navigate("/search")} className="mt-4">
           <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a busca
        </Button>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/search">Busca</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <img
            src={product.image_url || "https://placehold.co/600x400/27272a/FFF?text=Produto"}
            alt={product.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-lg text-muted-foreground mt-1">{product.brand}</p>
          <div className="flex items-center gap-2 mt-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < averageRating
                      ? "text-primary fill-primary"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground">
              ({reviews.length} avaliações)
            </span>
          </div>
          <p className="mt-4">{product.description}</p>
          <Button size="lg" className="mt-6 w-full md:w-auto">
            Solicitar Orçamento
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mt-12">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Especificações Técnicas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Marca</TableCell>
                    <TableCell>{product.brand}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Modelo</TableCell>
                    <TableCell>{product.model || "N/A"}</TableCell>
                  </TableRow>
                  {/* Add more specs as they become available in the model */}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Avaliações de Instaladores</CardTitle>
              <CardDescription>
                Veja o que outros profissionais estão dizendo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <p className="text-muted-foreground text-center">
                  Este produto ainda não tem avaliações. Seja o primeiro a avaliar!
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Informações do Fornecedor</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Placeholder for supplier info */}
              <p className="font-semibold text-lg">Fornecedor Exemplo</p>
              <p className="text-muted-foreground">São Paulo, SP</p>
              <Button variant="outline" className="w-full mt-4">
                Ver Perfil do Fornecedor
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
