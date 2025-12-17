import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import PageHero from "@/components/page-hero";
import { Button } from "@/components/ui/button";

const Projects = () => {
  const [filter, setFilter] = useState("All");

  const categories = ["All", "Blockchain", "AI/ML", "Deep Learning", "Software"];

  const projects = [
    {
      title: "TRACeChain",
      subtitle: "Building the Future of Trusted Academic Credential Verification",
      category: "Blockchain",
      status: "In Pilot",
      timeline: "2025 – 2027 (Expected)",
      budget: "£100,000",
      funding: "Own Budget (Seeking Funder)",
      lead: "Lead by Technoheaven",
      description:
        "TRACeChain is an ongoing innovation project by Technoheaven, developing a blockchain and AI-powered platform for secure, tamper-proof academic credential verification. The system enables universities to issue immutable blockchain-based credentials through secure APIs, while an AI engine helps employers validate qualifications and match graduate skills with job requirements.",
      ctaHref: "/contact",
      ctaLabel: "Learn More",
    },
    {
      title: "NeuroMatch Insights",
      subtitle: "AI Workforce Intelligence for Precision Talent Matching",
      category: "AI/ML",
      status: "In Development",
      timeline: "2024 – 2026",
      budget: "£250,000",
      funding: "Grant & Strategic Partners",
      lead: "Lead by Technoheaven",
      description:
        "NeuroMatch Insights delivers an enterprise AI platform that analyzes workforce capabilities, predicts upskilling pathways, and aligns talent with strategic initiatives. The solution blends natural language understanding with predictive analytics to reduce hiring cycles and improve retention across global teams.",
      ctaHref: "/contact",
      ctaLabel: "Request Demo",
    },
    {
      title: "AegisShield Sentinel",
      subtitle: "Autonomous Threat Detection for Critical Infrastructure",
      category: "Deep Learning",
      status: "Live Deployment",
      timeline: "2023 – Present",
      budget: "£180,000",
      funding: "Joint Venture",
      lead: "Lead by Technoheaven",
      description:
        "AegisShield Sentinel combines multimodal deep learning models with edge computing to detect, classify, and respond to real-time security threats. Deployed across smart facilities, the platform automates incident triage, compliance reporting, and adaptive security orchestration.",
      ctaHref: "/contact",
      ctaLabel: "Explore Deployment",
    },
    {
      title: "OrionStack Nexus",
      subtitle: "Composable SaaS Backbone for Regulated Enterprises",
      category: "Software",
      status: "Completed",
      timeline: "2022 – 2024",
      budget: "£320,000",
      funding: "Enterprise Client",
      lead: "Delivered by Technoheaven",
      description:
        "OrionStack Nexus provides a modular SaaS framework with unified data governance, automated workflows, and embedded analytics for regulated industries. The delivery included cloud migration, integration accelerators, and ongoing DevOps enablement for rapid product iteration.",
      ctaHref: "/contact",
      ctaLabel: "View Case Study",
    },
  ];

  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <PageHero
          className="mb-12"
          eyebrow="Delivery Snapshots"
          title="Our Projects"
          description="Explore the programmes where Technoheaven squads have delivered measurable transformation across blockchain, AI, and software ecosystems."
          align="left"
          topic="Projects"
        >
          <p className="text-sm text-muted-foreground">
            Filter by capability to review relevant case studies and active engagements.
          </p>
        </PageHero>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              onClick={() => setFilter(category)}
              className={filter === category ? "bg-primary" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-lg p-6 hover:shadow-glow transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary">
                  {project.category}
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    project.status === "Completed"
                      ? "bg-green-500/20 text-green-500"
                      : project.status === "Live Deployment"
                        ? "bg-blue-500/20 text-blue-500"
                        : "bg-yellow-500/20 text-yellow-500"
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
                  <p className="text-sm font-medium text-primary/80">{project.subtitle}</p>
                </div>

                <div className="rounded-lg bg-muted/40 p-4 text-xs uppercase tracking-wide text-muted-foreground/90">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Timeline</span>
                      <span className="text-foreground text-sm normal-case">{project.timeline}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="text-foreground text-sm normal-case">{project.budget}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Funding</span>
                      <span className="text-foreground text-sm normal-case">{project.funding}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Leadership</span>
                      <span className="text-foreground text-sm normal-case">{project.lead}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                {project.ctaHref && (
                  <Button variant="outline" size="sm" className="group/btn w-fit" asChild>
                    <Link to={project.ctaHref}>
                      {project.ctaLabel}
                      <ExternalLink size={16} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
