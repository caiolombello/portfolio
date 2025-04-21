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
