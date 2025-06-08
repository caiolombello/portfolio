import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function BlogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PortfolioGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[250px] w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, j) => (
              <Skeleton key={j} className="h-6 w-20" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AboutSkeleton() {
  return (
    <section className="container py-12 md:py-16">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Coluna Esquerda - Informações Pessoais */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          {/* Avatar Skeleton */}
          <Skeleton className="mb-6 h-48 w-48 sm:h-64 sm:w-64 rounded-full" />

          {/* Nome */}
          <Skeleton className="mb-2 h-8 w-3/4 md:h-10" />

          {/* Título */}
          <Skeleton className="mb-6 h-6 w-1/2" />

          {/* Contatos */}
          <div className="mb-8 flex flex-col gap-3 w-full">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>

          {/* Botões */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>

        {/* Coluna Direita - Sobre e Habilidades */}
        <div className="flex flex-col">
          {/* Título Sobre */}
          <Skeleton className="mb-4 h-8 w-24" />

          {/* Parágrafo sobre */}
          <div className="mb-8 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Título Habilidades */}
          <Skeleton className="mb-6 h-8 w-48" />

          {/* Skills List Skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactSkeleton() {
  return (
    <div className="container py-12">
      {/* Header Section */}
      <div className="mb-16 flex flex-col items-center text-center">
        <Skeleton className="mb-8 h-40 w-40 rounded-full" />
        <Skeleton className="mb-3 h-10 w-80" />
        <Skeleton className="h-6 w-48" />
      </div>

      <div className="mx-auto max-w-5xl grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Contact Information */}
        <div className="space-y-8 rounded-lg border border-border/40 bg-card p-8 shadow-md">
          <Skeleton className="h-8 w-48 mb-8" />

          <div className="space-y-6">
            {/* Contact Items */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-lg border border-border/40 bg-card p-8 shadow-md">
          <Skeleton className="mb-8 h-8 w-40" />
          
          <div className="space-y-6">
            {/* Form Fields */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-24 w-full" />
            </div>
            
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResumeSkeleton() {
  return (
    <div className="space-y-8">
      {/* Experience Section Skeleton */}
      <section>
        <Skeleton className="h-8 w-48 mb-4" /> {/* Section Title */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={`exp-${i}`}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" /> {/* Job Title */}
                <Skeleton className="h-4 w-1/2" /> {/* Company & Period */}
              </CardHeader>
              <CardContent className="space-y-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={`exp-${i}-resp-${j}`} className="h-4 w-full" />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Education Section Skeleton */}
      <section>
        <Skeleton className="h-8 w-48 mb-4" /> {/* Section Title */}
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={`edu-${i}`}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" /> {/* Degree */}
                <Skeleton className="h-4 w-1/2" /> {/* Institution & Period */}
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" /> {/* Description */}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Skills Section Skeleton */}
      <section>
        <Skeleton className="h-8 w-48 mb-4" /> {/* Section Title */}
        <Tabs defaultValue="technical">
          <TabsList className="mb-4">
            <Skeleton className="h-10 w-24 mx-1" /> {/* Technical Tab */}
            <Skeleton className="h-10 w-24 mx-1" /> {/* Soft Skills Tab */}
          </TabsList>
          <TabsContent value="technical">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={`skill-${i}`} className="space-y-2">
                  <Skeleton className="h-5 w-24" /> {/* Skill Name */}
                  <Skeleton className="h-6 w-16" /> {/* Skill Level */}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Certifications Section Skeleton */}
      <section>
        <Skeleton className="h-8 w-48 mb-4" /> {/* Section Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={`cert-${i}`}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />{" "}
                {/* Certification Name */}
                <Skeleton className="h-4 w-1/2" /> {/* Issuer & Date */}
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Download Button Skeleton */}
      <div className="flex justify-center mt-8">
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
}
