#!/bin/bash

# Directory for local latex installation
LATEX_DIR="$(pwd)/.latex"
BIN_DIR="$LATEX_DIR/bin/x86_64-linux"

# Check if already installed
if [ -f "$BIN_DIR/pdflatex" ]; then
    echo "TinyTeX already installed in $LATEX_DIR"
    export PATH="$BIN_DIR:$PATH"
    return 0 2>/dev/null || exit 0
fi

echo "Installing TinyTeX to $LATEX_DIR..."

# Download and install TinyTeX directly (avoiding installer script that needs wget)
mkdir -p "$LATEX_DIR"
TINYTEX_URL="https://github.com/rstudio/tinytex-releases/releases/download/daily/TinyTeX-1.tgz"

echo "Downloading TinyTeX from $TINYTEX_URL..."
curl -L "$TINYTEX_URL" | tar xz -C "$LATEX_DIR" --strip-components=1

# Add to PATH temporarily for tlmgr
export PATH="$BIN_DIR:$PATH"

# Install required packages
echo "Installing LaTeX packages..."
tlmgr install latex-bin tools geometry hyperref titlesec babel babel-english babel-portuguese parskip graphics oberdiek etoolbox cm-super

echo "TinyTeX installation complete."
