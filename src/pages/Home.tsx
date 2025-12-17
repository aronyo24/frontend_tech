import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Cpu,
  Brain,
  Network,
  Code,
  BookOpen,
  Mail,
  Users,
  Layers,
  Briefcase,
  NotebookText,
  Handshake,
  Presentation,
} from "lucide-react";
import Hero from "@/components/Hero";

const Home = () => {
  const siteHighlights = [
    {
      title: "About Technoheaven",
      description: "Meet the leadership team, our mission, and the innovation culture driving every engagement.",
      href: "/about",
      icon: Users,
    },
    {
      title: "Services Portfolio",
      description: "Explore blockchain, AI, and software offerings crafted to accelerate digital transformation.",
      href: "/services",
      icon: Layers,
    },
    {
      title: "Flagship Projects",
      description: "Review enterprise case studies showcasing measurable impact across industries.",
      href: "/projects",
      icon: Briefcase,
    },
    {
      title: "Research & Publications",
      description: "Dive into whitepapers and insights from our research labs and university partners.",
      href: "/publications",
      icon: NotebookText,
    },
    {
      title: "Clients & Partners",
      description: "See how we co-create value with global brands, institutions, and emerging ventures.",
      href: "/clients",
      icon: Handshake,
    },
    {
      title: "Sessions & Events",
      description: "Join upcoming masterclasses, innovation sprints, and community learning sessions.",
      href: "/sessions",
      icon: Presentation,
    },
  ];

  const services = [
    {
      icon: <Network className="w-8 h-8 text-primary" />,
      title: "Blockchain Development",
      description: "Building secure and scalable blockchain solutions for the future of decentralized technology.",
    },
    {
      icon: <Brain className="w-8 h-8 text-primary" />,
      title: "Artificial Intelligence",
      description: "Advanced AI systems that learn, adapt, and solve complex problems with human-like intelligence.",
    },
    {
      icon: <Cpu className="w-8 h-8 text-primary" />,
      title: "Machine Learning",
      description: "Data-driven solutions that uncover patterns and enable predictive analytics for business growth.",
    },
    {
      icon: <Code className="w-8 h-8 text-primary" />,
      title: "Software Development",
      description: "Custom software solutions engineered to perfection with modern technologies and best practices.",
    },
  ];

  const projects = [
    {
      title: "Neural Network Optimization",
      category: "AI Research",
      description: "Advanced deep learning architecture for real-time image processing",
    },
    {
      title: "DeFi Trading Platform",
      category: "Blockchain",
      description: "Secure decentralized exchange with smart contract integration",
    },
    {
      title: "Predictive Analytics Engine",
      category: "Machine Learning",
      description: "Enterprise-grade ML system for financial forecasting",
    },
  ];

  const blogPosts = [
    {
      title: "The Future of Quantum Computing in AI",
      date: "December 1, 2025",
      excerpt: "Exploring how quantum algorithms will revolutionize machine learning models...",
    },
    {
      title: "Smart Contracts: Beyond Cryptocurrency",
      date: "November 28, 2025",
      excerpt: "Real-world applications of blockchain technology in various industries...",
    },
    {
      title: "Deep Learning at Scale",
      date: "November 25, 2025",
      excerpt: "Best practices for training large neural networks efficiently...",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {/* Hero Section */}
      <Hero />

      {/* Page Highlights */}
      <section className="py-20 px-4 bg-card/20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Discover Technoheaven</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Get a snapshot of everything we offer, then dive deeper into the pages that matter most to you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {siteHighlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full bg-card/60 backdrop-blur p-6 transition-all duration-300 hover:shadow-glow">
                    <div className="flex flex-col gap-4 h-full">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-3 text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">{highlight.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
                        {highlight.description}
                      </p>
                      <div>
                        <Link
                          to={highlight.href}
                          className="inline-flex items-center gap-2 font-semibold text-primary hover:text-primary/80 transition-colors"
                        >
                          Learn More
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Our Expertise</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive solutions across emerging technology domains
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:border-primary/50 transition-all duration-300 group bg-card/50 backdrop-blur">
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                View All Services
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Innovation in action - our latest breakthroughs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur">
                  <div className="text-sm text-primary font-medium mb-2">{project.category}</div>
                  <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                  <p className="text-muted-foreground text-sm">{project.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Latest Insights</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Thought leadership and technical deep-dives
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:border-primary/50 transition-all duration-300 group bg-card/50 backdrop-blur">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <BookOpen className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{post.excerpt}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/blog">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Read More Articles
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-12 text-center bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <Mail className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Ready to Innovate?</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Let's discuss how our expertise can transform your ideas into reality
              </p>
              <Link to="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                  Get in Touch
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
