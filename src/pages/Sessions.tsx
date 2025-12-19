import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, Loader2 } from "lucide-react";
import PageHero from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface Session {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  description: string;
}

const Sessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/research/sessions/");
        setSessions(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError("Failed to load sessions.");
        setLoading(false);
      }
    };
    fetchSessions();
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
          eyebrow="Community"
          title="Sessions & Events"
          description="Interactive workshops, symposiums, and masterclasses led by Technoheaven experts and partners."
          topic="Sessions"
        >
          <p className="text-sm text-muted-foreground">
            Reserve your seat to learn, collaborate, and co-create with our multidisciplinary teams.
          </p>
        </PageHero>

        <div className="space-y-6">
          {sessions.map((session, index) => (
            <motion.div
              key={session.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-lg p-6 hover:shadow-glow transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-3">{session.title}</h3>
                  <p className="text-muted-foreground mb-4">{session.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="text-primary" size={18} />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="text-primary" size={18} />
                      <span>{session.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="text-primary" size={18} />
                      <span>{session.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="text-primary" size={18} />
                      <span>{session.attendees} Attendees</span>
                    </div>
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90 whitespace-nowrap">
                  Register Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sessions;
