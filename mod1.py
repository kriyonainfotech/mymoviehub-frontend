import os

file_path = "src/components/MovieModal.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# 1. Add imageLoading state (around line 10)
for i, line in enumerate(lines):
    if "const [isAnimating, setIsAnimating] = useState(false);" in line:
        lines.insert(i + 1, "  const [imageLoading, setImageLoading] = useState(true);\n")
        break

# 2. Add setImageLoading to initialMovie effect
for i, line in enumerate(lines):
    if "setSelectedSeasonIndex(0);" in line:
        if "setCurrentMovie(initialMovie);" in lines[i-1]:
            lines.insert(i + 1, "    setImageLoading(true);\n")
            break

# 3. Add setImageLoading to handleMovieChange
for i, line in enumerate(lines):
    if "const handleMovieChange = (newMovie) => {" in line:
        # insert after setTimeout
        for j in range(i, i+10):
            if "setTimeout(() => {" in lines[j]:
                lines.insert(j + 1, "      setImageLoading(true);\n")
                break
        break

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(lines)
