/**
 * Generates the pool-hierarchy diagram for the post
 * content/posts/ipam-multi-account-hierarquia-de-pools.{pt,en}.md.
 *
 *   node scripts/diagrams/ipam-multi-account.mjs
 *
 * Writes eight SVGs to public/images/posts/ipam-multi-account/
 * (pt/en × wide/mobile × light/dark) and prints their sizes, which must match
 * lib/blog-figures.ts. Edit this script and run it again instead of editing
 * the SVGs by hand.
 *
 * Every label comes from the article's synthetic example (10.0.0.0/8 root,
 * two Regions, three environments plus one reserve per Region). The script
 * fails if a label may overflow its box or a color pair misses WCAG contrast
 * (4.5:1 for text, 3:1 for lines and borders).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const OUT_DIR = path.join(ROOT, "public/images/posts/ipam-multi-account");

// Conservative widths (em) so labels fit the widest system fonts.
const SANS_ADVANCE = 0.62;
const SANS_BOLD_ADVANCE = 0.68;
const MONO_ADVANCE = 0.62;

function measure(text, size, { mono = false, bold = false } = {}) {
  const advance = mono ? MONO_ADVANCE : bold ? SANS_BOLD_ADVANCE : SANS_ADVANCE;
  return [...text].length * advance * size;
}

const THEMES = {
  light: {
    bg: "#fffdf8", panel: "#f3f6f7", card: "#ffffff", panelStroke: "#52616b",
    cardStroke: "#7a878e", text: "#202a30", textSecondary: "#52616b",
    amberLine: "#b66b13", amberText: "#71420b", amberSoft: "#fbe9c8",
    greenLine: "#39764a", greenText: "#315b3b", greenSoft: "#e2efe4",
  },
  dark: {
    bg: "#151719", panel: "#1c2024", card: "#22272c", panelStroke: "#8a969c",
    cardStroke: "#75828a", text: "#e6e9eb", textSecondary: "#a7b2b9",
    amberLine: "#e39b45", amberText: "#f0b46a", amberSoft: "#3a2c17",
    greenLine: "#6cc489", greenText: "#7fcf98", greenSoft: "#1d3326",
  },
};

const CONTRAST_PAIRS = [
  ...["bg", "panel", "card", "amberSoft", "greenSoft"].map((bg) => ["text", bg, 4.5]),
  ...["bg", "panel", "card"].map((bg) => ["textSecondary", bg, 4.5]),
  ...["card", "amberSoft"].map((bg) => ["amberText", bg, 4.5]),
  ...["card", "greenSoft"].map((bg) => ["greenText", bg, 4.5]),
  ...["bg", "panel"].map((bg) => ["panelStroke", bg, 3]),
  ...["panel", "card"].map((bg) => ["cardStroke", bg, 3]),
  ...["bg", "panel", "card"].flatMap((bg) => [["amberLine", bg, 3], ["greenLine", bg, 3]]),
];

function luminance(hex) {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
for (const [name, theme] of Object.entries(THEMES)) {
  for (const [fg, bg, min] of CONTRAST_PAIRS) {
    const ratio = contrast(theme[fg], theme[bg]);
    if (ratio < min) throw new Error(`${name}: ${fg} on ${bg} is ${ratio.toFixed(2)} < ${min}`);
  }
}

const COPY = {
  pt: {
    title: "IPAM multi-account: hierarquia de pools do exemplo",
    desc:
      "Na conta de rede, o escopo privado padrão contém a raiz 10.0.0.0/8 sem locale. Ela se divide em dois pools regionais, sa-east-1 10.0.0.0/12 e us-east-1 10.16.0.0/12, e cada região em pools de ambiente /14 para prod, nonprod e shared, com um quarto /14 reservado e não provisionado. Os pools de ambiente têm máscara mínima /16, máxima /24 e padrão /20 e são compartilhados pelo AWS RAM com a OU de workloads. Na conta de produção, a VPC pagamentos-prod pede um /20 ao pool sa-east-1/prod.",
    network: "Conta de rede · região home do IPAM",
    scope: "Escopo privado padrão",
    root: "Raiz",
    noLocale: "sem locale",
    locale: (r) => `locale ${r}`,
    reserve: "reserva",
    notProvisioned: "não provisionada",
    rulesTitle: "Regras dos pools de ambiente",
    rules: "mín. /16 · máx. /24 · padrão /20",
    shared: "pools de ambiente",
    ram: "AWS RAM · ipam-pools-ambiente",
    principal: "principal: OU de workloads",
    prodAccount: "Conta de produção · sa-east-1",
    vpc: "VPC pagamentos-prod",
    vpcPool: "ipv4_ipam_pool_id = pool sa-east-1/prod",
    vpcMask: "ipv4_netmask_length = 20",
    vpcResult: "IPAM escolhe o próximo /20 livre em 10.0.0.0/14",
    alloc: "aloca um /20",
  },
  en: {
    title: "Multi-account IPAM: the example's pool hierarchy",
    desc:
      "In the network account, the default private scope holds the 10.0.0.0/8 root with no locale. It splits into two Regional pools, sa-east-1 10.0.0.0/12 and us-east-1 10.16.0.0/12, and each Region into /14 environment pools for prod, nonprod and shared, with a fourth /14 reserved and not provisioned. The environment pools have a /16 minimum, /24 maximum and /20 default netmask and are shared through AWS RAM with the workloads OU. In the production account, the payments-prod VPC requests a /20 from the sa-east-1/prod pool.",
    network: "Network account · IPAM home Region",
    scope: "Default private scope",
    root: "Root",
    noLocale: "no locale",
    locale: (r) => `locale ${r}`,
    reserve: "reserve",
    notProvisioned: "not provisioned",
    rulesTitle: "Environment pool rules",
    rules: "min /16 · max /24 · default /20",
    shared: "environment pools",
    ram: "AWS RAM · ipam-environment-pools",
    principal: "principal: workloads OU",
    prodAccount: "Production account · sa-east-1",
    vpc: "VPC payments-prod",
    vpcPool: "ipv4_ipam_pool_id = sa-east-1/prod pool",
    vpcMask: "ipv4_netmask_length = 20",
    vpcResult: "IPAM picks the next free /20 in 10.0.0.0/14",
    alloc: "allocates a /20",
  },
};

const REGIONS = [
  { name: "sa-east-1", cidr: "10.0.0.0/12", envs: [["prod", "10.0.0.0/14"], ["nonprod", "10.4.0.0/14"], ["shared", "10.8.0.0/14"]], reserve: "10.12.0.0/14" },
  { name: "us-east-1", cidr: "10.16.0.0/12", envs: [["prod", "10.16.0.0/14"], ["nonprod", "10.20.0.0/14"], ["shared", "10.24.0.0/14"]], reserve: "10.28.0.0/14" },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function build(lang, mode, themeName) {
  const t = THEMES[themeName];
  const c = COPY[lang];
  const W = mode === "wide" ? 1000 : 600;
  const out = [];
  const text = (x, y, s, { size = 17, mono = false, bold = false, fill = t.text, anchor = "start", max } = {}) => {
    if (max !== undefined && measure(s, size, { mono, bold }) > max) {
      throw new Error(`${lang}/${mode}: "${s}" may overflow ${max}px`);
    }
    const cls = [mono ? "m" : "s", bold ? "b" : ""].filter(Boolean).join(" ");
    out.push(`<text x="${x}" y="${y}" class="${cls}" font-size="${size}" fill="${fill}"${anchor === "start" ? "" : ` text-anchor="${anchor}"`}>${esc(s)}</text>`);
  };
  const rect = (x, y, w, h, { fill = t.card, stroke = t.cardStroke, dash = false, rx = 8, sw = 2 } = {}) =>
    out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ' stroke-dasharray="6 5"' : ""}/>`);
  const line = (x1, y1, x2, y2, color, arrow = false) =>
    out.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2.5"${arrow ? ` marker-end="url(#a-${color.slice(1)})"` : ""}/>`);

  // Two-line card: bold label + mono detail.
  const card = (x, y, w, h, label, detail, opts = {}) => {
    rect(x, y, w, h, opts);
    text(x + 14, y + 26, label, { size: 17, bold: true, fill: opts.labelFill ?? t.text, max: w - 28 });
    if (detail) text(x + 14, y + 50, detail, { size: 15, mono: true, fill: opts.detailFill ?? t.textSecondary, max: w - 28 });
  };

  const P = 24; // outer margin
  const EH = 84; // environment card height
  const I = 20; // panel inner padding
  let y = P;
  const netTop = y;
  const panelW = W - 2 * P;
  const inner = P + I;
  const innerW = panelW - 2 * I;
  const panelRectIdx = out.length;
  out.push(""); // placeholder for network panel rect
  text(inner, y + 32, c.network, { size: 20, bold: true, max: innerW });
  text(inner, y + 58, c.scope, { size: 16, fill: t.textSecondary, max: innerW });
  y += 76;

  // Root
  const rootW = mode === "wide" ? 340 : innerW;
  const rootX = (W - rootW) / 2;
  card(rootX, y, rootW, 64, c.root, `10.0.0.0/8 · ${c.noLocale}`, { fill: t.amberSoft, stroke: t.amberLine, labelFill: t.text, detailFill: t.text });
  const rootBottom = y + 64;
  y += 64 + 36;

  const regionBoxes = [];
  const regionLayout = (rx, ry, rw, region) => {
    // region card
    card(rx, ry, rw, 64, region.name, `${region.cidr} · ${c.locale(region.name)}`);
    const gap = 12;
    const cw = (rw - gap) / 2;
    const envs = [...region.envs.map(([n, cidr]) => ({ n, cidr })), { n: c.reserve, cidr: region.reserve, reserve: true }];
    const top = ry + 64 + 16;
    envs.forEach((e, i) => {
      const ex = rx + (i % 2) * (cw + gap);
      const ey = top + Math.floor(i / 2) * (EH + gap);
      const highlight = region.name === "sa-east-1" && e.n === "prod";
      if (e.reserve) {
        card(ex, ey, cw, EH, e.n, e.cidr, { dash: true, fill: t.panel });
        text(ex + 14, ey + 72, c.notProvisioned, { size: 14, fill: t.textSecondary, max: cw - 28 });
      } else {
        card(ex, ey, cw, EH, e.n, e.cidr, highlight ? { fill: t.greenSoft, stroke: t.greenLine, labelFill: t.text, detailFill: t.text } : {});
      }
    });
    // connector region -> env grid
    line(rx + rw / 2, ry + 64, rx + rw / 2, top, t.cardStroke);
    return { x: rx, y: ry, w: rw, bottom: top + 2 * EH + gap };
  };

  if (mode === "wide") {
    const rw = (innerW - 32) / 2;
    const rs = [regionLayout(inner, y, rw, REGIONS[0]), regionLayout(inner + rw + 32, y, rw, REGIONS[1])];
    for (const r of rs) {
      // root -> region elbow
      const cx = r.x + r.w / 2;
      out.push(`<path d="M${W / 2} ${rootBottom} V${y - 18} H${cx} V${y}" fill="none" stroke="${t.cardStroke}" stroke-width="2.5"/>`);
      regionBoxes.push(r);
    }
    y = Math.max(...rs.map((r) => r.bottom));
  } else {
    for (const region of REGIONS) {
      const r = regionLayout(inner, y, innerW, region);
      regionBoxes.push(r);
      y = r.bottom + 28;
    }
    // root -> regions spine on the left gutter
    const sx = inner - 10;
    out.push(`<path d="M${W / 2} ${rootBottom} V${rootBottom + 18} H${sx} V${regionBoxes[1].y + 32} H${inner}" fill="none" stroke="${t.cardStroke}" stroke-width="2.5"/>`);
    line(sx, regionBoxes[0].y + 32, inner, regionBoxes[0].y + 32, t.cardStroke);
    y -= 28;
  }

  // Rules
  y += 20;
  rect(inner, y, innerW, mode === "wide" ? 48 : 72, { fill: t.card });
  if (mode === "wide") {
    text(inner + 14, y + 30, `${c.rulesTitle}:`, { size: 16, bold: true, max: 360 });
    text(inner + 14 + measure(`${c.rulesTitle}:`, 16) * 0.88, y + 30, c.rules, { size: 15, mono: true, max: innerW - 390 });
    y += 48;
  } else {
    text(inner + 14, y + 28, c.rulesTitle, { size: 16, bold: true, max: innerW - 28 });
    text(inner + 14, y + 54, c.rules, { size: 15, mono: true, max: innerW - 28 });
    y += 72;
  }

  // RAM
  y += 44;
  const ramW = mode === "wide" ? 420 : innerW;
  const ramX = (W - ramW) / 2;
  const ramTop = y;
  // shared arrows: from each region grid bottom area down to RAM
  if (mode === "wide") {
    for (const r of regionBoxes) {
      const cx = r.x + r.w / 2;
      const tx = cx < W / 2 ? ramX + 60 : ramX + ramW - 60;
      out.push(`<path d="M${cx} ${ramTop - 44} V${ramTop - 22} H${tx} V${ramTop - 4}" fill="none" stroke="${t.amberLine}" stroke-width="2.5" marker-end="url(#a-amber)"/>`);
    }
    text(W / 2, ramTop - 30, c.shared, { size: 15, fill: t.amberText, anchor: "middle", max: 260 });
  } else {
    out.push(`<path d="M${W / 2} ${ramTop - 44} V${ramTop - 4}" fill="none" stroke="${t.amberLine}" stroke-width="2.5" marker-end="url(#a-amber)"/>`);
    text(W / 2 + 12, ramTop - 20, c.shared, { size: 15, fill: t.amberText, max: innerW / 2 - 20 });
  }
  card(ramX, ramTop, ramW, 64, c.ram, c.principal, { fill: t.amberSoft, stroke: t.amberLine, detailFill: t.text });
  y = ramTop + 64 + I;
  const netBottom = y;
  out[panelRectIdx] = `<rect x="${P}" y="${netTop}" width="${panelW}" height="${netBottom - netTop}" rx="12" fill="${t.panel}" stroke="${t.panelStroke}" stroke-width="2"/>`;

  // Production account
  y += 56;
  const prodTop = y;
  const vpcH = 128;
  const prodH = 52 + vpcH + I;
  rect(P, prodTop, panelW, prodH, { fill: t.panel, stroke: t.panelStroke, rx: 12 });
  text(inner, prodTop + 32, c.prodAccount, { size: 20, bold: true, max: innerW });
  const vy = prodTop + 52;
  rect(inner, vy, innerW, vpcH, { fill: t.greenSoft, stroke: t.greenLine });
  text(inner + 14, vy + 28, c.vpc, { size: 17, bold: true, max: innerW - 28 });
  text(inner + 14, vy + 54, c.vpcPool, { size: 15, mono: true, max: innerW - 28 });
  text(inner + 14, vy + 78, c.vpcMask, { size: 15, mono: true, max: innerW - 28 });
  text(inner + 14, vy + 106, c.vpcResult, { size: 15, fill: t.greenText, max: innerW - 28 });
  // RAM -> VPC
  out.push(`<path d="M${W / 2} ${ramTop + 64} V${vy - 4}" fill="none" stroke="${t.greenLine}" stroke-width="2.5" marker-end="url(#a-green)"/>`);
  text(W / 2 + 12, netBottom + 34, c.alloc, { size: 15, fill: t.greenText, max: innerW / 2 - 20 });

  const H = prodTop + prodH + P;
  const defs = `<defs><marker id="a-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="${t.amberLine}"/></marker><marker id="a-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="${t.greenLine}"/></marker></defs>`;
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title desc">`,
    `<title id="title">${esc(c.title)}</title>`,
    `<desc id="desc">${esc(c.desc)}</desc>`,
    `<style>.s{font-family:Geist, "Segoe UI", system-ui, -apple-system, Roboto, "Helvetica Neue", Arial, sans-serif}.m{font-family:"Geist Mono", ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace}.b{font-weight:600}</style>`,
    defs,
    `<rect width="${W}" height="${H}" fill="${t.bg}"/>`,
    ...out.filter(Boolean),
    `</svg>`,
    "",
  ].join("\n");
  return { svg, W, H };
}

mkdirSync(OUT_DIR, { recursive: true });
for (const lang of ["pt", "en"]) {
  for (const mode of ["wide", "mobile"]) {
    for (const theme of ["light", "dark"]) {
      const { svg, W, H } = build(lang, mode, theme);
      const name = `hierarquia-pools${lang === "en" ? ".en" : ""}${mode === "mobile" ? ".mobile" : ""}${theme === "dark" ? ".dark" : ""}.svg`;
      writeFileSync(path.join(OUT_DIR, name), svg);
      console.log(`${name}: ${W}x${H}`);
    }
  }
}
