import type { LucideIcon } from "lucide-react";
import {
  Linkedin,
  Twitter,
  Mail,
  Globe,
  Facebook,
  Github,
  Network,
  BookOpen,
} from "lucide-react";

export type SocialLink = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  image?: string;
  phone?: string;
  email?: string;
  location?: string;
  socials?: SocialLink[];
  bio?: string;
  academic?: string[];
  experience?: string[];
  memberships?: string[];
  collaborations?: string[];
  focusAreas?: string[];
  publications?: SocialLink[];
};

export const teamMembers: TeamMember[] = [
  {
    slug: "sujit-biswas",
    name: "Dr. Sujit Biswas",
    role: "CEO and Founder",
    phone: "+880 1700-000000",
    email: "sujit@technoheaven.org",
    location: "Dhaka, Bangladesh",
    image: "https://img.freepik.com/premium-vector/cartoon-man-with-shirt-that-says-hes-smiling_481747-88215.jpg?semt=ais_hybrid&w=740&q=80",
    publications: [
      { label: "ResearchGate", href: "https://www.researchgate.net/", icon: Network },
      { label: "Google Scholar", href: "https://scholar.google.com/", icon: BookOpen },
    ],
    socials: [
      { label: "Website", href: "https://technoheaven.org/", icon: Globe },
      { label: "LinkedIn", href: "https://www.linkedin.com/", icon: Linkedin },
      { label: "Facebook", href: "https://www.facebook.com/", icon: Facebook },
      { label: "GitHub", href: "https://github.com/", icon: Github },
    ],
    bio: "Founder of Technoheaven, leading strategic alliances and steering innovation programmes across the organisation.",
    focusAreas: ["Corporate Strategy", "Global Partnerships", "Innovation Governance"],
  },
  {
    slug: "aronyo-mojumder",
    name: "Aronyo Mojumder",
    role: "Software Developer & Research Assistant",
    phone: "+880 1700-123456",
    email: "aronyo@technoheaven.org",
    location: "Dhaka, Bangladesh",
    image: "https://img.freepik.com/premium-vector/cartoon-man-with-shirt-that-says-hes-smiling_481747-88215.jpg?semt=ais_hybrid&w=740&q=80",
    publications: [
      { label: "ResearchGate", href: "https://www.researchgate.net/", icon: Network },
      { label: "Google Scholar", href: "https://scholar.google.com/", icon: BookOpen },
    ],
    socials: [
      { label: "Website", href: "https://technoheaven.org/", icon: Globe },
      { label: "LinkedIn", href: "https://www.linkedin.com/", icon: Linkedin },
      { label: "Facebook", href: "https://www.facebook.com/", icon: Facebook },
      { label: "GitHub", href: "https://github.com/", icon: Github },
    ],
    bio: "Builds secure digital products, supports applied research, and bridges client delivery needs with innovation squads.",
    focusAreas: ["Full Stack Delivery", "Research Platform Ops", "Client Discovery"],
  },
  
];

export const findTeamMember = (slug: string) => teamMembers.find((member) => member.slug === slug);
