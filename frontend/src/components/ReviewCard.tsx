import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import type { Review as ApiReview } from "brain/data-contracts";

// We can enhance this with user details later
interface ReviewCardProps {
  review: ApiReview;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const reviewerName = "Instalador Anônimo"; // Placeholder
  const reviewerInitials = "IA"; // Placeholder

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src="" alt={reviewerName} />
            <AvatarFallback>{reviewerInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="font-semibold">{reviewerName}</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < review.rating
                        ? "text-primary fill-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
            <p className="mt-2 text-sm">{review.comment}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
