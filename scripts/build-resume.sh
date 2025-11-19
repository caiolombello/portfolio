#!/bin/bash

# Define paths
PORTFOLIO_ROOT=$(pwd)
PUBLIC_DIR="$PORTFOLIO_ROOT/public"

# 1. Generate LaTeX and Markdown files from JSON content
echo "Generating resumes from content..."
# Using ts-node to run the script. Ensure ts-node is available or use node with loader
# Since it's a module, we might need to use node directly if compiled or ts-node with esm
if command -v npx &> /dev/null; then
    npx ts-node --esm scripts/generate-resume.ts
else
    echo "Error: npx is not available."
    exit 1
fi

# 2. Compile LaTeX to PDF

# Function to compile latex
compile_latex() {
    local work_dir=$1
    local job_name=$2
    local source_file=$3

    if command -v pdflatex &> /dev/null; then
        echo "Using local pdflatex..."
        cd "$work_dir" || exit
        pdflatex -interaction=nonstopmode -output-directory="$PUBLIC_DIR" -jobname="$job_name" "$source_file"
    elif command -v docker &> /dev/null; then
        echo "Using Docker (texlive/texlive)..."

        # Mount the public directory as both work and output, since the .tex file is there now
        docker run --rm \
            -v "$PUBLIC_DIR":/work \
            -w /work \
            texlive/texlive \
            pdflatex -interaction=nonstopmode -jobname="$job_name" "$source_file"
    else
        echo "Checking for local TinyTeX..."
        # Try to install/use local TinyTeX
        export PATH="$(pwd)/.latex/bin/x86_64-linux:$PATH"

        if ! command -v pdflatex &> /dev/null; then
             echo "pdflatex not found. Attempting to install TinyTeX..."
             ./scripts/install-latex.sh
             export PATH="$(pwd)/.latex/bin/x86_64-linux:$PATH"
        fi

        if command -v pdflatex &> /dev/null; then
            echo "Using local TinyTeX..."
            cd "$work_dir" || exit
            pdflatex -interaction=nonstopmode -output-directory="$PUBLIC_DIR" -jobname="$job_name" "$source_file"
        else
            echo "Warning: Could not install/find pdflatex. Skipping PDF generation."
            echo "Only Markdown files will be updated."
            return 0
        fi
    fi
}

echo "Building English Resume..."
# The .tex file is now in public/resume.tex
compile_latex "$PUBLIC_DIR" "resume" "resume.tex"

echo "Building Portuguese Resume..."
# The .tex file is now in public/curriculo.tex
compile_latex "$PUBLIC_DIR" "curriculo" "curriculo.tex"

# Cleanup auxiliary files in public dir
cd "$PUBLIC_DIR" || exit
rm -f resume.aux resume.log resume.out curriculo.aux curriculo.log curriculo.out

echo "Done! PDFs and Markdown generated in $PUBLIC_DIR"
