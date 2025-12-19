import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Network, Brain, Cpu, Code, Database, Shield, Zap, GitBranch, Loader2 } from "lucide-react";
import PageHero from "@/components/page-hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string;
  features: string[];
}

const IconMap: Record<string, React.ReactNode> = {
  Network: <Network className="h-6 w-6" />,
  Brain: <Brain className="h-6 w-6" />,
  Cpu: <Cpu className="h-6 w-6" />,
  Code: <Code className="h-6 w-6" />,
  Database: <Database className="h-6 w-6" />,
  Shield: <Shield className="h-6 w-6" />,
  Zap: <Zap className="h-6 w-6" />,
  GitBranch: <GitBranch className="h-6 w-6" />,
};

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", "Blockchain", "AI/ML", "Deep Learning", "Software"];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/service/");
        setServices(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again later.");
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = filter === "All"
    ? services
    : services.filter((service) => service.category === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <div>
          <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto">
        <PageHero
          className="mb-16"
          eyebrow="Delivery Expertise"
          title="Our Services"
          description="Cross-functional squads blending strategy, research, and engineering to deliver future-ready platforms and products."
          topic="Services"
        >
          <p className="text-sm text-muted-foreground">
            Select a focus area to explore detailed capabilities and delivery accelerators.
          </p>
        </PageHero>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              onClick={() => setFilter(category)}
              className={filter === category ? "bg-primary text-primary-foreground" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="flex h-full flex-col gap-6 bg-card p-6 transition-all duration-300 hover:shadow-glow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-3 text-primary">
                      {IconMap[service.icon] || <Code className="h-6 w-6" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{service.title}</h3>
                      <p className="text-xs uppercase tracking-wide text-primary/80">Professional Service</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <Button size="sm" className="mt-auto bg-primary hover:bg-primary/90" asChild>
                  <Link to="/contact">Get Quote</Link>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <Card className="p-12 text-center bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              We offer tailored services to meet your specific technology requirements
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Contact Our Team
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
