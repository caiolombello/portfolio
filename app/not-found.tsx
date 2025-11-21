"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";

export default function NotFound() {
  const { language } = useLanguage();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        <h1 className="text-[10rem] font-bold leading-none tracking-tighter text-gold/20">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-foreground">
            {language === "en" ? "Page Not Found" : "Página Não Encontrada"}
          </span>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8 max-w-[500px] text-muted-foreground"
      >
        {language === "en"
          ? "Oops! The page you're looking for seems to have wandered off into the cloud. Let's get you back on track."
          : "Ops! A página que você está procurando parece ter se perdido na nuvem. Vamos colocar você de volta no caminho certo."}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <Button asChild variant="default" className="gap-2 bg-gold text-black hover:bg-gold/90">
          <Link href="/">
            <Home size={16} />
            {language === "en" ? "Back to Home" : "Voltar ao Início"}
          </Link>
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/blog">
            <FileText size={16} />
            {language === "en" ? "Read the Blog" : "Ler o Blog"}
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
