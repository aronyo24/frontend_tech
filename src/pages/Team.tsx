import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users, Lightbulb, Globe2, Heart, ArrowRight, Loader2,
  Linkedin, Twitter, Mail, Globe, Facebook, Github, Network, BookOpen
} from "lucide-react";

import PageHero from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";

interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

interface TeamMember {
  id: number;
  slug: string;
  name: string;
  role: string;
  image: string | null;
  socials: SocialLink[];
  bio: string;
}

const SocialIconMap: Record<string, any> = {
  Linkedin,
  Twitter,
  Mail,
  Globe,
  Facebook,
  Github,
  Network,
  BookOpen,
};

const stats = [
  {
    icon: Users,
    label: "Specialists",
    value: "5",
    description:
      "Leadership, research, engineering, and partner success teaming across programmes.",
  },
  {
    icon: Lightbulb,
    label: "Focus Areas",
    value: "15+",
    description:
      "Combined domains covering AI, full stack delivery, outreach, and strategic partnerships.",
  },
  {
    icon: Globe2,
    label: "Global Collaboration",
    value: "3",
    description:
      "Remote contributors and industry liaison working across continents and time zones.",
  },
];

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/company/team/");
        setTeamMembers(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching team:", err);
        setError("Failed to load team members.");
        setLoading(false);
      }
    };
    fetchTeam();
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
          eyebrow="People First"
          title="The Team Behind Technoheaven"
          description="Meet the leaders, researchers, engineers, and partner success specialists powering every programme."
          topic="Team"
        />

        <section className="mb-20">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full bg-card/60 p-6">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-primary/10 p-3 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground/80">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{stat.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Meet the Team</h2>
            <p className="mt-3 max-w-3xl text-muted-foreground md:mx-auto">
              A single roster of leaders, researchers, engineers, and partner success specialists working together to advance Technoheaven.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group flex h-full flex-col justify-between rounded-2xl border border-border/60 bg-card/90 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                  <div className="flex items-center gap-4">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={`${member.name} portrait`}
                        className="h-32 w-32 rounded-xl object-cover object-top shadow-md"
                      />
                    ) : (
                      <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-xl font-bold text-white shadow-md">
                        {member.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                    )}

                    <div className="space-y-1">
                      <h2 className="text-lg font-semibold text-foreground md:text-xl">{member.name}</h2>
                      <div className="h-1 w-12 rounded-full bg-primary/40 transition-all duration-300 group-hover:w-16" />
                      <p className="text-sm font-medium text-muted-foreground">{member.role}</p>
                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        {member.socials && member.socials.map((social) => {
                          const Icon = SocialIconMap[social.icon] || Globe;
                          return (
                            <a
                              key={social.label}
                              href={social.href}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={social.label}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/80 text-muted-foreground transition-colors duration-200 hover:border-primary hover:text-primary hover:shadow-sm"
                            >
                              <Icon className="h-4 w-4" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="mt-6 w-full rounded-full border-primary/30 text-sm font-semibold transition-colors hover:border-primary hover:bg-primary/10"
                  >
                    <Link to={`/team/${member.slug}`} className="flex items-center justify-center gap-2 text-sm font-semibold">
                      View profile
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 p-10 text-center md:text-left">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold text-foreground">
                  Bring our specialists onto your next programme
                </h2>
                <p className="mt-3 text-lg text-muted-foreground">
                  We assemble cross-functional pods tailored to your mission-critical needs. Share your challenges and we will connect you to the right experts.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <Link to="/services">Explore Services</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">Book a Consultation</Link>
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Team;
