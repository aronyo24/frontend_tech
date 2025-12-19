import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Download, ExternalLink, Loader2 } from "lucide-react";
import PageHero from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface Publication {
  id: number;
  title: string;
  authors: string;
  journal: string;
  year: number;
  pub_type: string;
  abstract: string;
  pdf_file: string | null;
  online_link: string | null;
}

const Publications = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/research/publications/");
        setPublications(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching publications:", err);
        setError("Failed to load publications.");
        setLoading(false);
      }
    };
    fetchPublications();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <PageHero
          className="mb-16"
          eyebrow="Research Archive"
          title="Publications"
          description="Insights, frameworks, and peer-reviewed research produced by Technoheaven practitioners and academic collaborators."
          topic="Research"
        >
          <p className="text-sm text-muted-foreground">
            Browse featured papers or reach out for full research catalogues and collaboration opportunities.
          </p>
        </PageHero>

        <div className="space-y-6">
          {publications.map((pub, index) => (
            <motion.div
              key={pub.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-lg p-6 hover:shadow-glow transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                  <FileText className="text-primary" size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-xl font-semibold">{pub.title}</h3>
                    <span className="text-xs px-3 py-1 rounded-full bg-accent/50 whitespace-nowrap">
                      {pub.pub_type}
                    </span>
                  </div>
                  <p className="text-sm text-primary mb-2">{pub.authors}</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {pub.journal} • {pub.year}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">{pub.abstract}</p>
                  <div className="flex gap-3">
                    {pub.pdf_file && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={pub.pdf_file} target="_blank" rel="noreferrer">
                          <Download size={16} className="mr-2" />
                          Download PDF
                        </a>
                      </Button>
                    )}
                    {pub.online_link && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={pub.online_link} target="_blank" rel="noreferrer">
                          <ExternalLink size={16} className="mr-2" />
                          View Online
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Publications;
