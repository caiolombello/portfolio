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

# Download and install TinyTeX
mkdir -p "$LATEX_DIR"
curl -L https://yihui.org/tinytex/install-bin-unix.sh | sh -s "$LATEX_DIR"

# Add to PATH temporarily for tlmgr
export PATH="$BIN_DIR:$PATH"

# Install required packages
echo "Installing LaTeX packages..."
tlmgr install latex-bin tools geometry hyperref titlesec babel babel-english babel-portuguese parskip graphics oberdiek etoolbox cm-super

echo "TinyTeX installation complete."
