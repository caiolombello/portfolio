import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

import {
  BLOG_FIGURES,
  getBlogFigure,
  type FigureAsset,
} from "./blog-figures";

function readSvgSize(asset: FigureAsset) {
  const file = path.join(process.cwd(), "public", asset.src);
  const svg = fs.readFileSync(file, "utf8");
  const root = svg.match(/<svg\b[^>]*>/)?.[0] ?? "";
  const attr = (name: string) =>
    root.match(new RegExp(`\\s${name}="([^"]+)"`))?.[1];

  return {
    width: Number(attr("width")),
    height: Number(attr("height")),
    viewBox: attr("viewBox"),
  };
}

const assets = [...BLOG_FIGURES.values()].flatMap((figure) =>
  [figure.wide, figure.narrow].flatMap((set) =>
    set ? [set.light, set.dark].filter((a): a is FigureAsset => !!a) : [],
  ),
);

describe("blog figures", () => {
  it.each(assets.map((asset) => [asset.src, asset] as const))(
    "%s exists with the registered size",
    (_src, asset) => {
      expect(readSvgSize(asset)).toEqual({
        width: asset.width,
        height: asset.height,
        viewBox: `0 0 ${asset.width} ${asset.height}`,
      });
    },
  );

  it("keys each figure by its wide light source", () => {
    for (const [src, figure] of BLOG_FIGURES) {
      expect(figure.wide.light.src).toBe(src);
    }
  });

  it("registers every figure that has theme or screen variants", () => {
    const dir = path.join(process.cwd(), "public/images/posts");
    const variants = fs
      .readdirSync(dir, { recursive: true, encoding: "utf8" })
      .filter((file) => /\.(mobile|dark)\.svg$/.test(file));

    for (const file of variants) {
      const base = `/images/posts/${file}`.replace(/(\.mobile)?(\.dark)?\.svg$/, ".svg");
      expect(getBlogFigure(base), `${file} has no registered base ${base}`).toBeDefined();
    }
  });

  it("resolves every image used in posts", () => {
    const dir = path.join(process.cwd(), "content/posts");
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      const markdown = fs.readFileSync(path.join(dir, file), "utf8");
      for (const [, src] of markdown.matchAll(/!\[[^\]]*\]\((\/images\/[^)\s]+)/g)) {
        expect(fs.existsSync(path.join(process.cwd(), "public", src)), `${file}: ${src}`).toBe(true);
        const hasVariants = fs.existsSync(
          path.join(process.cwd(), "public", src.replace(/\.svg$/, ".dark.svg")),
        );
        if (src.endsWith(".svg") && hasVariants) {
          expect(getBlogFigure(src), `${file}: ${src} is not registered`).toBeDefined();
        }
      }
    }
  });

  it("returns undefined for unregistered or non-string sources", () => {
    expect(getBlogFigure("/images/unknown.svg")).toBeUndefined();
    expect(getBlogFigure(undefined)).toBeUndefined();
  });
});
