/**
 * Generates the traffic-flow diagram for the post
 * content/posts/hub-and-spoke-aws-caminho-do-trafego.{pt,en}.md.
 *
 *   node scripts/diagrams/hub-and-spoke-aws.mjs
 *
 * Writes eight SVGs to public/images/posts/hub-and-spoke-aws/
 * (pt/en × wide/mobile × light/dark) and the Portuguese wide light version as
 * an Excalidraw file in assets/diagrams/blog/. The site picks the variant (see
 * lib/blog-figures.ts, whose sizes must match the ones printed here).
 *
 * The outputs are generated: edit this script and run it again instead of
 * editing the SVGs or the .excalidraw by hand (changes do not round-trip).
 *
 * The script fails if a label with a width limit may overflow its box, if a
 * flow line would cross the public subnet title, or if a color pair misses WCAG
 * contrast (4.5:1 for text, 3:1 for lines and borders). Pills and markers size
 * themselves and are not checked.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const OUT_DIR = path.join(ROOT, "public/images/posts/hub-and-spoke-aws");
const EXCALIDRAW_FILE = path.join(
  ROOT,
  "assets/diagrams/blog/hub-and-spoke-aws-caminho-do-trafego.excalidraw",
);

/* ------------------------------------------------------------------------ */
/* Text measurement                                                          */
/* ------------------------------------------------------------------------ */

// Widest advance per glyph (per 1000 em) among Noto Sans, Liberation Sans,
// Adwaita Sans and DejaVu Sans (Bold for the semibold table, since DejaVu has no
// semibold). SVG in <img> uses system fonts, so labels must fit all of them.
const GLYPHS = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ→·–—’";
const SANS_REGULAR = [318, 401, 466, 838, 642, 982, 780, 300, 390, 390, 551, 838, 318, 460, 318, 372, 636, 636, 636, 636, 646, 636, 636, 636, 636, 636, 337, 337, 838, 838, 838, 556, 1015, 690, 686, 730, 770, 667, 611, 778, 752, 339, 571, 672, 565, 907, 760, 787, 667, 787, 722, 667, 646, 744, 690, 989, 685, 679, 685, 390, 372, 390, 838, 556, 500, 613, 635, 571, 635, 615, 370, 635, 634, 278, 278, 579, 278, 974, 634, 612, 635, 635, 413, 528, 392, 634, 592, 818, 592, 592, 525, 636, 551, 636, 838, 613, 613, 613, 613, 615, 615, 278, 612, 612, 612, 634, 571, 690, 690, 690, 690, 667, 667, 339, 787, 787, 787, 744, 730, 1000, 333, 556, 1000, 333];
const SANS_SEMIBOLD = [348, 456, 523, 838, 696, 1004, 872, 326, 457, 457, 546, 838, 380, 465, 380, 425, 696, 696, 696, 696, 696, 696, 696, 696, 696, 696, 400, 400, 838, 838, 838, 580, 1036, 774, 762, 734, 830, 683, 683, 821, 837, 388, 598, 775, 637, 995, 837, 850, 733, 850, 770, 720, 682, 812, 774, 1103, 771, 724, 725, 457, 425, 457, 838, 556, 500, 675, 716, 593, 716, 678, 435, 716, 712, 343, 343, 665, 343, 1042, 712, 687, 716, 716, 493, 595, 478, 712, 652, 924, 645, 652, 582, 712, 551, 712, 838, 675, 675, 675, 675, 678, 678, 343, 687, 687, 687, 712, 593, 774, 774, 774, 774, 683, 683, 388, 850, 850, 850, 812, 734, 1000, 380, 556, 1000, 380];
// Monospace fonts in the stack advance 0.55–0.61 em.
const MONO_ADVANCE = 0.62;
// Rounding margin on top of the widest measured fonts.
const FIT_SLACK = 1.03;

function measure(text, size, { mono = false, bold = false } = {}) {
  if (mono) return text.length * MONO_ADVANCE * size;
  const table = bold ? SANS_SEMIBOLD : SANS_REGULAR;
  let total = 0;
  for (const char of text) {
    const index = GLYPHS.indexOf(char);
    total += index === -1 ? 1000 : table[index];
  }
  return (total / 1000) * size;
}

/* ------------------------------------------------------------------------ */
/* Themes                                                                    */
/* ------------------------------------------------------------------------ */

const THEMES = {
  light: {
    bg: "#fffdf8",
    panel: "#f3f6f7",
    card: "#ffffff",
    vpcStroke: "#52616b",
    subnetStroke: "#7a878e",
    tgwFill: "#fff5df",
    tgwStroke: "#bd7a20",
    text: "#202a30",
    textSecondary: "#52616b",
    amberLine: "#b66b13",
    amberText: "#71420b",
    amberSoft: "#fbe9c8",
    greenLine: "#39764a",
    greenText: "#315b3b",
    greenSoft: "#e2efe4",
    red: "#a8322a",
    mutedLine: "#7a878e",
    markerFill: "#39764a",
    markerText: "#ffffff",
  },
  dark: {
    bg: "#151719",
    panel: "#1c2024",
    card: "#22272c",
    vpcStroke: "#8a969c",
    subnetStroke: "#75828a",
    tgwFill: "#2a2418",
    tgwStroke: "#c48a3a",
    text: "#e6e9eb",
    textSecondary: "#a7b2b9",
    amberLine: "#e39b45",
    amberText: "#f0b46a",
    amberSoft: "#3a2c17",
    greenLine: "#6cc489",
    greenText: "#7fcf98",
    greenSoft: "#1d3326",
    red: "#f28b82",
    mutedLine: "#8a969c",
    markerFill: "#6cc489",
    markerText: "#10251a",
  },
};

// [foreground, background, minimum ratio]
const CONTRAST_PAIRS = [
  ...["bg", "panel", "card", "tgwFill", "amberSoft", "greenSoft"].map((bg) => [
    "text",
    bg,
    4.5,
  ]),
  ...["bg", "panel", "card", "tgwFill"].map((bg) => ["textSecondary", bg, 4.5]),
  ...["bg", "card", "tgwFill", "amberSoft"].map((bg) => ["amberText", bg, 4.5]),
  ...["bg", "card", "greenSoft"].map((bg) => ["greenText", bg, 4.5]),
  ["red", "card", 4.5],
  ["markerText", "markerFill", 4.5],
  ...["bg", "panel"].map((bg) => ["vpcStroke", bg, 3]),
  ...["panel", "card"].map((bg) => ["subnetStroke", bg, 3]),
  ...["bg", "tgwFill"].map((bg) => ["tgwStroke", bg, 3]),
  ...["bg", "panel", "card", "tgwFill"].flatMap((bg) => [
    ["amberLine", bg, 3],
    ["greenLine", bg, 3],
  ]),
  ...["bg", "panel", "tgwFill"].map((bg) => ["mutedLine", bg, 3]),
  ...["bg", "panel", "card", "tgwFill"].map((bg) => ["markerFill", bg, 3]),
];

function luminance(hex) {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/* ------------------------------------------------------------------------ */
/* Copy                                                                      */
/* ------------------------------------------------------------------------ */

const COPY = {
  pt: {
    title: "Hub and spoke na AWS: ida e volta pelo Transit Gateway",
    desc:
      "VPCs de produção e de desenvolvimento ligadas ao Transit Gateway, com " +
      "saída central por NAT Gateway e Internet Gateway na VPC de saída. A ida " +
      "usa rt-producao; a volta, em quatro passos numerados, usa a rota mais " +
      "específica da sub-rede pública e rt-retorno. Blackholes separam os ambientes.",
    prodVpc: "VPC de produção",
    devVpc: "VPC de desenvolvimento",
    egressVpc: "VPC de saída",
    privateSubnet: "Sub-rede privada",
    app: "aplicação",
    attachmentSubnet: "Sub-rede do attachment",
    publicSubnet: "Sub-rede pública",
    tgw: "Transit Gateway",
    prodAttachment: "attachment de produção",
    devAttachment: "attachment de desenvolvimento",
    egressAttachment: "attachment de saída",
    rtProd: "rt-producao",
    rtDev: "rt-desenvolvimento",
    rtReturn: "rt-retorno",
    assocProd: "associada ao attachment de produção",
    assocDev: "associada ao attachment de desenvolvimento",
    assocReturn: "associada ao attachment de saída · rotas propagadas",
    natSameAz: "NAT (mesma AZ)",
    nat: "NAT Gateway",
    natKind: "público, zonal",
    igw: ["Internet", "Gateway"],
    api: "API pública",
    https: "HTTPS",
    scope: "Uma AZ, sem firewall de inspeção",
    legendOut: "Ida (requisição)",
    legendBack: "Volta (resposta)",
    legendDev: "Desenvolvimento (não acompanhado)",
    steps: [
      "IGW e NAT desfazem as traduções",
      "rota mais específica volta ao TGW",
      "rt-retorno envia à produção",
      "rota local entrega a 10.240.1.10",
    ],
  },
  en: {
    title: "Hub and spoke on AWS: the round trip through Transit Gateway",
    desc:
      "Production and development VPCs attached to Transit Gateway, with " +
      "centralized egress through a NAT Gateway and an Internet Gateway in the " +
      "egress VPC. The request uses rt-production; the response, in four numbered " +
      "steps, uses the public subnet's more specific route and rt-return. " +
      "Blackholes separate the environments.",
    prodVpc: "Production VPC",
    devVpc: "Development VPC",
    egressVpc: "Egress VPC",
    privateSubnet: "Private subnet",
    app: "app",
    attachmentSubnet: "Attachment subnet",
    publicSubnet: "Public subnet",
    tgw: "Transit Gateway",
    prodAttachment: "production attachment",
    devAttachment: "development attachment",
    egressAttachment: "egress attachment",
    rtProd: "rt-production",
    rtDev: "rt-development",
    rtReturn: "rt-return",
    assocProd: "associated with the production attachment",
    assocDev: "associated with the development attachment",
    assocReturn: "associated with the egress attachment · propagated routes",
    natSameAz: "NAT (same AZ)",
    nat: "NAT Gateway",
    natKind: "public, zonal",
    igw: ["Internet", "Gateway"],
    api: "Public API",
    https: "HTTPS",
    scope: "One AZ, no inspection firewall",
    legendOut: "Outbound (request)",
    legendBack: "Return (response)",
    legendDev: "Development (not traced)",
    steps: [
      "IGW and NAT reverse the translations",
      "the more specific route goes to the TGW",
      "rt-return sends it to production",
      "the local route delivers to 10.240.1.10",
    ],
  },
};

/* ------------------------------------------------------------------------ */
/* Scene                                                                     */
/* ------------------------------------------------------------------------ */

class Scene {
  constructor(width, name) {
    this.width = width;
    this.height = 0;
    this.name = name;
    this.shapes = [];
  }

  rect(x, y, w, h, { fill, stroke, sw = 2, r = 10, dash } = {}) {
    this.shapes.push({ type: "rect", x, y, w, h, fill, stroke, sw, r, dash });
  }

  circle(cx, cy, r, { fill, stroke, sw = 0 } = {}) {
    this.shapes.push({ type: "circle", cx, cy, r, fill, stroke, sw });
  }

  /**
   * Adds a text run at baseline y. maxWidth is the room available from the
   * anchor; the build fails if the text may not fit.
   */
  text(x, y, text, { size, fill, mono = false, bold = false, anchor = "start", maxWidth } = {}) {
    const width = measure(text, size, { mono, bold });
    if (maxWidth !== undefined && width * FIT_SLACK > maxWidth) {
      throw new Error(
        `[${this.name}] "${text}" needs ${Math.ceil(width * FIT_SLACK)} but has ${Math.floor(maxWidth)}`,
      );
    }
    this.shapes.push({ type: "text", x, y, text, size, fill, mono, bold, anchor, width });
    return width;
  }

  /** Polyline with an optional arrowhead at the last point. */
  line(points, { stroke, sw = 3, dash, arrow = true, head } = {}) {
    this.shapes.push({ type: "line", points, stroke, sw, dash, arrow, head });
  }
}

/* ------------------------------------------------------------------------ */
/* Components                                                                */
/* ------------------------------------------------------------------------ */

const TONES = {
  out: { line: "amberLine", soft: "amberSoft" },
  back: { line: "greenLine", soft: "greenSoft", dash: "9 6" },
  muted: { line: "mutedLine" },
};

/**
 * Container (VPC, subnet, TGW) with a title in the top-left corner. `title` may
 * be an array of lines. Returns the baseline of the last header line.
 */
function container(scene, box, { title, subtitle, kind, metrics }) {
  const styles = {
    vpc: { fill: "panel", stroke: "vpcStroke", sw: 2, titleFill: "text" },
    subnet: { fill: "card", stroke: "subnetStroke", sw: 2, titleFill: "text" },
    tgw: { fill: "tgwFill", stroke: "tgwStroke", sw: 3, titleFill: "amberText" },
  }[kind];
  scene.rect(box.x, box.y, box.w, box.h, {
    fill: styles.fill,
    stroke: styles.stroke,
    sw: styles.sw,
    r: kind === "subnet" ? 8 : 12,
  });
  const pad = metrics.pad;
  const titleSize = kind === "subnet" ? metrics.subnetTitle : metrics.title;
  const lines = Array.isArray(title) ? title : [title];
  let baseline = box.y + metrics.titleBaseline;
  lines.forEach((line, i) => {
    if (i) baseline += metrics.subtitleGap;
    scene.text(box.x + pad, baseline, line, {
      size: titleSize,
      bold: true,
      fill: styles.titleFill,
      maxWidth: box.titleMax ?? box.w - 2 * pad,
    });
  });
  if (subtitle) {
    baseline += metrics.subtitleGap;
    scene.text(box.x + pad, baseline, subtitle, {
      size: metrics.small,
      mono: true,
      fill: "textSecondary",
      maxWidth: box.w - 2 * pad,
    });
  }
  return baseline;
}

/**
 * Route table rows: destination (mono) → target. Rows on the followed path are
 * tinted (amber outbound, green return); blackhole targets are red.
 * Returns the y below the last row.
 */
function routeRows(scene, { x, y, w, rows, metrics, twoLine = false }) {
  const { rowHeight, mono, body } = metrics;
  const destWidth = Math.max(...rows.map((r) => measure(r.dest, mono, { mono: true })));
  const arrowGap = 10;
  let cursor = y;
  for (const row of rows) {
    const height = twoLine ? rowHeight * 1.75 : rowHeight;
    if (row.tone) {
      scene.rect(x - 8, cursor + 1, w + 16, height - 2, {
        fill: TONES[row.tone].soft,
        r: 6,
        sw: 0,
      });
    }
    const baseline = cursor + rowHeight / 2 + mono * 0.36;
    scene.text(x, baseline, row.dest, {
      size: mono,
      mono: true,
      fill: "text",
      maxWidth: w,
    });
    // The arrow is drawn rather than typed: fonts render U+2192 at very
    // different sizes.
    const arrowX = twoLine ? x + 8 : x + destWidth + arrowGap;
    const targetY = twoLine ? baseline + rowHeight * 0.75 : baseline;
    const arrowWidth = mono * 0.7;
    const arrowY = targetY - mono * 0.32;
    scene.line([[arrowX, arrowY], [arrowX + arrowWidth, arrowY]], {
      stroke: "textSecondary",
      sw: 1.6,
      head: { size: 6, half: 3.5 },
    });
    const targetX = arrowX + arrowWidth + 5;
    const keyword = row.target === "local" || row.target === "blackhole";
    scene.text(targetX, targetY, row.target, {
      size: keyword ? mono : body,
      mono: keyword,
      fill: row.target === "blackhole" ? "red" : "text",
      maxWidth: x + w - targetX,
    });
    cursor += height;
  }
  return cursor;
}

function rowsHeight(count, metrics, twoLine = false) {
  return count * metrics.rowHeight * (twoLine ? 1.75 : 1);
}

/** TGW route table card. Returns its height. */
function routeCard(scene, { x, y, w, name, association, rows, metrics, muted = false, twoLine = false, assocLines }) {
  const { cardHeader } = metrics;
  const pad = metrics.cardPad ?? metrics.pad;
  const lines = assocLines ?? [association];
  const headerHeight = cardHeader + lines.length * metrics.smallLine;
  const h = headerHeight + rowsHeight(rows.length, metrics, twoLine) + metrics.cardBottom;
  scene.rect(x, y, w, h, {
    fill: "card",
    stroke: muted ? "subnetStroke" : "tgwStroke",
    sw: 2,
    r: 8,
  });
  scene.text(x + pad, y + metrics.cardTitleBaseline, name, {
    size: metrics.cardTitle,
    mono: true,
    bold: true,
    fill: muted ? "text" : "amberText",
    maxWidth: w - 2 * pad,
  });
  lines.forEach((line, i) => {
    scene.text(x + pad, y + metrics.cardTitleBaseline + metrics.smallLine * (i + 1), line, {
      size: metrics.small,
      fill: "textSecondary",
      maxWidth: w - 2 * pad,
    });
  });
  routeRows(scene, {
    x: x + pad,
    y: y + headerHeight,
    w: w - 2 * pad,
    rows,
    metrics,
    twoLine,
  });
  return h;
}

function cardHeight(rows, metrics, { twoLine = false, assocLineCount = 1 } = {}) {
  return (
    metrics.cardHeader +
    assocLineCount * metrics.smallLine +
    rowsHeight(rows, metrics, twoLine) +
    metrics.cardBottom
  );
}

/**
 * Attachment label sitting on a container border; flow lines pass behind it.
 * `label` may be an array of lines.
 */
function pillWidth(label, metrics) {
  const lines = Array.isArray(label) ? label : [label];
  return Math.max(...lines.map((l) => measure(l, metrics.small, { bold: true }))) * FIT_SLACK + 24;
}

function pill(scene, cx, cy, label, { metrics, muted = false }) {
  const size = metrics.small;
  const lines = Array.isArray(label) ? label : [label];
  const lineGap = size + 5;
  const w = pillWidth(lines, metrics);
  const h = size + 12 + (lines.length - 1) * lineGap;
  scene.rect(cx - w / 2, cy - h / 2, w, h, {
    fill: "card",
    stroke: muted ? "mutedLine" : "tgwStroke",
    sw: 2,
    r: Math.min(h / 2, 16),
  });
  const first = cy - ((lines.length - 1) * lineGap) / 2 + size * 0.36;
  lines.forEach((line, i) => {
    scene.text(cx, first + i * lineGap, line, {
      size,
      bold: true,
      fill: muted ? "textSecondary" : "amberText",
      anchor: "middle",
    });
  });
  return { w, h };
}

function marker(scene, cx, cy, n, metrics) {
  scene.circle(cx, cy, metrics.markerRadius, { fill: "markerFill", stroke: "bg", sw: 3 });
  scene.text(cx, cy + metrics.markerFont * 0.36, String(n), {
    size: metrics.markerFont,
    bold: true,
    fill: "markerText",
    anchor: "middle",
  });
}

function flow(scene, points, tone, { arrow = true } = {}) {
  const t = TONES[tone];
  scene.line(points, { stroke: t.line, sw: tone === "muted" ? 2.5 : 3, dash: t.dash, arrow });
}

/** Plain box (NAT, IGW, API) with centered or left-aligned lines. */
function box(scene, b, lines, { fill = "card", stroke = "vpcStroke", sw = 2, metrics, lift = 0 }) {
  scene.rect(b.x, b.y, b.w, b.h, { fill, stroke, sw, r: 8 });
  const total = lines.length;
  const lineGap = metrics.boxLine;
  const firstBaseline =
    b.y + b.h / 2 - ((total - 1) * lineGap) / 2 + metrics.body * 0.36 - lift;
  lines.forEach((line, i) => {
    scene.text(b.x + b.w / 2, firstBaseline + i * lineGap, line.text, {
      size: line.size ?? metrics.body,
      bold: line.bold,
      fill: line.fill ?? "text",
      anchor: "middle",
      maxWidth: b.w - 12,
    });
  });
}

function badge(scene, x, y, label, metrics) {
  const size = metrics.small;
  const w = measure(label, size, { bold: true }) * FIT_SLACK + 18;
  const h = size + 10;
  scene.rect(x, y, w, h, { fill: "amberSoft", stroke: "tgwStroke", sw: 2, r: 6 });
  scene.text(x + w / 2, y + h / 2 + size * 0.36, label, {
    size,
    bold: true,
    fill: "amberText",
    anchor: "middle",
  });
  return w;
}

/**
 * Line keys first (in one row when columns > 1, so they do not line up with the
 * step columns), then the numbered return steps.
 */
function legend(scene, { x, y, w, c, metrics, columns }) {
  const { small, rowHeight } = metrics;
  const sample = 54;
  const items = [
    { tone: "out", label: c.legendOut },
    { tone: "back", label: c.legendBack },
    { tone: "muted", label: c.legendDev },
  ];
  const colWidth = w / columns;
  let keyX = x;
  let keyY = y;
  for (const item of items) {
    const labelWidth = measure(item.label, small) * FIT_SLACK;
    if (columns === 1 && keyX !== x) {
      keyX = x;
      keyY += rowHeight;
    }
    flow(scene, [[keyX, keyY], [keyX + sample, keyY]], item.tone);
    scene.text(keyX + sample + 14, keyY + small * 0.36, item.label, {
      size: small,
      fill: item.tone === "muted" ? "textSecondary" : "text",
      maxWidth: x + w - (keyX + sample + 14),
    });
    keyX += sample + 14 + labelWidth + 40;
  }
  const stepsY = keyY + rowHeight + 6;
  c.steps.forEach((step, i) => {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const ix = x + col * colWidth;
    const iy = stepsY + row * rowHeight;
    marker(scene, ix + metrics.markerRadius, iy, i + 1, metrics);
    scene.text(ix + metrics.markerRadius * 2 + 12, iy + small * 0.36, step, {
      size: small,
      fill: "text",
      maxWidth: colWidth - metrics.markerRadius * 2 - 16,
    });
  });
  return stepsY + Math.ceil(c.steps.length / columns) * rowHeight - rowHeight / 2;
}

/* ------------------------------------------------------------------------ */
/* Route data                                                                */
/* ------------------------------------------------------------------------ */

function routes(c) {
  return {
    // Local routes exist in every VPC table; the post's tables list them.
    prodSubnet: [{ dest: "0.0.0.0/0", target: "TGW", tone: "out" }],
    devSubnet: [{ dest: "0.0.0.0/0", target: "TGW" }],
    rtProd: [
      { dest: "0.0.0.0/0", target: c.egressAttachment, tone: "out" },
      { dest: "10.241.0.0/16", target: "blackhole" },
    ],
    rtDev: [
      { dest: "0.0.0.0/0", target: c.egressAttachment },
      { dest: "10.240.0.0/16", target: "blackhole" },
    ],
    rtReturn: [
      { dest: "10.240.0.0/16", target: c.prodAttachment, tone: "back" },
      { dest: "10.241.0.0/16", target: c.devAttachment },
    ],
    attachmentSubnet: [{ dest: "0.0.0.0/0", target: c.natSameAz, tone: "out" }],
    publicSubnet: [
      { dest: "10.240.0.0/16", target: "TGW", tone: "back" },
      { dest: "10.241.0.0/16", target: "TGW" },
      { dest: "0.0.0.0/0", target: "IGW", tone: "out" },
    ],
  };
}

/* ------------------------------------------------------------------------ */
/* Wide layout (desktop, shown at ~700 px)                                   */
/* ------------------------------------------------------------------------ */

const WIDE_METRICS = {
  pad: 20,
  title: 22,
  subnetTitle: 18,
  titleBaseline: 34,
  subtitleGap: 26,
  body: 19,
  mono: 18,
  small: 17,
  smallLine: 24,
  rowHeight: 30,
  cardPad: 16,
  cardTitle: 19,
  cardTitleBaseline: 30,
  cardHeader: 40,
  cardBottom: 12,
  markerRadius: 14,
  markerFont: 17,
  boxLine: 24,
};

function spokeVpc(scene, { x, y, w, c, title, cidr, ip, rows, metrics, muted = false }) {
  const m = metrics;
  const subnetY = y + 76;
  const subnetH = 70 + rowsHeight(rows.length, m) + 12;
  const h = subnetY - y + subnetH + 18;
  container(scene, { x, y, w, h }, { title, subtitle: cidr, kind: "vpc", metrics: m });
  const sx = x + m.pad;
  const sw = w - 2 * m.pad;
  container(scene, { x: sx, y: subnetY, w: sw, h: subnetH }, {
    title: c.privateSubnet, kind: "subnet", metrics: { ...m, pad: 16, titleBaseline: 28 },
  });
  const ipWidth = measure(ip, m.mono, { mono: true }) * FIT_SLACK;
  const appWidth = scene.text(sx + 16, subnetY + 56, c.app, {
    size: m.body,
    fill: muted ? "textSecondary" : "text",
    maxWidth: sw - 32 - 8 - ipWidth,
  });
  scene.text(sx + 16 + appWidth * FIT_SLACK + 8, subnetY + 56, ip, {
    size: m.mono,
    mono: true,
    fill: "text",
    maxWidth: sw - 32 - appWidth * FIT_SLACK - 8,
  });
  routeRows(scene, { x: sx + 16, y: subnetY + 68, w: sw - 32, rows, metrics: m });
  return { h, subnetBottom: subnetY + subnetH };
}

function buildWide(lang) {
  const c = COPY[lang];
  const r = routes(c);
  const m = WIDE_METRICS;
  const scene = new Scene(1000, `${lang}/wide`);
  const W = 1000;
  const M = 24;

  // Column guides for the flow lines.
  const OUT_PROD_X = 300; // outbound, production → rt-producao
  const BACK_PROD_X = 340; // return, rt-retorno → production
  const OUT_EGRESS_X = 240; // outbound, rt-producao → attachment subnet
  const BACK_EGRESS_X = 280; // return, public subnet → rt-retorno
  const GAP_X = 500; // return climbs between the two spoke tables
  const DEV_X = 744;

  // Spoke VPCs.
  const vpcY = M;
  const vpcW = (W - 2 * M - 24) / 2;
  const prod = spokeVpc(scene, {
    x: M, y: vpcY, w: vpcW, c, title: c.prodVpc, cidr: "10.240.0.0/16",
    ip: "10.240.1.10", rows: r.prodSubnet, metrics: m,
  });
  const dev = spokeVpc(scene, {
    x: M + vpcW + 24, y: vpcY, w: vpcW, c, title: c.devVpc, cidr: "10.241.0.0/16",
    ip: "10.241.1.10", rows: r.devSubnet, metrics: m, muted: true,
  });
  const vpcBottom = vpcY + prod.h;

  // Transit Gateway.
  const tgwY = vpcBottom + 64;
  const cardsY = tgwY + 76;
  const cardW = 440;
  const prodCardX = M + m.pad;
  const devCardX = W - M - m.pad - cardW;
  const spokeCardH = cardHeight(2, m);
  const returnY = cardsY + spokeCardH + 38;
  const returnX = 360;
  const returnW = W - M - m.pad - returnX;
  const returnH = cardHeight(2, m);
  const tgwBottom = returnY + returnH + 22;
  container(scene, { x: M, y: tgwY, w: W - 2 * M, h: tgwBottom - tgwY, titleMax: OUT_PROD_X - 12 - M - m.pad }, {
    title: c.tgw, kind: "tgw", metrics: m,
  });
  routeCard(scene, {
    x: prodCardX, y: cardsY, w: cardW, name: c.rtProd, association: c.assocProd,
    rows: r.rtProd, metrics: m,
  });
  routeCard(scene, {
    x: devCardX, y: cardsY, w: cardW, name: c.rtDev, association: c.assocDev,
    rows: r.rtDev, metrics: m, muted: true,
  });
  routeCard(scene, {
    x: returnX, y: returnY, w: returnW, name: c.rtReturn, association: c.assocReturn,
    rows: r.rtReturn, metrics: m,
  });

  // Egress VPC.
  const egressY = tgwBottom + 64;
  const egressW = 740 - M;
  const attachX = M + m.pad;
  const attachW = 340;
  const subnetsY = egressY + 76;
  const natH = 76;
  const natY = subnetsY + 44;
  const natRowCenter = natY + natH / 2; // aligned with "0.0.0.0/0 → NAT"
  const attachRowsY = natRowCenter - m.rowHeight / 2;
  const attachH = attachRowsY - subnetsY + rowsHeight(r.attachmentSubnet.length, m) + 18;
  const publicX = attachX + attachW + 28;
  const publicW = 680 - publicX;
  const natX = publicX + 16;
  const natW = 204;
  const publicRowsY = natY + natH + 24;
  const publicH = publicRowsY - subnetsY + rowsHeight(r.publicSubnet.length, m) + 14;
  const egressH = subnetsY - egressY + publicH + 20;
  container(scene, { x: M, y: egressY, w: egressW, h: egressH }, {
    title: c.egressVpc, subtitle: "10.242.0.0/16", kind: "vpc", metrics: m,
  });
  container(scene, { x: attachX, y: subnetsY, w: attachW, h: attachH }, {
    title: c.attachmentSubnet, kind: "subnet", metrics: { ...m, pad: 16, titleBaseline: 28 },
  });
  routeRows(scene, { x: attachX + 16, y: attachRowsY, w: attachW - 32, rows: r.attachmentSubnet, metrics: m });
  container(scene, { x: publicX, y: subnetsY, w: publicW, h: publicH }, {
    title: c.publicSubnet, kind: "subnet", metrics: { ...m, pad: 16, titleBaseline: 28 },
  });
  routeRows(scene, { x: publicX + 16, y: publicRowsY, w: publicW - 32, rows: r.publicSubnet, metrics: m });
  scene.text(M + m.pad, egressY + egressH - 22, c.scope, {
    size: m.small,
    fill: "textSecondary",
    maxWidth: publicX - M - m.pad - 12,
  });

  // NAT, IGW, API.
  box(scene, { x: natX, y: natY, w: natW, h: natH }, [
    { text: c.nat, bold: true },
    { text: c.natKind, size: m.small, fill: "textSecondary" },
  ], { metrics: m, stroke: "tgwStroke", lift: 6 });
  badge(scene, natX + natW - 60, natY + natH - 14, "EIP", m);
  const igw = { x: 690, y: natY, w: 102, h: natH };
  box(scene, igw, c.igw.map((text) => ({ text, bold: true, size: m.small, fill: "amberText" })), {
    metrics: m, fill: "tgwFill", stroke: "tgwStroke", sw: 3,
  });
  const api = { x: 826, y: natY, w: W - M - 826, h: natH };
  box(scene, api, [
    { text: c.api, bold: true },
    { text: c.https, size: m.small, fill: "textSecondary" },
  ], { metrics: m });

  // Outbound flow (amber).
  flow(scene, [[OUT_PROD_X, prod.subnetBottom], [OUT_PROD_X, cardsY]], "out");
  flow(scene, [[OUT_EGRESS_X, cardsY + spokeCardH], [OUT_EGRESS_X, subnetsY]], "out");
  const outY = natRowCenter - 9;
  const backY = natRowCenter + 9;
  flow(scene, [[attachX + attachW, natRowCenter], [natX, natRowCenter]], "out");
  flow(scene, [[natX + natW, outY], [igw.x, outY]], "out");
  flow(scene, [[igw.x + igw.w, outY], [api.x, outY]], "out");

  // Development enters through its own attachment and table.
  flow(scene, [[DEV_X, dev.subnetBottom], [DEV_X, cardsY]], "muted");

  // Return flow (green, dashed).
  flow(scene, [[api.x, backY], [igw.x + igw.w, backY]], "back");
  flow(scene, [[igw.x, backY], [natX + natW, backY]], "back");
  const natExitX = natX + natW - 14;
  assertClearOfTitle(publicX + 16, c.publicSubnet, m.subnetTitle, natExitX, scene.name);
  const egressGapY = tgwBottom + 32;
  const returnMidY = returnY + returnH / 2;
  flow(scene, [
    [natExitX, natY],
    [natExitX, egressGapY],
    [BACK_EGRESS_X, egressGapY],
    [BACK_EGRESS_X, returnMidY],
    [returnX, returnMidY],
  ], "back");
  const tgwGapY = tgwY + 56;
  flow(scene, [
    [GAP_X, returnY],
    [GAP_X, tgwGapY],
    [BACK_PROD_X, tgwGapY],
    [BACK_PROD_X, prod.subnetBottom],
  ], "back");

  // Attachments on the TGW border.
  pill(scene, (OUT_PROD_X + BACK_PROD_X) / 2, tgwY, c.prodAttachment, { metrics: m });
  pill(scene, DEV_X, tgwY, c.devAttachment, { metrics: m, muted: true });
  pill(scene, (OUT_EGRESS_X + BACK_EGRESS_X) / 2, tgwBottom, c.egressAttachment, { metrics: m });

  // Return steps.
  marker(scene, (natX + natW + igw.x) / 2, backY, 1, m);
  marker(scene, natExitX, (egressY + subnetsY) / 2, 2, m);
  marker(scene, GAP_X, cardsY + spokeCardH + 19, 3, m);
  marker(scene, BACK_PROD_X, (vpcBottom + tgwY) / 2 - 6, 4, m);

  const legendY = egressY + egressH + 40;
  const legendBottom = legend(scene, { x: M + 6, y: legendY, w: W - 2 * M - 6, c, metrics: m, columns: 2 });
  scene.height = Math.ceil(legendBottom + 24);
  return scene;
}

/* ------------------------------------------------------------------------ */
/* Narrow layout (phones: shown at ~320–440 px, edge to edge below 480 px)  */
/* ------------------------------------------------------------------------ */

const NARROW_METRICS = {
  pad: 16,
  title: 20,
  subnetTitle: 19,
  titleBaseline: 32,
  subtitleGap: 26,
  body: 19,
  mono: 19,
  small: 19,
  smallLine: 25,
  rowHeight: 32,
  cardPad: 10,
  cardTitle: 20,
  cardTitleBaseline: 30,
  cardHeader: 40,
  cardBottom: 12,
  markerRadius: 16,
  markerFont: 20,
  boxLine: 26,
};

function buildNarrow(lang) {
  const c = COPY[lang];
  const r = routes(c);
  const m = NARROW_METRICS;
  const W = 600;
  const M = 14;
  const scene = new Scene(W, `${lang}/narrow`);
  const twoLine = true;

  // Flow guides. Outbound comes down the left side of the TGW and reaches the
  // attachment subnet from outside the egress VPC; return climbs on the right.
  const COL_GAP = 12;
  const colW = (W - 2 * M - COL_GAP) / 2;
  const prodX = M;
  const devX = M + colW + COL_GAP;
  const OUT_PROD_X = 236;
  const BACK_PROD_X = 264;
  const OUT_EGRESS_X = 66;
  const BACK_EGRESS_X = 118;
  const CARD_W = colW - 22;
  const GAP_X = W / 2; // between the two spoke tables (they mirror each other)
  // Two-line attachment labels (last word on its own line), placed so the
  // production and development labels do not touch.
  const split = (label) => {
    const words = label.split(" ");
    return [words.slice(0, -1).join(" "), words.at(-1)];
  };
  const prodPillRight = (OUT_PROD_X + BACK_PROD_X) / 2 + pillWidth(split(c.prodAttachment), m) / 2;
  const devPillW = pillWidth(split(c.devAttachment), m);
  const DEV_X = Math.max(devX + colW / 2, prodPillRight + 12 + devPillW / 2);
  if (DEV_X + devPillW / 2 > W - M) {
    throw new Error(`[${scene.name}] attachment labels do not fit side by side`);
  }

  // Spoke VPCs, side by side.
  const titleMax = colW - 2 * m.pad;
  const prodTitle = splitLines(c.prodVpc, titleMax, m.title, true);
  const devTitle = splitLines(c.devVpc, titleMax, m.title, true);
  const titleLines = Math.max(prodTitle.length, devTitle.length);
  const vpcY = M;
  const subnetY = vpcY + m.titleBaseline + titleLines * m.subtitleGap + 18;
  const subnetH = 96 + rowsHeight(1, m, twoLine) + 14;
  const vpcH = subnetY - vpcY + subnetH + 14;
  const spoke = (x, title, cidr, ip, rows, muted) => {
    container(scene, { x, y: vpcY, w: colW, h: vpcH }, { title, subtitle: cidr, kind: "vpc", metrics: m });
    const sx = x + m.pad;
    const sw = colW - 2 * m.pad;
    container(scene, { x: sx, y: subnetY, w: sw, h: subnetH }, {
      title: c.privateSubnet, kind: "subnet", metrics: { ...m, pad: 14, titleBaseline: 30 },
    });
    scene.text(sx + 14, subnetY + 58, c.app, {
      size: m.body,
      fill: muted ? "textSecondary" : "text",
      maxWidth: sw - 28,
    });
    scene.text(sx + 14, subnetY + 84, ip, { size: m.mono, mono: true, fill: "text", maxWidth: sw - 28 });
    routeRows(scene, { x: sx + 14, y: subnetY + 96, w: sw - 28, rows, metrics: m, twoLine });
  };
  spoke(prodX, prodTitle, "10.240.0.0/16", "10.240.1.10", r.prodSubnet, false);
  spoke(devX, devTitle, "10.241.0.0/16", "10.241.1.10", r.devSubnet, true);
  const spokeBottom = subnetY + subnetH;
  const vpcBottom = vpcY + vpcH;

  // Transit Gateway: spoke tables side by side, rt-retorno below.
  const tgwY = vpcBottom + 80;
  // The two-line attachment labels cover the border, so the title sits lower.
  const tgwTitleBaseline = 56;
  const cardsY = tgwY + 74;
  const cardW = CARD_W;
  const prodCardX = prodX + 12;
  const devCardX = W - M - 12 - cardW;
  const assocMax = cardW - 2 * m.cardPad;
  const prodAssoc = splitLines(c.assocProd, assocMax, m.small);
  const devAssoc = splitLines(c.assocDev, assocMax, m.small);
  const assocCount = Math.max(prodAssoc.length, devAssoc.length);
  const spokeCardH = cardHeight(2, m, { twoLine, assocLineCount: assocCount });
  const returnX = 170;
  const returnW = W - M - m.pad - returnX;
  const retAssoc = splitLines(c.assocReturn, returnW - 2 * m.cardPad, m.small);
  const returnY = cardsY + spokeCardH + 44;
  const returnH = cardHeight(2, m, { twoLine, assocLineCount: retAssoc.length });
  const tgwBottom = returnY + returnH + 20;
  container(scene, { x: M, y: tgwY, w: W - 2 * M, h: tgwBottom - tgwY, titleMax: OUT_PROD_X - 12 - M - m.pad }, {
    title: c.tgw, kind: "tgw", metrics: { ...m, titleBaseline: tgwTitleBaseline },
  });
  const pad = (lines) => [...lines, ...Array(assocCount - lines.length).fill("")];
  routeCard(scene, {
    x: prodCardX, y: cardsY, w: cardW, name: c.rtProd, rows: r.rtProd, metrics: m,
    twoLine, assocLines: pad(prodAssoc),
  });
  routeCard(scene, {
    x: devCardX, y: cardsY, w: cardW, name: c.rtDev, rows: r.rtDev, metrics: m, muted: true,
    twoLine, assocLines: pad(devAssoc),
  });
  routeCard(scene, {
    x: returnX, y: returnY, w: returnW, name: c.rtReturn, rows: r.rtReturn, metrics: m,
    twoLine, assocLines: retAssoc,
  });

  // Egress VPC, inset so the outbound line can enter from the left.
  const egressX = 100;
  const egressY = tgwBottom + 92;
  const egressW = W - M - egressX;
  const ex = egressX + m.pad;
  const attachY = egressY + m.titleBaseline + 2 * m.subtitleGap + 4;
  const attachW = 310;
  const attachRowsY = attachY + 42;
  const attachH = 42 + rowsHeight(1, m, twoLine) + 12;
  const publicY = attachY + attachH + 24;
  const publicW = W - M - m.pad - ex;
  const publicRowsY = publicY + 44;
  const publicRowsW = 236;
  const natW = 160;
  const natX = W - M - m.pad - 14 - natW;
  const natY = publicRowsY;
  const natH = 80;
  const publicH = 44 + rowsHeight(r.publicSubnet.length, m, twoLine) + 12;
  const igwW = 130;
  const igwH = 72;
  const egressH = publicY - egressY + publicH + 20 + igwH / 2;
  container(scene, { x: egressX, y: egressY, w: egressW, h: egressH }, {
    title: c.egressVpc, subtitle: "10.242.0.0/16", kind: "vpc", metrics: m,
  });
  container(scene, { x: ex, y: attachY, w: attachW, h: attachH }, {
    title: c.attachmentSubnet, kind: "subnet", metrics: { ...m, pad: 14, titleBaseline: 30 },
  });
  routeRows(scene, { x: ex + 14, y: attachRowsY, w: attachW - 28, rows: r.attachmentSubnet, metrics: m, twoLine });
  container(scene, { x: ex, y: publicY, w: publicW, h: publicH }, {
    title: c.publicSubnet, kind: "subnet", metrics: { ...m, pad: 14, titleBaseline: 30 },
  });
  routeRows(scene, { x: ex + 14, y: publicRowsY, w: publicRowsW, rows: r.publicSubnet, metrics: m, twoLine });
  box(scene, { x: natX, y: natY, w: natW, h: natH }, [
    { text: c.nat, bold: true },
    { text: c.natKind, size: m.small, fill: "textSecondary" },
  ], { metrics: m, stroke: "tgwStroke", lift: 6 });
  badge(scene, natX + natW - 46, natY + natH - 14, "EIP", m);
  const igwCenter = natX + natW / 2;
  const igw = { x: igwCenter - igwW / 2, y: egressY + egressH - igwH / 2, w: igwW, h: igwH };
  box(scene, igw, c.igw.map((text) => ({ text, bold: true, size: m.small, fill: "amberText" })), {
    metrics: { ...m, boxLine: 24 }, fill: "tgwFill", stroke: "tgwStroke", sw: 3,
  });
  const api = { x: igwCenter - 80, y: igw.y + igwH + 56, w: 160, h: 76 };
  box(scene, api, [
    { text: c.api, bold: true },
    { text: c.https, size: m.small, fill: "textSecondary" },
  ], { metrics: m });

  // Outbound (amber).
  flow(scene, [[OUT_PROD_X, spokeBottom], [OUT_PROD_X, cardsY]], "out");
  const attachRowCenter = attachRowsY + m.rowHeight / 2;
  flow(scene, [
    [OUT_EGRESS_X, cardsY + spokeCardH],
    [OUT_EGRESS_X, attachRowCenter],
    [ex, attachRowCenter],
  ], "out");
  // The NAT sits partly under the attachment subnet, so outbound drops into it.
  const natInX = natX + 14;
  if (natInX > ex + attachW - 12) throw new Error(`[${scene.name}] NAT is not under the attachment subnet`);
  flow(scene, [[natInX, attachY + attachH], [natInX, natY]], "out");
  const outX = igwCenter - 16;
  const backX = igwCenter + 16;
  flow(scene, [[outX, natY + natH], [outX, igw.y]], "out");
  flow(scene, [[outX, igw.y + igwH], [outX, api.y]], "out");

  // Development enters through its own attachment and table.
  flow(scene, [[DEV_X, spokeBottom], [DEV_X, cardsY]], "muted");

  // Return (green, dashed).
  flow(scene, [[backX, api.y], [backX, igw.y + igwH]], "back");
  flow(scene, [[backX, igw.y], [backX, natY + natH]], "back");
  const natExitX = natX + natW - 26;
  assertClearOfTitle(ex + 14, c.publicSubnet, m.subnetTitle, natExitX, scene.name);
  const egressGapY = tgwBottom + 44;
  const returnMidY = returnY + returnH / 2;
  flow(scene, [
    [natExitX, natY],
    [natExitX, egressGapY],
    [BACK_EGRESS_X, egressGapY],
    [BACK_EGRESS_X, returnMidY],
    [returnX, returnMidY],
  ], "back");
  const tgwGapY = tgwY + tgwTitleBaseline + 2;
  flow(scene, [
    [GAP_X, returnY],
    [GAP_X, tgwGapY],
    [BACK_PROD_X, tgwGapY],
    [BACK_PROD_X, spokeBottom],
  ], "back");

  // Attachments.
  pill(scene, (OUT_PROD_X + BACK_PROD_X) / 2, tgwY, split(c.prodAttachment), { metrics: m });
  pill(scene, DEV_X, tgwY, split(c.devAttachment), { metrics: m, muted: true });
  // Keep the egress label inside the canvas; both lines still cross it.
  const egressPill = split(c.egressAttachment);
  const egressPillW = pillWidth(egressPill, m);
  // Clear of the TGW frame corner (radius 12 plus its stroke).
  const egressPillX = Math.max((OUT_EGRESS_X + BACK_EGRESS_X) / 2, M + 16 + egressPillW / 2);
  if (egressPillX - egressPillW / 2 > OUT_EGRESS_X - 8 || egressPillX + egressPillW / 2 < BACK_EGRESS_X + 8) {
    throw new Error(`[${scene.name}] egress label does not cover both flow lines`);
  }
  pill(scene, egressPillX, tgwBottom, egressPill, { metrics: m });

  // Return steps.
  marker(scene, backX, (natY + natH + igw.y) / 2 + 6, 1, m);
  marker(scene, natExitX, (attachY + attachH + publicY) / 2 - 22, 2, m);
  marker(scene, GAP_X, cardsY + spokeCardH + 22, 3, m);
  marker(scene, BACK_PROD_X, vpcBottom + 20, 4, m);

  const legendY = api.y + api.h + 50;
  const legendBottom = legend(scene, { x: M + 6, y: legendY, w: W - 2 * M - 6, c, metrics: m, columns: 1 });
  scene.height = Math.ceil(legendBottom + 24);
  return scene;
}

/** Fails if a vertical flow line at lineX would cross a subnet title. */
function assertClearOfTitle(titleX, title, size, lineX, name) {
  const end = titleX + measure(title, size, { bold: true }) * FIT_SLACK;
  if (lineX < end + 8) {
    throw new Error(`[${name}] flow line at x=${lineX} crosses "${title}" (ends at ${Math.ceil(end)})`);
  }
}

function splitLines(text, maxWidth, size, bold = false) {
  if (measure(text, size, { bold }) * FIT_SLACK <= maxWidth) return [text];
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (measure(next, size, { bold }) * FIT_SLACK > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.map((line) => line.replace(/^· | ·$/g, ""));
}

/* ------------------------------------------------------------------------ */
/* Output                                                                    */
/* ------------------------------------------------------------------------ */

const FONT_SANS =
  'Geist, "Segoe UI", system-ui, -apple-system, Roboto, "Helvetica Neue", Arial, sans-serif';
const FONT_MONO =
  '"Geist Mono", ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';

const escapeXml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const n = (v) => Number(v.toFixed(1));

function arrowHead(points, sw, head) {
  const [x1, y1] = points.at(-2);
  const [x2, y2] = points.at(-1);
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const size = head?.size ?? 8 + sw * 1.4;
  const half = head?.half ?? 3 + sw;
  const bx = x2 - ux * size;
  const by = y2 - uy * size;
  return {
    tip: [x2, y2],
    base: [bx, by],
    left: [bx - uy * half, by + ux * half],
    right: [bx + uy * half, by - ux * half],
  };
}

function toSvg(scene, theme, c) {
  const t = THEMES[theme];
  const color = (token) => (token ? t[token] : "none");
  const out = [];
  out.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${scene.width}" height="${scene.height}" viewBox="0 0 ${scene.width} ${scene.height}" role="img" aria-labelledby="title desc">`,
    `<title id="title">${escapeXml(c.title)}</title>`,
    `<desc id="desc">${escapeXml(c.desc)}</desc>`,
    `<style>.s{font-family:${FONT_SANS}}.m{font-family:${FONT_MONO}}.b{font-weight:600}</style>`,
    `<rect width="${scene.width}" height="${scene.height}" fill="${t.bg}"/>`,
  );
  for (const s of scene.shapes) {
    if (s.type === "rect") {
      const stroke = s.stroke && s.sw ? ` stroke="${color(s.stroke)}" stroke-width="${s.sw}"` : "";
      out.push(
        `<rect x="${n(s.x)}" y="${n(s.y)}" width="${n(s.w)}" height="${n(s.h)}" rx="${n(s.r)}" fill="${color(s.fill)}"${stroke}/>`,
      );
    } else if (s.type === "circle") {
      const stroke = s.stroke && s.sw ? ` stroke="${color(s.stroke)}" stroke-width="${s.sw}"` : "";
      out.push(`<circle cx="${n(s.cx)}" cy="${n(s.cy)}" r="${s.r}" fill="${color(s.fill)}"${stroke}/>`);
    } else if (s.type === "text") {
      const cls = [s.mono ? "m" : "s", s.bold ? "b" : ""].filter(Boolean).join(" ");
      const anchor = s.anchor === "start" ? "" : ` text-anchor="${s.anchor}"`;
      out.push(
        `<text x="${n(s.x)}" y="${n(s.y)}" class="${cls}" font-size="${s.size}" fill="${color(s.fill)}"${anchor}>${escapeXml(s.text)}</text>`,
      );
    } else if (s.type === "line") {
      const pts = s.points.map((p) => [...p]);
      let head = "";
      if (s.arrow) {
        const a = arrowHead(pts, s.sw, s.head);
        pts[pts.length - 1] = a.base;
        head = `<polygon points="${[a.tip, a.left, a.right].map((p) => p.map(n).join(",")).join(" ")}" fill="${color(s.stroke)}"/>`;
      }
      const d = pts.map((p, i) => `${i ? "L" : "M"}${n(p[0])} ${n(p[1])}`).join(" ");
      const dash = s.dash ? ` stroke-dasharray="${s.dash}"` : "";
      out.push(
        `<path d="${d}" fill="none" stroke="${color(s.stroke)}" stroke-width="${s.sw}" stroke-linecap="round" stroke-linejoin="round"${dash}/>`,
        head,
      );
    }
  }
  out.push("</svg>", "");
  return out.filter(Boolean).join("\n");
}

function toExcalidraw(scene, theme) {
  const t = THEMES[theme];
  let seed = 1;
  const base = (type, x, y, w, h, extra) => ({
    id: `hub-spoke-${String(seed).padStart(3, "0")}-${type}`,
    type,
    x: n(x),
    y: n(y),
    width: n(w),
    height: n(h),
    angle: 0,
    strokeColor: "transparent",
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 0,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness: null,
    seed: seed,
    version: 1,
    versionNonce: seed++ * 7919,
    isDeleted: false,
    boundElements: null,
    updated: 1793059200000,
    link: null,
    locked: false,
    ...extra,
  });
  const elements = [
    base("rectangle", 0, 0, scene.width, scene.height, { backgroundColor: t.bg, strokeColor: t.bg, strokeWidth: 0 }),
  ];
  for (const s of scene.shapes) {
    if (s.type === "rect") {
      elements.push(
        base("rectangle", s.x, s.y, s.w, s.h, {
          strokeColor: s.stroke && s.sw ? t[s.stroke] : "transparent",
          backgroundColor: s.fill ? t[s.fill] : "transparent",
          strokeWidth: s.sw,
          roundness: { type: 3, value: s.r },
        }),
      );
    } else if (s.type === "circle") {
      elements.push(
        base("ellipse", s.cx - s.r, s.cy - s.r, 2 * s.r, 2 * s.r, {
          strokeColor: s.stroke ? t[s.stroke] : "transparent",
          backgroundColor: t[s.fill],
          strokeWidth: s.sw,
        }),
      );
    } else if (s.type === "text") {
      const align = { start: "left", middle: "center", end: "right" }[s.anchor];
      const left = s.anchor === "start" ? s.x : s.anchor === "middle" ? s.x - s.width / 2 : s.x - s.width;
      elements.push(
        base("text", left, s.y - s.size, s.width, s.size * 1.25, {
          strokeColor: t[s.fill],
          text: s.text,
          originalText: s.text,
          fontSize: s.size,
          fontFamily: s.mono ? 3 : 2,
          textAlign: align,
          verticalAlign: "top",
          lineHeight: 1.25,
          autoResize: true,
          containerId: null,
        }),
      );
    } else if (s.type === "line") {
      const [x0, y0] = s.points[0];
      const xs = s.points.map((p) => p[0]);
      const ys = s.points.map((p) => p[1]);
      elements.push(
        base(s.arrow ? "arrow" : "line", x0, y0, Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), {
          strokeColor: t[s.stroke],
          strokeWidth: s.sw,
          strokeStyle: s.dash ? "dashed" : "solid",
          points: s.points.map(([x, y]) => [n(x - x0), n(y - y0)]),
          lastCommittedPoint: null,
          startBinding: null,
          endBinding: null,
          startArrowhead: null,
          endArrowhead: s.arrow ? "arrow" : null,
          elbowed: false,
        }),
      );
    }
  }
  return `${JSON.stringify(
    {
      type: "excalidraw",
      version: 2,
      source: "scripts/diagrams/hub-and-spoke-aws.mjs",
      elements,
      appState: { gridSize: 20, gridStep: 5, gridModeEnabled: false, viewBackgroundColor: t.bg },
      files: {},
    },
    null,
    2,
  )}\n`;
}

function checkContrast() {
  const failures = [];
  for (const [theme, t] of Object.entries(THEMES)) {
    for (const [fg, bg, min] of CONTRAST_PAIRS) {
      const ratio = contrast(t[fg], t[bg]);
      if (ratio < min) failures.push(`${theme}: ${fg} on ${bg} = ${ratio.toFixed(2)} (< ${min})`);
    }
  }
  if (failures.length) throw new Error(`Contrast failures:\n${failures.join("\n")}`);
}

function main() {
  checkContrast();
  mkdirSync(OUT_DIR, { recursive: true });
  const sizes = {};
  for (const lang of ["pt", "en"]) {
    for (const [layout, build] of [["wide", buildWide], ["mobile", buildNarrow]]) {
      const scene = build(lang);
      for (const theme of ["light", "dark"]) {
        const name = [
          "fluxo-rede",
          lang === "en" ? "en" : null,
          layout === "mobile" ? "mobile" : null,
          theme === "dark" ? "dark" : null,
        ]
          .filter(Boolean)
          .join(".");
        writeFileSync(path.join(OUT_DIR, `${name}.svg`), toSvg(scene, theme, COPY[lang]));
        sizes[`${name}.svg`] = `${scene.width}x${scene.height}`;
      }
      if (lang === "pt" && layout === "wide") {
        mkdirSync(path.dirname(EXCALIDRAW_FILE), { recursive: true });
        writeFileSync(EXCALIDRAW_FILE, toExcalidraw(scene, "light"));
      }
    }
  }
  for (const [file, size] of Object.entries(sizes)) {
    process.stdout.write(`${file.padEnd(32)} ${size}\n`);
  }
}

main();
