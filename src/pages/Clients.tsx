import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Quote, Loader2 } from "lucide-react";
import PageHero from "@/components/page-hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

interface Client {
  id: number;
  name: string;
  industry: string;
  tagline: string;
  description: string;
  website: string;
  logo: string;
}

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
}

const partnershipHighlights = [
  {
    title: "Embedded product squads",
    description:
      "Cross-functional pods blend product strategy, UX, engineering, and data talent to ship iterative releases every two weeks.",
  },
  {
    title: "Enterprise-grade delivery",
    description:
      "Secure cloud architectures, compliance-ready workflows, and 24/7 observability keep mission-critical platforms resilient.",
  },
  {
    title: "Measured outcomes",
    description:
      "Dashboards and OKR reviews track learner engagement, logistics efficiency, and revenue growth across each client program.",
  },
];

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, testimonialsRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/company/clients/"),
          axios.get("http://127.0.0.1:8000/company/testimonials/")
        ]);
        setClients(clientsRes.data);
        setTestimonials(testimonialsRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching client data:", err);
        setError("Failed to load client data.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <PageHero
          className="mb-16"
          eyebrow="Trusted Partnerships"
          title="Our Clients"
          description="Education innovators, logistics leaders, and growth-focused teams rely on Technoheaven to co-create platforms that scale globally."
          topic="Clients"
        >
          <p className="text-sm text-muted-foreground">
            Here are a few of the organisations we support with long-term delivery squads and outcome-driven technology roadmaps.
          </p>
        </PageHero>

        <section className="mb-20">
          <div className="mb-8 space-y-3 text-center md:mx-auto md:max-w-3xl">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Featured Partnerships</h2>
            <p className="text-muted-foreground">
              Purpose-built teams embed alongside our clients to modernise infrastructure, introduce automation, and craft experiences that feel effortless for end users.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {clients.map((client, index) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-border/60 bg-card/90 p-8 shadow-md transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-shrink-0 items-center justify-center">
                      <img
                        src={client.logo}
                        alt={`${client.name} logo`}
                        className="h-14 w-auto object-contain md:h-20"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-foreground">{client.name}</h3>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {client.industry}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-snug">{client.tagline}</p>
                    </div>
                  </div>

                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{client.description}</p>

                  <Button asChild variant="outline" className="w-fit rounded-full border-primary/40 text-primary hover:bg-primary/10">
                    <a href={client.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
                      Visit Website
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <div className="mb-10 text-center md:mx-auto md:max-w-2xl">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Partnership at a Glance</h2>
            <p className="mt-3 text-muted-foreground">
              Every engagement is shaped around measurable impact—pairing discovery with disciplined delivery so clients gain momentum quickly.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {partnershipHighlights.map((item) => (
              <Card
                key={item.title}
                className="h-full rounded-3xl border border-border/70 bg-gradient-to-br from-primary/5 via-background to-accent/10 p-6 shadow-md"
              >
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-12 text-center md:mx-auto md:max-w-3xl">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Client Voices</h2>
            <p className="mt-3 text-muted-foreground">
              Long-term relationships and shared success stories drive how we operate. Here is what our partners say about collaborating with Technoheaven.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="flex h-full flex-col gap-6 rounded-3xl border border-border/60 bg-card/80 p-8 shadow-md transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
                  <Quote className="h-10 w-10 text-primary" />
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{testimonial.quote}</p>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-primary/80">{testimonial.role}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Clients;
