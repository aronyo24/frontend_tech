import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import PageHero from "@/components/page-hero";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

interface CompanyInfo {
  email: string;
  phone: string;
  address: string;
}

const Contact = () => {
  const [info, setInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/company/info/");
        if (response.data.length > 0) {
          setInfo(response.data[0]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching contact info:", err);
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post("http://127.0.0.1:8000/company/contact-messages/", formData);
      setSubmitted(true);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-primary" />,
      title: "Email",
      details: info?.email || "info@technoheaven.org",
      link: `mailto:${info?.email || "info@technoheaven.org"}`
    },
    {
      icon: <Phone className="w-6 h-6 text-primary" />,
      title: "Phone",
      details: info?.phone || "+1 (555) 123-4567",
      link: `tel:${info?.phone?.replace(/\D/g, '') || "+15551234567"}`
    },
    {
      icon: <MapPin className="w-6 h-6 text-primary" />,
      title: "Address",
      details: info?.address || "123 Innovation Drive, Tech City, TC 12345",
      link: null
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

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
            Prefer email or phone? Reach us at {info?.email || "info@technoheaven.org"} or {info?.phone || "+1 (555) 123-4567"}.
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
              {contactInfo.map((infoItem, index) => (
                <Card key={index} className="p-6 bg-card/50 backdrop-blur hover:border-primary/50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      {infoItem.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{infoItem.title}</h3>
                      {infoItem.link ? (
                        <a href={infoItem.link} className="text-muted-foreground hover:text-primary transition-colors">
                          {infoItem.details}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{infoItem.details}</p>
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
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                  <p className="text-muted-foreground mb-6">
                    Thank you for reaching out. We'll get back to you shortly.
                  </p>
                  <Button onClick={() => setSubmitted(false)}>Send Another Message</Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Full Name
                        </label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about your project..."
                        rows={6}
                        className="bg-background/50 resize-none"
                      />
                    </div>

                    <Button
                      size="lg"
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {submitting ? (
                        <>
                          Sending...
                          <Loader2 className="ml-2 w-5 h-5 animate-spin" />
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
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
