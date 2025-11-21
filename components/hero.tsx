"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import { ArrowDown, FileText, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { useSiteConfig } from "@/hooks/use-site-config";

export default function Hero() {
  const { language, t } = useLanguage();
  const { config } = useSiteConfig();

  const roles = [
    "SRE | Cloud Engineer",
    "DevOps Specialist",
    "Platform Engineer",
    "Automation Expert"
  ];

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden py-12 text-center md:py-24" suppressHydrationWarning>
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-gold/5 blur-[100px]" />
        <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container z-10 flex flex-col items-center gap-6"
      >
        <div className="inline-flex items-center rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-sm text-gold backdrop-blur-sm" suppressHydrationWarning>
          <span className="mr-2 h-2 w-2 rounded-full bg-gold animate-pulse" />
          {language === 'en' ? 'Available for new opportunities' : 'Disponível para novos projetos'}
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          {config.site.shortName}
          <span className="block text-gold mt-2 h-[1.2em]">
            <Typewriter
              options={{
                strings: roles,
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 30,
              }}
            />
          </span>
        </h1>

        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8" suppressHydrationWarning>
          {language === 'en'
            ? "Transforming complex infrastructure into reliable, scalable, and automated systems. Specialized in AWS, Kubernetes, and Cloud Native technologies."
            : "Transformando infraestrutura complexa em sistemas confiáveis, escaláveis e automatizados. Especializado em AWS, Kubernetes e tecnologias Cloud Native."}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-4" suppressHydrationWarning>
          <Button asChild size="lg" className="bg-gold text-black hover:bg-gold/90 gap-2">
            <Link href="/contact">
              <Mail className="h-4 w-4" suppressHydrationWarning />
              {language === 'en' ? 'Get in Touch' : 'Entre em Contato'}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 border-gold/20 hover:bg-gold/5">
            <Link href="/resume" target="_blank">
              <FileText className="h-4 w-4" suppressHydrationWarning />
              {language === 'en' ? 'View Resume' : 'Ver Currículo'}
            </Link>
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        suppressHydrationWarning
      >
        <ArrowDown className="h-6 w-6 text-muted-foreground" suppressHydrationWarning />
      </motion.div>
    </section>
  );
}
