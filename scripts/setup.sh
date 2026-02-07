#!/usr/bin/env bash
#
# Interactive setup script for the Portfolio Template.
# Run with: npm run setup  (or bash scripts/setup.sh)
#

set -euo pipefail

BOLD='\033[1m'
GOLD='\033[33m'
GREEN='\033[32m'
CYAN='\033[36m'
RESET='\033[0m'

echo -e "${GOLD}${BOLD}"
echo "  ╔═══════════════════════════════════════╗"
echo "  ║     Portfolio Template Setup           ║"
echo "  ╚═══════════════════════════════════════╝"
echo -e "${RESET}"

# ─── Gather info ──────────────────────────────────────────

read -rp "$(echo -e ${CYAN}Your full name:${RESET} )" FULL_NAME
read -rp "$(echo -e ${CYAN}Your short name \(e.g. first + last\):${RESET} )" SHORT_NAME
read -rp "$(echo -e ${CYAN}Your professional title \(e.g. Full-Stack Developer\):${RESET} )" JOB_TITLE
read -rp "$(echo -e ${CYAN}Your email:${RESET} )" EMAIL
read -rp "$(echo -e ${CYAN}Your phone \(with country code, e.g. +1 555 123-4567\):${RESET} )" PHONE
read -rp "$(echo -e ${CYAN}Your location \(e.g. San Francisco, CA, USA\):${RESET} )" LOCATION
read -rp "$(echo -e ${CYAN}Your site URL \(e.g. https://yoursite.com\):${RESET} )" SITE_URL
read -rp "$(echo -e ${CYAN}Your GitHub username:${RESET} )" GITHUB_USER
read -rp "$(echo -e ${CYAN}Your LinkedIn profile slug \(e.g. johndoe\):${RESET} )" LINKEDIN_SLUG
read -rp "$(echo -e ${CYAN}Your Twitter/X username \(without @\):${RESET} )" TWITTER_USER

# Optional
read -rp "$(echo -e ${CYAN}Your Credly username \(leave empty to skip\):${RESET} )" CREDLY_USER
CREDLY_USER=${CREDLY_USER:-""}

echo ""

# ─── Derive values ────────────────────────────────────────

PORTFOLIO_NAME="${SHORT_NAME} Portfolio"
SITE_TITLE="${SHORT_NAME} - ${JOB_TITLE}"
SITE_DESC="Professional portfolio and blog of ${SHORT_NAME}, ${JOB_TITLE}"
GITHUB_URL="https://github.com/${GITHUB_USER}"
LINKEDIN_URL="https://linkedin.com/in/${LINKEDIN_SLUG}"
TWITTER_URL="https://twitter.com/${TWITTER_USER}"
WHATSAPP_NUM=$(echo "$PHONE" | tr -dc '0-9')

# ─── Generate config/site.json ────────────────────────────

CONFIG_FILE="config/site.json"

cat > "$CONFIG_FILE" << SITEEOF
{
  "site": {
    "name": "${PORTFOLIO_NAME}",
    "title": "${SITE_TITLE}",
    "shortName": "${SHORT_NAME}",
    "description": "${SITE_DESC}",
    "url": "${SITE_URL}",
    "author": "${FULL_NAME}",
    "email": "${EMAIL}",
    "phone": "${PHONE}",
    "location": "${LOCATION}",
    "profileImage": {
      "type": "github",
      "source": "${GITHUB_USER}",
      "fallbacks": [
        {
          "type": "local",
          "source": "/images/profile/profile.jpg"
        }
      ]
    }
  },
  "social": {
    "github": "${GITHUB_URL}",
    "linkedin": "${LINKEDIN_URL}",
    "twitter": "${TWITTER_URL}",
    "website": "${SITE_URL}"
  },
  "integrations": {
    "credlyUsername": "${CREDLY_USER}",
    "twitterHandle": "@${TWITTER_USER}"
  },
  "seo": {
    "keywords": [
      "${JOB_TITLE}",
      "${SHORT_NAME}",
      "portfolio",
      "blog"
    ]
  }
}
SITEEOF

echo -e "${GREEN}Created ${CONFIG_FILE}${RESET}"

# ─── Generate content/profile/profile.json ────────────────

PROFILE_FILE="content/profile/profile.json"

cat > "$PROFILE_FILE" << PROFEOF
{
  "pt": {
    "name": "${FULL_NAME}",
    "title": "${JOB_TITLE}",
    "location": "${LOCATION}",
    "about": "Adicione aqui uma breve descrição sobre você em português."
  },
  "en": {
    "name": "${FULL_NAME}",
    "title": "${JOB_TITLE}",
    "location": "${LOCATION}",
    "about": "Add here a brief description about yourself in English."
  },
  "email": "${EMAIL}",
  "phone": "${PHONE}",
  "socialLinks": {
    "linkedin": "${LINKEDIN_URL}",
    "github": "${GITHUB_URL}",
    "twitter": "${TWITTER_URL}",
    "website": "${SITE_URL}",
    "whatsapp": "https://wa.me/${WHATSAPP_NUM}"
  }
}
PROFEOF

echo -e "${GREEN}Created ${PROFILE_FILE}${RESET}"

# ─── Clean example content ────────────────────────────────

echo ""
read -rp "$(echo -e ${CYAN}Remove example content \(experience, projects, posts\)? [y/N]:${RESET} )" CLEAN_CONTENT

if [[ "${CLEAN_CONTENT,,}" == "y" ]]; then
  rm -f content/experience/*.json 2>/dev/null || true
  rm -f content/education/*.json 2>/dev/null || true
  rm -f content/projects/*.json 2>/dev/null || true
  rm -f content/posts/*.md 2>/dev/null || true
  rm -f content/testimonials.json 2>/dev/null || true

  # Create empty skills file
  cat > "content/skills/skills.json" << 'SKILLEOF'
[]
SKILLEOF

  echo -e "${GREEN}Example content removed. Add your own files to content/*${RESET}"
else
  echo -e "${GOLD}Keeping example content. Remember to replace it with your own!${RESET}"
fi

# ─── Summary ──────────────────────────────────────────────

echo ""
echo -e "${GOLD}${BOLD}Setup complete!${RESET}"
echo ""
echo "Next steps:"
echo "  1. Edit content/profile/profile.json with your full bio"
echo "  2. Add your experience to content/experience/"
echo "  3. Add your projects to content/projects/"
echo "  4. Add your education to content/education/"
echo "  5. (Optional) Add blog posts to content/posts/"
echo "  6. Run: npm install && npm run dev"
echo ""
echo "See CONFIG.md for detailed configuration options."
