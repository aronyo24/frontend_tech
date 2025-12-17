import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import PageHero from "@/components/page-hero";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const images = [
    {
      id: 1,
      title: "AI Research Lab",
      category: "Research",
      description: "Prototype testing of multimodal vision models in our applied research lab.",
      src: "https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 2,
      title: "Blockchain Network",
      category: "Blockchain",
      description: "Distributed ledger topology visualisation for a regulated finance deployment.",
      src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 3,
      title: "ML Model Training",
      category: "AI/ML",
      description: "Edge compute pipeline monitoring during large-scale model training.",
      src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 4,
      title: "Tech Conference 2024",
      category: "Events",
      description: "Keynote session highlighting breakthroughs in quantum-assisted optimisation.",
      src: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 5,
      title: "Team Workshop",
      category: "Events",
      description: "Service design sprint uniting strategists, engineers, and domain experts.",
      src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 6,
      title: "Innovation Center",
      category: "Research",
      description: "Prototype lab where emerging tech pilots are iterated with partners.",
      src: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 7,
      title: "Smart Contract Development",
      category: "Blockchain",
      description: "Security engineers conducting a live audit of mission-critical smart contracts.",
      src: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 8,
      title: "Deep Learning Project",
      category: "AI/ML",
      description: "Model interpretability session reviewing saliency maps for explainability.",
      src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 9,
      title: "Client Meeting",
      category: "Business",
      description: "Roadmap alignment workshop with enterprise stakeholders and delivery pods.",
      src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <PageHero
          className="mb-16"
          eyebrow="Inside Technoheaven"
          title="Gallery"
          description="A visual narrative of how our teams research, prototype, and deliver transformative technology."
          topic="Gallery"
        >
          <p className="text-sm text-muted-foreground">
            Tap any tile to preview highlights from labs, events, and client collaborations.
          </p>
        </PageHero>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <motion.button
              type="button"
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedImage(index)}
              className="relative group aspect-square overflow-hidden rounded-3xl bg-card text-left transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <img
                src={image.src}
                alt={`${image.title} preview`}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent transition-opacity duration-300 group-hover:from-background/80" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6 text-white">
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">{image.category}</span>
                <h3 className="text-lg font-semibold">{image.title}</h3>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-card hover:bg-accent"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-background/80 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={images[selectedImage].src}
                alt={`${images[selectedImage].title} full preview`}
                className="h-full w-full max-h-[70vh] object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 text-white">
                <h2 className="text-2xl font-semibold">{images[selectedImage].title}</h2>
                <p className="text-sm text-white/70">{images[selectedImage].category}</p>
                <p className="mt-3 text-sm text-white/80">{images[selectedImage].description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
