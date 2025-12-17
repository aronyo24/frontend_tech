import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import PageHero from "@/components/page-hero";
import { Button } from "@/components/ui/button";

const Sessions = () => {
  const sessions = [
    {
      title: "AI & Machine Learning Workshop",
      date: "March 15, 2024",
      time: "2:00 PM - 5:00 PM",
      location: "Virtual Event",
      attendees: 150,
      description: "Deep dive into latest ML techniques and practical implementations",
    },
    {
      title: "Blockchain Development Bootcamp",
      date: "March 22, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "Tech Hub, Floor 3",
      attendees: 80,
      description: "Learn to build decentralized applications from scratch",
    },
    {
      title: "Research Symposium 2024",
      date: "April 5, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "Convention Center",
      attendees: 300,
      description: "Annual gathering of researchers and innovators",
    },
    {
      title: "Deep Learning Masterclass",
      date: "April 18, 2024",
      time: "1:00 PM - 5:00 PM",
      location: "Virtual Event",
      attendees: 200,
      description: "Advanced neural network architectures and training techniques",
    },
  ];

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
