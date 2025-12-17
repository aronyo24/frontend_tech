import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useMemo, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import PageHero from "@/components/page-hero";
import { findTeamMember } from "@/data/team";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const TeamMemberDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const member = useMemo(() => findTeamMember(slug ?? ""), [slug]);

  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 pt-24 pb-16 text-slate-900 transition-colors dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-xl space-y-6 rounded-2xl border border-slate-200/70 bg-white/80 p-10 text-center shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              !
            </div>
            <div>
              <h1 className="text-3xl font-bold">Profile not found</h1>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                The team member you are looking for may have moved to another project. Explore the full roster to find the expertise you need.
              </p>
            </div>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/team">Return to Team Overview</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const firstName = member.name.split(" ")[0];

  const projectFocus = member.focusAreas ?? [];

  const heroMedia = member.image ? (
    <div className="relative h-full w-full overflow-hidden rounded-[32px]">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-sky-200/15 to-primary/5" />
      <img
        src={member.image}
        alt={`${member.name} portrait`}
        className="relative z-10 h-full w-full object-cover object-top"
      />
      <div className="absolute inset-0 rounded-[32px] border border-white/40 shadow-[0_20px_45px_rgba(15,118,229,0.25)] dark:border-slate-700/60" />
    </div>
  ) : (
    <div className="flex h-full w-full items-center justify-center rounded-[32px] bg-gradient-to-br from-primary/20 via-sky-200/30 to-primary/10 text-4xl font-semibold text-primary">
      {member.name
        .split(" ")
        .map((part) => part[0])
        .join("")}
    </div>
  );
  const renderList = (items: string[]): ReactNode => (
    <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-200">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  const renderListWithFallback = (items?: string[], placeholder?: string): ReactNode => {
    if (items && items.length > 0) {
      return renderList(items);
    }

    return (
      <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-300/80">
        {placeholder ?? "Details will be updated soon."}
      </p>
    );
  };

  const renderTextWithFallback = (text?: string, placeholder?: string): ReactNode => (
    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-200">
      {text ?? placeholder ?? "Details will be updated soon."}
    </p>
  );

  const detailSections: { id: string; title: string; content: ReactNode }[] = [
    {
      id: "bio",
      title: "Short Biography",
      content: renderTextWithFallback(
        member.bio,
        `${member.name} will share a detailed biography shortly.`
      ),
    },
    {
      id: "academic",
      title: "Academic Background",
      content: renderListWithFallback(
        member.academic,
        "Academic background information will be published soon."
      ),
    },
    {
      id: "experience",
      title: "Professional Experience",
      content: renderListWithFallback(
        member.experience,
        "Professional experience highlights will be updated soon."
      ),
    },
    {
      id: "memberships",
      title: "Professional Membership",
      content: renderListWithFallback(
        member.memberships,
        "Membership affiliations will be added shortly."
      ),
    },
    {
      id: "collaborations",
      title: "Professional Collaboration",
      content: renderListWithFallback(
        member.collaborations,
        "Collaboration updates will appear here soon."
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 pt-24 pb-16 text-slate-900 transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          size="sm"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-4 py-2 text-slate-600 shadow-sm transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary dark:border-slate-800/70 dark:bg-slate-900/50 dark:text-slate-300"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <PageHero
          className="mt-8 mb-12"
          eyebrow={member.role.toUpperCase()}
          title={member.name}
          description={
            member.bio ?? `${member.name} will share a detailed biography shortly.`
          }
          align="left"
          topic={member.role}
          media={heroMedia}
          mediaClassName="!aspect-square max-w-[20px] overflow-hidden rounded-[32px] md:!aspect-square md:max-w-[30px] lg:!aspect-square lg:max-w-[200px]"
        >
          {projectFocus.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {projectFocus.map((area) => (
                <Badge
                  key={area}
                  variant="outline"
                  className="border border-primary/30 bg-primary/5 text-primary"
                >
                  {area}
                </Badge>
              ))}
            </div>
          ) : null}
        </PageHero>

        <div className="mt-10 grid gap-10 lg:grid-cols-[320px_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="order-1 space-y-8 lg:order-2"
          >
            {detailSections.length > 0 && (
              <Accordion
                type="multiple"
                defaultValue={detailSections.length > 0 ? [detailSections[0].id] : undefined}
                className="space-y-4"
              >
                {detailSections.map((section) => (
                  <AccordionItem
                    key={section.id}
                    value={section.id}
                    className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-xl transition dark:border-slate-800/70 dark:bg-slate-900/70 dark:shadow-[0_18px_35px_rgba(2,6,23,0.35)]"
                  >
                    <AccordionTrigger className="rounded-t-3xl bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-100 px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-slate-700 transition data-[state=open]:rounded-b-none data-[state=open]:bg-white/90 dark:from-blue-900/90 dark:via-indigo-900/70 dark:to-blue-900/90 dark:text-sky-100 dark:data-[state=open]:bg-slate-900/90">
                      {section.title}
                    </AccordionTrigger>
                    <AccordionContent className="bg-white/80 px-6 dark:bg-slate-900/70">
                      <div className="space-y-3 py-5 text-slate-600 dark:text-inherit">
                        {section.content}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

            
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="order-2 flex flex-col gap-6 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-xl backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-900/70 dark:shadow-[0_25px_45px_rgba(2,6,23,0.45)] lg:order-1 lg:sticky lg:top-28"
          >
           

            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-200">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Contact</h3>
              <div className="space-y-3">
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2 transition hover:border-primary/50 hover:bg-primary/5 dark:border-slate-800/60 dark:bg-slate-900/70 dark:hover:border-sky-500/60 dark:hover:bg-slate-800/80"
                  >
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{member.phone}</span>
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2 transition hover:border-primary/50 hover:bg-primary/5 dark:border-slate-800/60 dark:bg-slate-900/70 dark:hover:border-sky-500/60 dark:hover:bg-slate-800/80"
                  >
                    <Mail className="h-4 w-4 text-primary" />
                    <span>{member.email}</span>
                  </a>
                )}
                {member.location && (
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2 dark:border-slate-800/60 dark:bg-slate-900/70">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{member.location}</span>
                  </div>
                )}
              </div>
            </div>

            {member.publications && member.publications.length > 0 && (
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-200">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Publication Profile</h3>
                <div className="space-y-2">
                  {member.publications.map((publication) => {
                    const Icon = publication.icon;
                    return (
                      <a
                        key={publication.label}
                        href={publication.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2 transition hover:border-primary/50 hover:bg-primary/5 dark:border-slate-800/60 dark:bg-slate-900/70 dark:hover:border-sky-500/60 dark:hover:bg-slate-800/80"
                      >
                        <Icon className="h-4 w-4 text-primary" />
                        <span>{publication.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {member.socials && member.socials.length > 0 && (
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-200">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Web Page &amp; Social Link</h3>
                <div className="space-y-2">
                  {member.socials.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2 transition hover:border-primary/50 hover:bg-primary/5 dark:border-slate-800/60 dark:bg-slate-900/70 dark:hover:border-sky-500/60 dark:hover:bg-slate-800/80"
                      >
                        <Icon className="h-4 w-4 text-primary" />
                        <span>{social.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberDetail;
