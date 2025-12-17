import { motion } from "framer-motion";
import { FileText, Download, ExternalLink } from "lucide-react";
import PageHero from "@/components/page-hero";
import { Button } from "@/components/ui/button";

const Publications = () => {
  const publications = [
    {
      title: "Advanced Neural Network Architectures for Real-Time Object Detection",
      authors: "Dr. Sarah Johnson, Michael Chen",
      journal: "IEEE Transactions on Neural Networks",
      year: 2024,
      type: "Research Paper",
      abstract: "This paper presents novel CNN architectures optimized for real-time inference...",
    },
    {
      title: "Blockchain Consensus Mechanisms: A Comprehensive Survey",
      authors: "Anna Kowalski, David Kim",
      journal: "Journal of Distributed Systems",
      year: 2024,
      type: "Survey Paper",
      abstract: "An extensive review of consensus protocols in blockchain technology...",
    },
    {
      title: "Machine Learning Approaches for Predictive Healthcare Analytics",
      authors: "Emily Rodriguez, Dr. Sarah Johnson",
      journal: "Healthcare Technology Review",
      year: 2023,
      type: "Research Paper",
      abstract: "Novel ML techniques applied to patient outcome prediction systems...",
    },
    {
      title: "Scalable Smart Contract Architecture for Enterprise Applications",
      authors: "Anna Kowalski, James Wilson",
      journal: "International Conference on Blockchain",
      year: 2023,
      type: "Conference Paper",
      abstract: "Proposing a scalable framework for deploying smart contracts at enterprise scale...",
    },
    {
      title: "Deep Reinforcement Learning for Autonomous Systems",
      authors: "David Kim, Michael Chen",
      journal: "AI Research Quarterly",
      year: 2023,
      type: "Research Paper",
      abstract: "Exploring DRL algorithms for navigation and decision-making in robotics...",
    },
    {
      title: "Natural Language Understanding with Transformer Models",
      authors: "James Wilson, Emily Rodriguez",
      journal: "Computational Linguistics Journal",
      year: 2023,
      type: "Research Paper",
      abstract: "Fine-tuning strategies for domain-specific NLP applications...",
    },
  ];

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
                      {pub.type}
                    </span>
                  </div>
                  <p className="text-sm text-primary mb-2">{pub.authors}</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {pub.journal} • {pub.year}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">{pub.abstract}</p>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm">
                      <Download size={16} className="mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink size={16} className="mr-2" />
                      View Online
                    </Button>
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
