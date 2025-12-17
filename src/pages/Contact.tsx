import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import PageHero from "@/components/page-hero";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-primary" />,
      title: "Email",
      details: "info@technoheaven.org",
      link: "mailto:info@technoheaven.org"
    },
    {
      icon: <Phone className="w-6 h-6 text-primary" />,
      title: "Phone",
      details: "+1 (555) 123-4567",
      link: "tel:+15551234567"
    },
    {
      icon: <MapPin className="w-6 h-6 text-primary" />,
      title: "Address",
      details: "123 Innovation Drive, Tech City, TC 12345",
      link: null
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto">
        <PageHero
          className="mb-16"
          eyebrow="Partner With Us"
          title="Get in Touch"
          description="Share your brief and we will set up a strategy session within one business day."
          topic="Contact"
        >
          <p className="text-sm text-muted-foreground">
            Prefer email or phone? Reach us at info@technoheaven.org or +1 (555) 123-4567.
          </p>
        </PageHero>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="p-6 bg-card/50 backdrop-blur hover:border-primary/50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{info.title}</h3>
                      {info.link ? (
                        <a href={info.link} className="text-muted-foreground hover:text-primary transition-colors">
                          {info.details}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{info.details}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="p-8 bg-card/50 backdrop-blur">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="How can we help you?"
                    className="bg-background/50"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your project..."
                    rows={6}
                    className="bg-background/50 resize-none"
                  />
                </div>

                <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                  Send Message
                  <Send className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="p-10 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 text-center">
            <h2 className="text-3xl font-semibold mb-4">Partner With Technoheaven</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Tell us about your challenge, and our team will schedule a consultation within one business day.
              We operate globally with dedicated delivery hubs to support your mission-critical initiatives.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Your Project
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
