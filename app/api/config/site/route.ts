import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const configPath = path.join(process.cwd(), "config/site.json");
    
    if (!fs.existsSync(configPath)) {
      console.warn("Site config not found, using defaults");
      return NextResponse.json({
        site: {
          name: "Portfolio Template",
          title: "Your Name - Professional Portfolio", 
          shortName: "Your Name",
          description: "Professional portfolio and blog showcasing projects, skills and experience",
          url: "https://yoursite.com",
          author: "Your Name",
          email: "your.email@example.com",
          phone: "+1 (555) 123-4567",
          location: "Your City, State/Country"
        },
        social: {
          github: "https://github.com/yourusername",
          linkedin: "https://linkedin.com/in/yourprofile", 
          twitter: "https://twitter.com/yourusername",
          website: "https://yoursite.com"
        },
        integrations: {
          credlyUsername: "your-credly-username",
          twitterHandle: "@yourusername"
        },
        seo: {
          keywords: [
            "your profession",
            "your skills", 
            "your location",
            "web development",
            "portfolio"
          ]
        }
      });
    }

    const configData = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(configData);

    return NextResponse.json(config, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300', // Cache por 5 minutos
      }
    });
  } catch (error) {
    console.error("Error loading site config:", error);
    return NextResponse.json(
      { error: "Failed to load site configuration" },
      { status: 500 }
    );
  }
} 