import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Network, Brain, Cpu, Code, Database, Shield, Zap, GitBranch } from "lucide-react";
import PageHero from "@/components/page-hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Services = () => {
  const services = [
    {
      icon: <Network className="h-6 w-6" />,
      title: "Blockchain Development",
      description: "End-to-end blockchain solutions including smart contract development, dApp creation, and distributed ledger implementation.",
      features: [
        "Smart Contract Development",
        "DeFi Platform Creation",
        "NFT Marketplace Development",
        "Blockchain Consulting"
      ],
      category: "Blockchain" as const,
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Artificial Intelligence",
      description: "Custom AI solutions that leverage machine intelligence to automate processes and generate insights from complex data.",
      features: [
        "Natural Language Processing",
        "Computer Vision Systems",
        "Predictive Analytics",
        "AI Model Training & Deployment"
      ],
      category: "AI/ML" as const,
    },
    {
      icon: <Cpu className="h-6 w-6" />,
      title: "Machine Learning",
      description: "Data-driven ML models for pattern recognition, prediction, and intelligent automation across various domains.",
      features: [
        "Supervised Learning Models",
        "Unsupervised Learning",
        "Reinforcement Learning",
        "ML Pipeline Development"
      ],
      category: "AI/ML" as const,
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Software Development",
      description: "Full-stack software engineering services with modern frameworks, scalable architectures, and best practices.",
      features: [
        "Web Application Development",
        "Mobile App Development",
        "API Design & Integration",
        "Cloud-Native Solutions"
      ],
      category: "Software" as const,
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Deep Learning",
      description: "Advanced neural network architectures for complex pattern recognition and decision-making systems.",
      features: [
        "Neural Network Design",
        "Image & Video Analysis",
        "Speech Recognition",
        "Autonomous Systems"
      ],
      category: "Deep Learning" as const,
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Cybersecurity",
      description: "Comprehensive security solutions to protect your digital assets and ensure data privacy.",
      features: [
        "Security Audits",
        "Penetration Testing",
        "Smart Contract Auditing",
        "Compliance Solutions"
      ],
      category: "Software" as const,
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Research & Innovation",
      description: "Cutting-edge research in emerging technologies to keep you ahead of the curve.",
      features: [
        "Technology Research",
        "Proof of Concept Development",
        "Innovation Consulting",
        "Technical Feasibility Studies"
      ],
      category: "Deep Learning" as const,
    },
    {
      icon: <GitBranch className="h-6 w-6" />,
      title: "DevOps & Infrastructure",
      description: "Modern DevOps practices and cloud infrastructure solutions for scalable, reliable systems.",
      features: [
        "CI/CD Pipeline Setup",
        "Cloud Migration",
        "Infrastructure as Code",
        "Performance Optimization"
      ],
      category: "Software" as const,
    }
  ];

  const categories = ["All", "Blockchain", "AI/ML", "Deep Learning", "Software"] as const;
  type Category = (typeof categories)[number];

  const [filter, setFilter] = useState<Category>("All");

  const filteredServices = filter === "All" ? services : services.filter((service) => service.category === filter);

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
                      {service.icon}
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
