"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface Annotation {
  id: string;
  content: string;
  createdAt: string;
}

const mockAnnotations: Annotation[] = [
  {
    id: "1",
    content: "Client interested in long-term investment options",
    createdAt: "2024-03-20T10:00:00Z",
  },
  {
    id: "2",
    content: "Risk profile: Moderate",
    createdAt: "2024-03-19T15:30:00Z",
  },
];

export function PortfolioAnnotations({ clientId }: { clientId: string }) {
  const [annotations, setAnnotations] = useState<Annotation[]>(mockAnnotations);
  const [newAnnotation, setNewAnnotation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddAnnotation = async () => {
    if (!newAnnotation.trim()) {
      toast({
        title: "Error",
        description: "Please enter an annotation",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newNote: Annotation = {
        id: Date.now().toString(),
        content: newAnnotation,
        createdAt: new Date().toISOString(),
      };
      setAnnotations([newNote, ...annotations]);
      setNewAnnotation("");
      setLoading(false);
      toast({
        title: "Success",
        description: "Annotation added successfully",
      });
    }, 500);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Portfolio Annotations</h1>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a new annotation..."
            value={newAnnotation}
            onChange={(e) => setNewAnnotation(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddAnnotation();
              }
            }}
          />
          <Button onClick={handleAddAnnotation} disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </Button>
        </div>

        <div className="space-y-4">
          {annotations.map((annotation) => (
            <div
              key={annotation.id}
              className="p-4 border rounded-lg bg-white"
            >
              <p className="text-gray-800">{annotation.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(annotation.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 