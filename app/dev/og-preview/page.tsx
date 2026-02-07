"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OGPreviewPage() {
  const { toast } = useToast();
  const [customTitle, setCustomTitle] = useState("");
  const [customSubtitle, setCustomSubtitle] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const conventionPages = [
    {
      name: "Homepage",
      description: "Main page OG image (convention file)",
      url: "/opengraph-image",
      badge: "Convention",
      color: "bg-emerald-500"
    },
    {
      name: "Blog",
      description: "Blog listing OG image (convention file)",
      url: "/blog/opengraph-image",
      badge: "Convention",
      color: "bg-purple-500"
    },
    {
      name: "Contact",
      description: "Contact page OG image (convention file)",
      url: "/contact/opengraph-image",
      badge: "Convention",
      color: "bg-green-500"
    },
    {
      name: "Resume",
      description: "Resume page OG image (convention file)",
      url: "/resume/opengraph-image",
      badge: "Convention",
      color: "bg-orange-500"
    },
  ];

  const apiPages = [
    {
      name: "API - Default",
      description: "Fallback OG via /api/og (homepage style)",
      url: "/api/og",
      badge: "API",
      color: "bg-blue-500"
    },
    {
      name: "API - With Title",
      description: "Fallback OG with custom title",
      url: "/api/og?title=My+Project&subtitle=A+cool+project+description",
      badge: "API",
      color: "bg-blue-400"
    },
  ];

  const refresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const copyUrl = (url: string) => {
    const fullUrl = `${baseUrl}${url}`;
    navigator.clipboard.writeText(fullUrl);
    toast({
      title: "URL copied!",
      description: "Image URL copied to clipboard.",
    });
  };

  const openInNewTab = (url: string) => {
    window.open(`${baseUrl}${url}`, '_blank');
  };

  const generateCustomPreviewUrl = () => {
    if (!customTitle.trim()) return null;
    const params = new URLSearchParams();
    params.append('title', customTitle);
    if (customSubtitle.trim()) {
      params.append('subtitle', customSubtitle);
    }
    return `/api/og?${params.toString()}`;
  };

  const customPreviewUrl = generateCustomPreviewUrl();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gold">
          Open Graph Preview Tester
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Preview how your social images look when shared on Facebook, Twitter, LinkedIn, and WhatsApp.
        </p>
        <Button onClick={refresh} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Reload Previews
        </Button>
      </div>

      {/* Convention file previews */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Convention Files (opengraph-image.tsx)</h2>
        <p className="text-muted-foreground mb-6">
          These are the actual images served by Next.js for each route. They take priority over /api/og.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {conventionPages.map((page) => (
            <Card key={`${page.name}-${refreshKey}`} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {page.name}
                      <Badge className={`${page.color} text-white`}>
                        {page.badge}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{page.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyUrl(page.url)} className="gap-1">
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openInNewTab(page.url)} className="gap-1">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-[1200/630] bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${baseUrl}${page.url}?t=${refreshKey}`}
                    alt={`Preview for ${page.name}`}
                    className="w-full h-full object-cover border-t"
                    onError={(e) => {
                      e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="%23121212"/><text x="600" y="315" text-anchor="middle" fill="%23FFD700" font-size="48" font-family="Arial">Error loading preview</text></svg>`;
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* API route previews */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">API Route (/api/og)</h2>
        <p className="text-muted-foreground mb-6">
          Fallback OG image generator used for routes without convention files (e.g., portfolio projects).
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {apiPages.map((page) => (
            <Card key={`${page.name}-${refreshKey}`} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {page.name}
                      <Badge className={`${page.color} text-white`}>
                        {page.badge}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{page.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyUrl(page.url)} className="gap-1">
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openInNewTab(page.url)} className="gap-1">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-[1200/630] bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${baseUrl}${page.url}${page.url.includes('?') ? '&' : '?'}t=${refreshKey}`}
                    alt={`Preview for ${page.name}`}
                    className="w-full h-full object-cover border-t"
                    onError={(e) => {
                      e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="%23121212"/><text x="600" y="315" text-anchor="middle" fill="%23FFD700" font-size="48" font-family="Arial">Error loading preview</text></svg>`;
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Custom preview */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Preview (API Route)</CardTitle>
          <CardDescription>
            Test custom titles and subtitles via the /api/og endpoint
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="custom-title">Title *</Label>
              <Input
                id="custom-title"
                placeholder="e.g. My Project"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-subtitle">Subtitle (optional)</Label>
              <Input
                id="custom-subtitle"
                placeholder="e.g. A brief description"
                value={customSubtitle}
                onChange={(e) => setCustomSubtitle(e.target.value)}
              />
            </div>
          </div>

          {customTitle.trim() && customPreviewUrl && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Preview:</h4>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => copyUrl(customPreviewUrl)} className="gap-1">
                    <Copy className="h-3 w-3" />
                    Copy URL
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => openInNewTab(customPreviewUrl)} className="gap-1">
                    <ExternalLink className="h-3 w-3" />
                    Open
                  </Button>
                </div>
              </div>
              <div className="relative aspect-[1200/630] bg-muted border rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${baseUrl}${customPreviewUrl}&t=${refreshKey}`}
                  alt="Custom preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="%23121212"/><text x="600" y="315" text-anchor="middle" fill="%23FFD700" font-size="48" font-family="Arial">Error loading preview</text></svg>`;
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Testing instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Test on Social Networks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-600">Facebook</h4>
              <p className="text-sm text-muted-foreground">
                Use Facebook Sharing Debugger to test and clear cache
              </p>
              <Button size="sm" variant="outline" asChild className="w-full">
                <a href="https://developers.facebook.com/tools/debug/" target="_blank" rel="noopener noreferrer">
                  Test on Facebook
                </a>
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sky-600">Twitter</h4>
              <p className="text-sm text-muted-foreground">
                Validate how Twitter Cards appear
              </p>
              <Button size="sm" variant="outline" asChild className="w-full">
                <a href="https://cards-dev.twitter.com/validator" target="_blank" rel="noopener noreferrer">
                  Test on Twitter
                </a>
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-800">LinkedIn</h4>
              <p className="text-sm text-muted-foreground">
                See how links appear on LinkedIn
              </p>
              <Button size="sm" variant="outline" asChild className="w-full">
                <a href="https://www.linkedin.com/post-inspector/" target="_blank" rel="noopener noreferrer">
                  Test on LinkedIn
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Tips:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Convention files (opengraph-image.tsx) are what social networks actually see</li>
              <li>The /api/og route is only used for routes without convention files</li>
              <li>After changes, use social debuggers to clear cached images</li>
              <li>Blog post and portfolio project OG images are dynamic per slug/id</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
