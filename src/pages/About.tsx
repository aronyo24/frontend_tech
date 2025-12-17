import { motion } from "framer-motion";
import { Target, Eye, Lightbulb, Users } from "lucide-react";

import PageHero from "@/components/page-hero";
import { Card } from "@/components/ui/card";

const About = () => {
  const values = [
    {
      icon: <Lightbulb className="w-8 h-8 text-primary" />,
      title: "Innovation First",
      description: "Pushing boundaries with cutting-edge research and development",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Collaborative Excellence",
      description: "Working together to achieve extraordinary results",
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Client-Focused",
      description: "Delivering solutions that exceed expectations",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto">
        <PageHero
          className="mb-20"
          eyebrow="Who We Are"
          title="About Technoheaven"
          description="We are a research-led technology partner delivering blockchain, AI, and software innovation for organisations that demand measurable outcomes."
          topic="About"
        />

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 h-full bg-card/50 backdrop-blur">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-10 h-10 text-primary" />
                <h2 className="text-3xl font-bold">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To drive technological advancement through innovative research and development in Blockchain, 
                Artificial Intelligence, Machine Learning, and Software Engineering. We strive to create solutions 
                that transform industries and improve lives globally.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 h-full bg-card/50 backdrop-blur">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-10 h-10 text-primary" />
                <h2 className="text-3xl font-bold">Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To be the global leader in emerging technology research, setting new standards for innovation 
                and excellence. We envision a future where our solutions empower businesses and individuals 
                to achieve their full potential through technology.
              </p>
            </Card>
          </motion.div>
        </div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur">
                  <div className="mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Research Focus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-12 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <h2 className="text-4xl font-bold mb-8 text-center">Our Research Focus Areas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Blockchain Technology</h3>
                    <p className="text-muted-foreground">Distributed ledger systems, smart contracts, and decentralized applications</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Artificial Intelligence</h3>
                    <p className="text-muted-foreground">Neural networks, natural language processing, and computer vision</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Machine Learning</h3>
                    <p className="text-muted-foreground">Predictive models, data analytics, and automated decision systems</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Software Engineering</h3>
                    <p className="text-muted-foreground">Scalable architectures, cloud solutions, and modern development practices</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
