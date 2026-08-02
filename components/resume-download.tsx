"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/language-context";
import { getResumeDownloadFiles } from "@/lib/resume/files";
import { Download } from "lucide-react";

export default function ResumeDownload() {
  const { language = "pt" } = useLanguage() || {};
  const isEnglish = language === "en";
  const files = getResumeDownloadFiles(isEnglish ? "en" : "pt");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" aria-hidden="true" />
          {isEnglish ? "Download Resume" : "Baixar currículo"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a href={files.markdown} download>
            {isEnglish ? "Download as Markdown" : "Baixar como Markdown"}
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={files.pdf} download>
            {isEnglish ? "Download as PDF" : "Baixar como PDF"}
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
