import { parseStringPromise } from "xml2js";
import { describe, expect, it } from "vitest";

import { buildBlogFeed } from "./blog-feed";

describe("buildBlogFeed", () => {
  it("generates valid XML when channel metadata contains reserved characters", async () => {
    const xml = buildBlogFeed({
      baseUrl: "https://caio.lombello.com",
      description: "Kubernetes & confiabilidade",
      posts: [],
      title: "DevOps & SRE",
    });

    const feed = await parseStringPromise(xml);

    expect(feed.rss.channel[0].title[0]).toBe("DevOps & SRE");
    expect(feed.rss.channel[0].description[0]).toBe(
      "Kubernetes & confiabilidade",
    );
  });
});
