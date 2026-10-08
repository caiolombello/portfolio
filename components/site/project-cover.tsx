import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CoverTheme {
  bg: string;
  panel: string;
  accent: string;
  text: string;
}

/** Palettes follow each project's own identity where it has one. */
export const PROJECT_THEMES: Record<string, CoverTheme> = {
  falatrace: {
    bg: "#0b1716",
    panel: "#11221f",
    accent: "#57d5b0",
    text: "#f4f1e9",
  },
  quotalantern: {
    bg: "#0d2030",
    panel: "#12293c",
    accent: "#86d8ec",
    text: "#e7eef5",
  },
  perigauge: {
    bg: "#0e1124",
    panel: "#151a33",
    accent: "#a9b4ff",
    text: "#f2f4ff",
  },
  delexpress: {
    bg: "#0f172a",
    panel: "#1e293b",
    accent: "#f87171",
    text: "#f1f5f9",
  },
  skills: {
    bg: "#110e1b",
    panel: "#1c1733",
    accent: "#a78bfa",
    text: "#ede9fe",
  },
  "radar-de-producao": {
    bg: "#140d09",
    panel: "#1d130e",
    accent: "#fb923c",
    text: "#fdebdd",
  },
  dotfiles: {
    bg: "#0b0e09",
    panel: "#11150e",
    accent: "#a3e635",
    text: "#e2f0cf",
  },
  "portfolio-website": {
    bg: "#0b0b0c",
    panel: "#121215",
    accent: "#faaf2e",
    text: "#f5f3ee",
  },
};

const FALLBACK_THEME: CoverTheme = PROJECT_THEMES["portfolio-website"];

export function projectTheme(id: string): CoverTheme {
  return PROJECT_THEMES[id] ?? FALLBACK_THEME;
}

const MONO = { fontFamily: "var(--font-mono), ui-monospace, monospace" };
const OK = "#4ade80";
const WARN = "#f5b942";
const BAD = "#f87171";

interface MotifProps {
  t: CoverTheme;
  uid: string;
}

function FalaTraceMotif({ t }: MotifProps) {
  const bars = Array.from({ length: 60 }, (_, i) => {
    const v = Math.abs(
      Math.sin(i * 0.61) * 0.62 + Math.sin(i * 0.23 + 1.3) * 0.38,
    );
    return 14 + Math.round(v * 96);
  });
  const isHighlighted = (i: number) => i >= 27 && i <= 34;

  return (
    <g>
      <path
        d="M 92 62 h -16 v 40 h 16"
        fill="none"
        stroke={t.text}
        strokeOpacity="0.7"
        strokeWidth="5"
      />
      <circle cx="104" cy="82" r="5" fill={t.accent} />

      <rect
        x="362"
        y="248"
        width="91"
        height="140"
        rx="12"
        fill={t.accent}
        fillOpacity="0.08"
        stroke={t.accent}
        strokeOpacity="0.45"
      />
      {bars.map((height, i) => (
        <rect
          key={i}
          x={100 + i * 10}
          y={318 - height / 2}
          width="5"
          height={height}
          rx="2.5"
          fill={t.accent}
          fillOpacity={isHighlighted(i) ? 1 : 0.26}
        />
      ))}

      <path
        d="M 400 190 C 400 222, 407 220, 407 248"
        fill="none"
        stroke={t.accent}
        strokeOpacity="0.75"
        strokeWidth="2"
        strokeDasharray="3 5"
      />
      <rect
        x="250"
        y="86"
        width="300"
        height="104"
        rx="16"
        fill={t.panel}
        stroke={t.accent}
        strokeOpacity="0.35"
      />
      <text
        x="274"
        y="121"
        fontSize="12"
        letterSpacing="1.5"
        fill={t.accent}
        style={MONO}
      >
        s000214
      </text>
      <rect
        x="470"
        y="104"
        width="62"
        height="24"
        rx="12"
        fill={t.accent}
        fillOpacity="0.14"
        stroke={t.accent}
        strokeOpacity="0.5"
      />
      <text
        x="501"
        y="120.5"
        fontSize="12"
        textAnchor="middle"
        fill={t.accent}
        style={MONO}
      >
        12:48
      </text>
      <rect
        x="274"
        y="140"
        width="236"
        height="9"
        rx="4.5"
        fill={t.text}
        fillOpacity="0.8"
      />
      <rect
        x="274"
        y="159"
        width="168"
        height="9"
        rx="4.5"
        fill={t.text}
        fillOpacity="0.36"
      />

      <text
        x="100"
        y="446"
        fontSize="13"
        fill={t.text}
        fillOpacity="0.42"
        style={MONO}
      >
        12:48.4 → 12:55.1
      </text>
      <text
        x="700"
        y="446"
        fontSize="13"
        textAnchor="end"
        fill={t.text}
        fillOpacity="0.42"
        style={MONO}
      >
        sha256 3f9c…e1a0
      </text>
    </g>
  );
}

function ring(cx: number, cy: number, r: number, fraction: number) {
  const circumference = 2 * Math.PI * r;
  return {
    cx,
    cy,
    r,
    strokeDasharray: `${(fraction * circumference).toFixed(2)} ${circumference.toFixed(2)}`,
    transform: `rotate(-90 ${cx} ${cy})`,
  };
}

function QuotaLanternMotif({ t }: MotifProps) {
  const legend = [
    { label: "ok", color: OK, fraction: 0.7 },
    { label: "warn", color: WARN, fraction: 0.88 },
    { label: "crit", color: BAD, fraction: 0.97 },
    { label: "n/a", color: "#94a3b8", dash: "1.5 4" },
    { label: "stale", color: "#94a3b8", dash: "5 4" },
  ];

  return (
    <g>
      <circle
        cx="400"
        cy="250"
        r="118"
        fill="none"
        stroke={OK}
        strokeOpacity="0.16"
        strokeWidth="24"
      />
      <circle
        {...ring(400, 250, 118, 0.42)}
        fill="none"
        stroke={OK}
        strokeWidth="24"
        strokeLinecap="round"
      />

      <g fill={t.text}>
        <rect x="386" y="184" width="28" height="9" rx="2" />
        <path d="M 360 214 L 440 214 L 424 196 L 376 196 Z" />
        <path d="M 368 222 H 432 L 422 306 H 378 Z" />
        <rect x="372" y="310" width="56" height="9" rx="3" />
      </g>
      <rect x="386" y="236" width="28" height="52" rx="3" fill={t.bg} />
      <rect x="391" y="243" width="18" height="38" rx="2" fill={t.accent} />

      <text
        x="560"
        y="246"
        fontSize="46"
        fontWeight="600"
        fill={t.text}
        style={MONO}
      >
        42%
      </text>
      <text
        x="562"
        y="276"
        fontSize="14"
        fill={t.text}
        fillOpacity="0.55"
        style={MONO}
      >
        codex · 5h
      </text>

      {legend.map((item, index) => {
        const y = 170 + index * 36;
        return (
          <g key={item.label}>
            {item.dash ? (
              <circle
                cx="150"
                cy={y}
                r="9"
                fill="none"
                stroke={item.color}
                strokeWidth="3.5"
                strokeDasharray={item.dash}
              />
            ) : (
              <>
                <circle
                  cx="150"
                  cy={y}
                  r="9"
                  fill="none"
                  stroke={item.color}
                  strokeOpacity="0.2"
                  strokeWidth="3.5"
                />
                <circle
                  {...ring(150, y, 9, item.fraction ?? 0)}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="3.5"
                />
              </>
            )}
            <text
              x="172"
              y={y + 4.5}
              fontSize="13"
              fill={t.text}
              fillOpacity="0.6"
              style={MONO}
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function SkillsMotif({ t }: MotifProps) {
  const chips = ["claude", "codex", "opencode", "kiro", "gemini"];
  return (
    <g>
      <text
        x="150"
        y="262"
        fontSize="68"
        fontWeight="700"
        textAnchor="middle"
        fill={t.accent}
        style={MONO}
      >
        70
      </text>
      <text
        x="150"
        y="294"
        fontSize="14"
        textAnchor="middle"
        fill={t.text}
        fillOpacity="0.55"
        style={MONO}
      >
        skills
      </text>

      <rect
        x="255"
        y="90"
        width="290"
        height="320"
        rx="18"
        fill="#18142a"
        stroke={t.accent}
        strokeOpacity="0.18"
        transform="rotate(-7 400 250)"
      />
      <rect
        x="255"
        y="90"
        width="290"
        height="320"
        rx="18"
        fill="#1a1630"
        stroke={t.accent}
        strokeOpacity="0.25"
        transform="rotate(-3.5 400 250)"
      />
      <rect
        x="255"
        y="90"
        width="290"
        height="320"
        rx="18"
        fill={t.panel}
        stroke={t.accent}
        strokeOpacity="0.45"
      />

      <text
        x="279"
        y="127"
        fontSize="14"
        fontWeight="600"
        fill={t.accent}
        style={MONO}
      >
        SKILL.md
      </text>
      <line
        x1="279"
        x2="521"
        y1="143"
        y2="143"
        stroke={t.text}
        strokeOpacity="0.12"
      />
      <g fontSize="13.5" style={MONO}>
        <text x="279" y="172" fill={t.text} fillOpacity="0.4">
          ---
        </text>
        <text x="279" y="198">
          <tspan fill={t.accent}>name:</tspan>
          <tspan fill={t.text}> diagnose</tspan>
        </text>
        <text x="279" y="224">
          <tspan fill={t.accent}>description:</tspan>
          <tspan fill={t.text} fillOpacity="0.85">
            {" "}
            Use when
          </tspan>
        </text>
        <text x="279" y="250" fill={t.text} fillOpacity="0.6">
          {" "}
          tests fail…
        </text>
        <text x="279" y="276" fill={t.text} fillOpacity="0.4">
          ---
        </text>
      </g>
      {[220, 180, 200, 140].map((width, index) => (
        <rect
          key={index}
          x="279"
          y={300 + index * 18}
          width={width}
          height="8"
          rx="4"
          fill={t.text}
          fillOpacity={index === 3 ? 0.18 : 0.32}
        />
      ))}

      {chips.map((chip, index) => (
        <g key={chip}>
          <rect
            x="590"
            y={150 + index * 42}
            width={chip.length * 8 + 30}
            height="28"
            rx="14"
            fill={t.accent}
            fillOpacity="0.08"
            stroke={t.accent}
            strokeOpacity="0.35"
          />
          <text
            x="605"
            y={169 + index * 42}
            fontSize="13"
            fill={t.text}
            fillOpacity="0.85"
            style={MONO}
          >
            {chip}
          </text>
        </g>
      ))}
    </g>
  );
}

function RadarMotif({ t, uid }: MotifProps) {
  const cx = 300;
  const cy = 252;
  const point = (angle: number, radius: number) => {
    const rad = (angle * Math.PI) / 180;
    return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)]
      .map((n) => n.toFixed(1))
      .join(" ");
  };
  const gates = ["evidence", "numbers", "links", "dedupe"];

  return (
    <g>
      <defs>
        <radialGradient
          id={`${uid}-sweep`}
          cx={cx}
          cy={cy}
          r="170"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={t.accent} stopOpacity="0.05" />
          <stop offset="100%" stopColor={t.accent} stopOpacity="0.3" />
        </radialGradient>
      </defs>
      {[50, 100, 150].map((r) => (
        <circle
          key={r}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={t.accent}
          strokeOpacity="0.2"
          strokeWidth="1.5"
        />
      ))}
      <circle
        cx={cx}
        cy={cy}
        r="170"
        fill="none"
        stroke={t.accent}
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />
      <line
        x1="130"
        x2="470"
        y1={cy}
        y2={cy}
        stroke={t.accent}
        strokeOpacity="0.12"
      />
      <line
        x1={cx}
        x2={cx}
        y1="82"
        y2="422"
        stroke={t.accent}
        strokeOpacity="0.12"
      />
      <path
        d={`M ${cx} ${cy} L ${point(-65, 170)} A 170 170 0 0 1 ${point(-15, 170)} Z`}
        fill={`url(#${uid}-sweep)`}
      />
      <line
        x1={cx}
        y1={cy}
        x2={point(-15, 170).split(" ")[0]}
        y2={point(-15, 170).split(" ")[1]}
        stroke={t.accent}
        strokeWidth="2"
        strokeOpacity="0.85"
      />
      <circle cx={cx} cy={cy} r="4" fill={t.accent} />

      {[
        [362, 150, 5],
        [412, 228, 5],
        [248, 182, 4],
        [222, 322, 5],
        [330, 390, 4],
      ].map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={OK} />
      ))}
      <circle cx="372" cy="324" r="6" fill={BAD} />
      <circle
        cx="372"
        cy="324"
        r="13"
        fill="none"
        stroke={BAD}
        strokeOpacity="0.5"
      />

      <rect
        x="520"
        y="118"
        width="210"
        height="268"
        rx="16"
        fill={t.panel}
        stroke={t.accent}
        strokeOpacity="0.3"
      />
      <text
        x="544"
        y="149"
        fontSize="12"
        letterSpacing="1.5"
        fill={t.accent}
        style={MONO}
      >
        QUALITY GATES
      </text>
      {gates.map((gate, index) => {
        const y = 186 + index * 34;
        return (
          <g key={gate}>
            <path
              d={`M 545 ${y - 4} l 5 5 l 9 -10`}
              fill="none"
              stroke={OK}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x="572"
              y={y + 1}
              fontSize="14"
              fill={t.text}
              fillOpacity="0.85"
              style={MONO}
            >
              {gate}
            </text>
          </g>
        );
      })}
      <line
        x1="544"
        x2="706"
        y1="314"
        y2="314"
        stroke={t.text}
        strokeOpacity="0.1"
      />
      <rect
        x="544"
        y="330"
        width="118"
        height="28"
        rx="14"
        fill={t.accent}
        fillOpacity="0.14"
        stroke={t.accent}
        strokeOpacity="0.5"
      />
      <text
        x="603"
        y="349"
        fontSize="13"
        textAnchor="middle"
        fill={t.accent}
        style={MONO}
      >
        fail-closed
      </text>
    </g>
  );
}

function DotfilesMotif({ t }: MotifProps) {
  const prompt = (y: number, command: string) => (
    <text x="136" y={y} fontSize="15.5" style={MONO}>
      <tspan fill={t.accent}>$ </tspan>
      <tspan fill={t.text}>{command}</tspan>
    </text>
  );
  const output = (y: number, items: string[], gap = "   ") => (
    <text x="136" y={y} fontSize="15.5" style={MONO}>
      {items.map((item, index) => (
        <tspan key={item}>
          <tspan fill={t.accent}>{index === 0 ? "  ✓ " : `${gap}✓ `}</tspan>
          <tspan fill={t.text} fillOpacity="0.6">
            {item}
          </tspan>
        </tspan>
      ))}
    </text>
  );

  return (
    <g>
      <rect
        x="110"
        y="72"
        width="580"
        height="356"
        rx="16"
        fill={t.panel}
        stroke={t.accent}
        strokeOpacity="0.22"
      />
      <line
        x1="110"
        x2="690"
        y1="112"
        y2="112"
        stroke={t.accent}
        strokeOpacity="0.14"
      />
      {[OK, WARN, BAD].reverse().map((color, index) => (
        <circle
          key={color}
          cx={138 + index * 22}
          cy="92"
          r="6"
          fill={color}
          fillOpacity="0.85"
        />
      ))}
      <text
        x="400"
        y="97"
        fontSize="13"
        textAnchor="middle"
        fill={t.text}
        fillOpacity="0.45"
        style={MONO}
      >
        ~/dotfiles
      </text>
      {prompt(154, "./scripts/bootstrap.sh")}
      {output(184, ["zsh", "git", "ssh", "vscode"])}
      {prompt(228, "python3 setup.py verify")}
      {output(258, ["sha256 manifest · no drift"])}
      {prompt(302, "nix flake check")}
      {output(332, ["x86_64-linux", "aarch64-linux"])}
      <text x="136" y="384" fontSize="15.5" fill={t.accent} style={MONO}>
        $
      </text>
      <rect x="156" y="370" width="10" height="18" fill={t.accent} />
    </g>
  );
}

function PeriGaugeMotif({ t }: MotifProps) {
  const row = (y: number, name: string, via: string) => (
    <g>
      <text x="176" y={y - 4} fontSize="15" fontWeight="600" fill={t.text}>
        {name}
      </text>
      <text
        x="176"
        y={y + 16}
        fontSize="12"
        fill={t.text}
        fillOpacity="0.5"
        style={MONO}
      >
        {via}
      </text>
    </g>
  );
  const gauge = (
    cx: number,
    cy: number,
    r: number,
    value: number,
    color: string,
    label: string,
  ) => (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={t.text}
        strokeOpacity="0.12"
        strokeWidth="4"
      />
      <circle
        {...ring(cx, cy, r, value)}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <text
        x={cx}
        y={cy + 4}
        fontSize="11"
        textAnchor="middle"
        fill={t.text}
        style={MONO}
      >
        {label}
      </text>
    </g>
  );
  const buds = [
    { cx: 470, label: "L", value: 0.64, color: OK },
    { cx: 530, label: "R", value: 0.61, color: OK },
    { cx: 590, label: "case", value: 0.18, color: WARN },
  ];

  return (
    <g>
      <rect
        x="150"
        y="58"
        width="500"
        height="318"
        rx="18"
        fill={t.panel}
        stroke={t.accent}
        strokeOpacity="0.3"
      />
      <text
        x="176"
        y="93"
        fontSize="12"
        letterSpacing="1.5"
        fill={t.accent}
        style={MONO}
      >
        PERIGAUGE
      </text>
      <rect
        x="520"
        y="76"
        width="104"
        height="24"
        rx="12"
        fill="none"
        stroke={t.text}
        strokeOpacity="0.2"
      />
      <rect
        x="522"
        y="78"
        width="50"
        height="20"
        rx="10"
        fill={t.accent}
        fillOpacity="0.2"
      />
      <circle
        cx="547"
        cy="88"
        r="5.5"
        fill="none"
        stroke={t.accent}
        strokeWidth="2"
      />
      <rect
        x="586"
        y="84.5"
        width="24"
        height="7"
        rx="3.5"
        fill="none"
        stroke={t.text}
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      <line
        x1="150"
        x2="650"
        y1="112"
        y2="112"
        stroke={t.text}
        strokeOpacity="0.08"
      />

      {row(156, "Keychron M6", "ultra-link 8k")}
      {gauge(590, 152, 19, 0.72, OK, "72")}

      {row(226, "Galaxy Buds3 Pro", "bluetooth · spp")}
      {buds.map((bud) => (
        <g key={bud.label}>
          {gauge(bud.cx, 216, 16, bud.value, bud.color, "")}
          <text
            x={bud.cx}
            y="252"
            fontSize="11"
            textAnchor="middle"
            fill={t.text}
            fillOpacity="0.55"
            style={MONO}
          >
            {bud.label}
          </text>
        </g>
      ))}

      {row(310, "MX Master 3S", "hid++ · bolt")}
      <rect
        x="470"
        y="300"
        width="110"
        height="12"
        rx="6"
        fill={t.text}
        fillOpacity="0.12"
      />
      <rect x="470" y="300" width="14" height="12" rx="6" fill={BAD} />
      <text
        x="624"
        y="311"
        fontSize="14"
        textAnchor="end"
        fill={BAD}
        style={MONO}
      >
        9%
      </text>

      <path d="M 584 376 L 596 390 L 608 376 Z" fill={t.panel} />
      <rect width="800" height="64" y="408" fill="#090b18" />
      <line
        x1="0"
        x2="800"
        y1="408"
        y2="408"
        stroke={t.accent}
        strokeOpacity="0.18"
      />
      <rect
        x="580"
        y="420"
        width="32"
        height="32"
        rx="8"
        fill={t.accent}
        fillOpacity="0.14"
      />
      {[
        { cx: 556, color: OK, value: 0.72 },
        { cx: 596, color: WARN, value: 0.18 },
        { cx: 636, color: BAD, value: 0.09 },
      ].map((item) => (
        <g key={item.cx}>
          <circle
            cx={item.cx}
            cy="436"
            r="9"
            fill="none"
            stroke={t.text}
            strokeOpacity="0.15"
            strokeWidth="3"
          />
          <circle
            {...ring(item.cx, 436, 9, item.value)}
            fill="none"
            stroke={item.color}
            strokeWidth="3"
          />
        </g>
      ))}
      <text
        x="706"
        y="441"
        fontSize="14"
        fill={t.text}
        fillOpacity="0.7"
        style={MONO}
      >
        12:48
      </text>
    </g>
  );
}

function DelExpressMotif({ t }: MotifProps) {
  const orders = [
    { id: "#1042", chip: "card", width: 120, state: "done" },
    { id: "#1043", chip: "cash", width: 138, state: "route" },
    { id: "#1044", chip: "paid", width: 104, state: "next" },
  ];
  const stops = [
    [470, 292],
    [556, 260],
    [600, 196],
    [664, 150],
  ];

  return (
    <g>
      <rect
        x="120"
        y="40"
        width="230"
        height="420"
        rx="32"
        fill={t.panel}
        stroke={t.text}
        strokeOpacity="0.14"
        strokeWidth="1.5"
      />
      <rect x="205" y="54" width="60" height="8" rx="4" fill={t.bg} />
      <text
        x="142"
        y="98"
        fontSize="12"
        fill={t.text}
        fillOpacity="0.55"
        style={MONO}
      >
        shift · 6 deliveries
      </text>
      {orders.map((order, index) => {
        const y = 112 + index * 76;
        return (
          <g key={order.id}>
            <rect
              x="140"
              y={y}
              width="190"
              height="64"
              rx="12"
              fill={t.bg}
              stroke={t.text}
              strokeOpacity="0.08"
            />
            <text x="156" y={y + 23} fontSize="13" fill={t.accent} style={MONO}>
              {order.id}
            </text>
            {order.state === "done" ? (
              <path
                d={`M 304 ${y + 18} l 5 5 l 9 -10`}
                fill="none"
                stroke={OK}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <circle
                cx="312"
                cy={y + 18}
                r="5"
                fill={order.state === "route" ? t.accent : t.text}
                fillOpacity={order.state === "route" ? 1 : 0.25}
              />
            )}
            <rect
              x="156"
              y={y + 33}
              width={order.width}
              height="7"
              rx="3.5"
              fill={t.text}
              fillOpacity="0.4"
            />
            <rect
              x="156"
              y={y + 45}
              width="40"
              height="13"
              rx="6.5"
              fill={t.accent}
              fillOpacity="0.14"
            />
            <text
              x="176"
              y={y + 54.5}
              fontSize="9.5"
              textAnchor="middle"
              fill={t.accent}
              style={MONO}
            >
              {order.chip}
            </text>
          </g>
        );
      })}
      <rect
        x="140"
        y="350"
        width="190"
        height="88"
        rx="14"
        fill={t.accent}
        fillOpacity="0.1"
        stroke={t.accent}
        strokeOpacity="0.35"
      />
      <text
        x="156"
        y="374"
        fontSize="11"
        letterSpacing="1.5"
        fill={t.accent}
        style={MONO}
      >
        SETTLEMENT
      </text>
      <text
        x="156"
        y="396"
        fontSize="12"
        fill={t.text}
        fillOpacity="0.6"
        style={MONO}
      >
        collect
      </text>
      <text
        x="156"
        y="426"
        fontSize="26"
        fontWeight="600"
        fill={OK}
        style={MONO}
      >
        $12.40
      </text>

      <rect
        x="390"
        y="60"
        width="320"
        height="380"
        rx="18"
        fill="#111b30"
        stroke={t.accent}
        strokeOpacity="0.2"
      />
      <g stroke={t.text} strokeOpacity="0.06" strokeWidth="14">
        <line x1="390" x2="710" y1="150" y2="150" />
        <line x1="390" x2="710" y1="260" y2="260" />
        <line x1="390" x2="710" y1="360" y2="360" />
        <line x1="470" x2="470" y1="60" y2="440" />
        <line x1="600" x2="600" y1="60" y2="440" />
      </g>
      <path
        d="M 440 360 L 470 360 L 470 260 L 600 260 L 600 150 L 664 150"
        fill="none"
        stroke={t.accent}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="426" y="346" width="28" height="28" rx="7" fill={t.text} />
      <rect x="426" y="346" width="28" height="9" rx="4" fill={t.accent} />
      {stops.map(([x, y], index) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="13" fill={t.accent} />
          <text
            x={x}
            y={y + 4.5}
            fontSize="13"
            fontWeight="700"
            textAnchor="middle"
            fill={t.bg}
            style={MONO}
          >
            {index + 1}
          </text>
        </g>
      ))}
      <rect
        x="410"
        y="80"
        width="138"
        height="26"
        rx="13"
        fill={t.bg}
        fillOpacity="0.85"
        stroke={t.accent}
        strokeOpacity="0.35"
      />
      <text
        x="479"
        y="97"
        fontSize="11.5"
        textAnchor="middle"
        fill={t.text}
        fillOpacity="0.85"
        style={MONO}
      >
        2-opt · 4 stops
      </text>
    </g>
  );
}

function PortfolioMotif({ t }: MotifProps) {
  const cards = [
    PROJECT_THEMES.falatrace,
    PROJECT_THEMES.quotalantern,
    PROJECT_THEMES.skills,
  ];
  return (
    <g>
      <rect
        x="100"
        y="64"
        width="600"
        height="372"
        rx="16"
        fill={t.panel}
        stroke={t.text}
        strokeOpacity="0.1"
      />
      <line
        x1="100"
        x2="700"
        y1="104"
        y2="104"
        stroke={t.text}
        strokeOpacity="0.08"
      />
      {[128, 148, 168].map((x) => (
        <circle key={x} cx={x} cy="84" r="5" fill={t.text} fillOpacity="0.18" />
      ))}
      <rect
        x="280"
        y="74"
        width="240"
        height="20"
        rx="10"
        fill={t.text}
        fillOpacity="0.06"
      />
      <text
        x="400"
        y="88"
        fontSize="11"
        textAnchor="middle"
        fill={t.text}
        fillOpacity="0.5"
        style={MONO}
      >
        caio.lombello.com
      </text>

      <rect
        x="132"
        y="128"
        width="96"
        height="16"
        rx="8"
        fill={OK}
        fillOpacity="0.15"
      />
      <circle cx="143" cy="136" r="3" fill={OK} />
      <rect
        x="132"
        y="160"
        width="250"
        height="20"
        rx="6"
        fill={t.text}
        fillOpacity="0.9"
      />
      <rect x="132" y="188" width="196" height="20" rx="6" fill={t.accent} />
      {[280, 250, 210].map((width, index) => (
        <rect
          key={width}
          x="132"
          y={226 + index * 14}
          width={width}
          height="7"
          rx="3.5"
          fill={t.text}
          fillOpacity="0.26"
        />
      ))}
      <rect x="132" y="278" width="84" height="26" rx="13" fill={t.accent} />
      <rect
        x="224"
        y="278"
        width="84"
        height="26"
        rx="13"
        fill="none"
        stroke={t.text}
        strokeOpacity="0.25"
      />

      <rect
        x="452"
        y="128"
        width="216"
        height="176"
        rx="12"
        fill="#0a0a0c"
        stroke={t.text}
        strokeOpacity="0.1"
      />
      {[0, 1, 2, 3].map((row) => (
        <g key={row}>
          <rect
            x="470"
            y={150 + row * 36}
            width="10"
            height="7"
            rx="2"
            fill={t.accent}
          />
          <rect
            x="488"
            y={150 + row * 36}
            width={[96, 60, 120, 74][row]}
            height="7"
            rx="3.5"
            fill={t.text}
            fillOpacity="0.55"
          />
          <rect
            x="488"
            y={164 + row * 36}
            width={[140, 110, 70, 128][row]}
            height="6"
            rx="3"
            fill={t.text}
            fillOpacity="0.2"
          />
        </g>
      ))}

      {cards.map((card, index) => {
        const x = 132 + index * 183.3;
        return (
          <g key={card.accent}>
            <rect
              x={x}
              y="326"
              width="169"
              height="86"
              rx="10"
              fill="#18181c"
              stroke={t.text}
              strokeOpacity="0.08"
            />
            <path
              d={`M ${x} 336 a 10 10 0 0 1 10 -10 h 149 a 10 10 0 0 1 10 10 v 34 h -169 Z`}
              fill={card.bg}
            />
            <rect
              x={x + 16}
              y="342"
              width="44"
              height="8"
              rx="4"
              fill={card.accent}
            />
            <rect
              x={x + 16}
              y="382"
              width="110"
              height="7"
              rx="3.5"
              fill={t.text}
              fillOpacity="0.5"
            />
            <rect
              x={x + 16}
              y="396"
              width="76"
              height="6"
              rx="3"
              fill={t.text}
              fillOpacity="0.2"
            />
          </g>
        );
      })}
    </g>
  );
}

const MOTIFS: Record<string, (props: MotifProps) => ReactNode> = {
  falatrace: FalaTraceMotif,
  quotalantern: QuotaLanternMotif,
  perigauge: PeriGaugeMotif,
  delexpress: DelExpressMotif,
  skills: SkillsMotif,
  "radar-de-producao": RadarMotif,
  dotfiles: DotfilesMotif,
  "portfolio-website": PortfolioMotif,
};

interface ProjectCoverProps {
  id: string;
  title: string;
  /** Distinguishes multiple covers of the same project on one page (SVG ids). */
  variant?: string;
  className?: string;
}

export function ProjectCover({
  id,
  title,
  variant = "card",
  className,
}: ProjectCoverProps) {
  const theme = projectTheme(id);
  const uid = `cover-${id}-${variant}`;
  const Motif = MOTIFS[id] ?? PortfolioMotif;

  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={title}
      className={cn("block h-full w-full", className)}
      style={{ backgroundColor: theme.bg }}
    >
      <defs>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor={theme.accent} stopOpacity="0.26" />
          <stop offset="100%" stopColor={theme.accent} stopOpacity="0" />
        </radialGradient>
        <pattern
          id={`${uid}-grid`}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke={theme.accent}
            strokeOpacity="0.07"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="800" height="500" fill={theme.bg} />
      <rect width="800" height="500" fill={`url(#${uid}-grid)`} />
      <rect width="800" height="500" fill={`url(#${uid}-glow)`} />
      <Motif t={theme} uid={uid} />
    </svg>
  );
}
