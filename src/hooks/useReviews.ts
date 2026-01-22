import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Review {
  id: string;
  name: string;
  role: string;
  location: string;
  review: string;
  rating: number;
  verified: boolean;
  status: string;
  created_at: string;
}

export interface NewReview {
  name: string;
  role: string;
  location: string;
  review: string;
  rating: number;
}

// Fetch all approved reviews from the database
export const useReviews = () => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async (): Promise<Review[]> => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
        throw error;
      }

      return data || [];
    },
  });
};

// Get just the review count (for badges, etc.)
export const useReviewCount = () => {
  return useQuery({
    queryKey: ["reviews", "count"],
    queryFn: async (): Promise<number> => {
      const { count, error } = await supabase
        .from("reviews")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error fetching review count:", error);
        throw error;
      }

      return count || 0;
    },
  });
};

// Submit a new review
export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newReview: NewReview): Promise<Review> => {
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          name: newReview.name,
          role: newReview.role,
          location: newReview.location,
          review: newReview.review,
          rating: newReview.rating,
          verified: true,
          status: "approved",
        })
        .select()
        .single();

      if (error) {
        console.error("Error submitting review:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate queries to refetch reviews
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast({
        title: "Review Submitted!",
        description: "Thank you for sharing your experience with us.",
      });
    },
    onError: (error) => {
      console.error("Failed to submit review:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your review. Please try again.",
        variant: "destructive",
      });
    },
  });
};
