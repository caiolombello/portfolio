"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import ContactForm from "./contact-form";
import { useLanguage } from "@/contexts/language-context";
import { useSiteConfig } from "@/hooks/use-site-config";
import type { Profile } from "@/types/profile";

interface ContactProps {
  profile: Profile | null;
}

export default function Contact({ profile }: ContactProps) {
  const { language } = useLanguage();
  const { config } = useSiteConfig();
  const isEnglish = language === "en";
  const currentProfile = profile?.[language] || profile?.pt;
  const email = profile?.email || config.site.email;
  const phone = profile?.phone || config.site.phone;
  const location = currentProfile?.location || config.site.location;
  const socialLinks = {
    ...config.social,
    ...(profile?.socialLinks || {}),
  } as { github?: string; linkedin?: string; whatsapp?: string };

  const copy = isEnglish
    ? {
        eyebrow: "Contact",
        title: "Let's make the next delivery path clearer.",
        description: "Whether you are hiring for a platform challenge or need a second pair of eyes on reliability, send a note with the context and I will get back to you.",
        info: "Direct channels",
        email: "Email",
        phone: "Phone / WhatsApp",
        location: "Location",
        form: "Send a message",
        formDescription: "A short context is enough to start.",
      }
    : {
        eyebrow: "Contato",
        title: "Vamos deixar o próximo caminho de entrega mais claro.",
        description: "Se você está contratando para um desafio de plataforma ou precisa de uma segunda visão sobre confiabilidade, envie o contexto e eu retorno.",
        info: "Canais diretos",
        email: "Email",
        phone: "Telefone / WhatsApp",
        location: "Localização",
        form: "Enviar mensagem",
        formDescription: "Um pouco de contexto já é suficiente para começar.",
      };

  return (
    <div className="container py-12 sm:py-20">
      <motion.header animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">{copy.eyebrow}</p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-6xl">{copy.title}</h1>
        <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">{copy.description}</p>
      </motion.header>

      <div className="mt-10 grid gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
        <motion.aside animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} className="rounded-2xl border border-border/80 bg-card/50 p-5 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-gold">{copy.info}</p>
          <div className="mt-8 space-y-6">
            <div className="flex items-start gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold"><Mail className="h-4 w-4" aria-hidden="true" /></span><div><p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{copy.email}</p><Link href={`mailto:${email}`} className="mt-1 block break-all text-sm font-medium text-foreground transition-colors hover:text-gold">{email}</Link></div></div>
            <div className="flex items-start gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold"><Phone className="h-4 w-4" aria-hidden="true" /></span><div><p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{copy.phone}</p><div className="mt-1 flex flex-wrap gap-3 text-sm font-medium"><Link href={`tel:${phone}`} className="text-foreground transition-colors hover:text-gold">{phone}</Link><Link href={`https://wa.me/${phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-gold hover:text-foreground">WhatsApp <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></Link></div></div></div>
            <div className="flex items-start gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold"><MapPin className="h-4 w-4" aria-hidden="true" /></span><div><p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{copy.location}</p><p className="mt-1 text-sm font-medium text-foreground">{location}</p></div></div>
          </div>
          <div className="mt-10 flex gap-2 border-t border-border/70 pt-6">
            {socialLinks.github && <Link href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/80 text-muted-foreground transition-colors hover:border-gold/50 hover:text-gold" aria-label="GitHub"><Github className="h-4 w-4" aria-hidden="true" /></Link>}
            {socialLinks.linkedin && <Link href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/80 text-muted-foreground transition-colors hover:border-gold/50 hover:text-gold" aria-label="LinkedIn"><Linkedin className="h-4 w-4" aria-hidden="true" /></Link>}
            {socialLinks.whatsapp && <Link href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/80 text-muted-foreground transition-colors hover:border-gold/50 hover:text-gold" aria-label="WhatsApp"><MessageCircle className="h-4 w-4" aria-hidden="true" /></Link>}
          </div>
        </motion.aside>

        <motion.div animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }} className="rounded-2xl border border-border/80 bg-card/50 p-5 sm:p-8">
          <div className="mb-8"><p className="font-mono text-xs uppercase tracking-[0.16em] text-gold">{copy.form}</p><p className="mt-3 text-sm text-muted-foreground">{copy.formDescription}</p></div>
          <ContactForm />
        </motion.div>
      </div>
    </div>
  );
}
