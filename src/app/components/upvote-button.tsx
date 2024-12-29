import { ThumbsUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export function UpvoteButton({
  sessionId,
  version,
  initialUpvotes = -1,
}: {
  sessionId: string;
  version: string;
  initialUpvotes?: number;
}) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUpvotes = async () => {
      try {
        const response = await fetch(`/api/apps/${sessionId}/${version}/upvote`, {
          method: "GET",
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to fetch upvotes");
        }
        
        const data = await response.json();
        setUpvotes(data.upvotes);
      } catch (error) {
        console.error("Failed to fetch upvotes:", error);
      }
    };

    fetchUpvotes();
  }, [sessionId, version]);

  const handleUpvote = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/apps/${sessionId}/${version}/upvote`, {
        method: "POST",
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to upvote");
      }
      
      const data = await response.json();
      setUpvotes(data.upvotes);
      toast.success("Thanks for your vote!", {
        duration: 3000,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not upvote. Please try again later", {
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="flex gap-2 px-3"
        onClick={handleUpvote}
        disabled={isLoading}
      >
        {upvotes === -1 ? (
          <span className="animate-pulse">Loading...</span>
        ) : (
          <>
            <ThumbsUp /> {upvotes}
          </>
        )}
      </Button>
    </>
  );
}
