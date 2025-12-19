import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ExternalLink, Loader2 } from "lucide-react";
import PageHero from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface Project {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  status: string;
  timeline: string;
  budget: string;
  funding: string;
  lead: string;
  description: string;
  cta_href: string | null;
  cta_label: string | null;
}

const Projects = () => {
  const [filter, setFilter] = useState("All");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ["All", "Blockchain", "AI/ML", "Deep Learning", "Software"];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/research/projects/");
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects.");
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

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
                  className={`text-xs px-3 py-1 rounded-full ${project.status === "Completed"
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

                {project.cta_href && (
                  <Button variant="outline" size="sm" className="group/btn w-fit" asChild>
                    <Link to={project.cta_href}>
                      {project.cta_label}
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
