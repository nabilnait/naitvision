#!/usr/bin/env bash
# Turns every video in raw/ into a web loop + poster in public/media/.
#   - 8 seconds (or shorter if the clip is shorter), starting at START seconds
#   - no audio, max 720 px on the short side (9:16 -> 720x1280)
#   - H.264 MP4 (faststart) + VP9 WebM + first-frame poster as WebP and AVIF
# Usage:
#   scripts/compress-videos.sh                 # all files in raw/
#   scripts/compress-videos.sh raw/clip.mp4    # one file
#   START=12 DURATION=6 scripts/compress-videos.sh raw/clip.mp4
# Output name = file name in lowercase with spaces as dashes, e.g. "Wellness Final.MP4" -> wellness-final.mp4
# Needs ffmpeg (brew install ffmpeg).
set -euo pipefail

command -v ffmpeg >/dev/null || { echo "ffmpeg is not installed. Run: brew install ffmpeg"; exit 1; }

OUT="public/media"
START="${START:-0}"
DURATION="${DURATION:-8}"
CRF="${CRF:-26}"
mkdir -p "$OUT"

files=("$@")
if [ ${#files[@]} -eq 0 ]; then
  shopt -s nullglob nocaseglob
  files=(raw/*.mp4 raw/*.mov raw/*.m4v raw/*.mkv)
fi
[ ${#files[@]} -eq 0 ] && { echo "No videos found in raw/"; exit 0; }

for src in "${files[@]}"; do
  base="$(basename "${src%.*}" | tr '[:upper:]' '[:lower:]' | tr ' _' '--' | tr -cd 'a-z0-9-')"
  echo "-> $src  =>  $OUT/$base.{mp4,webm,webp}"
  # scale so the short side is at most 720 px, keep even dimensions
  vf="scale='if(gt(iw,ih),-2,min(720,iw))':'if(gt(iw,ih),min(720,ih),-2)',fps=30"

  ffmpeg -hide_banner -loglevel error -y -ss "$START" -t "$DURATION" -i "$src" \
    -an -vf "$vf" -c:v libx264 -preset veryfast -crf "$CRF" -profile:v high -pix_fmt yuv420p \
    -movflags +faststart "$OUT/$base.mp4"

  ffmpeg -hide_banner -loglevel error -y -ss "$START" -t "$DURATION" -i "$src" \
    -an -vf "$vf" -c:v libvpx-vp9 -b:v 0 -crf $((CRF + 8)) -row-mt 1 -deadline good -cpu-used 4 \
    "$OUT/$base.webm"

  # poster = the exact first frame of the loop, written as WebP + AVIF by scripts/posters.mjs
  frame="$(mktemp -t poster).png"
  ffmpeg -hide_banner -loglevel error -y -ss "$START" -i "$src" -frames:v 1 -vf "$vf" "$frame"
  node scripts/posters.mjs "$frame" "$OUT/$base"
  rm -f "$frame"

  size=$(du -k "$OUT/$base.mp4" | cut -f1)
  [ "$size" -gt 3072 ] && echo "   note: $base.mp4 is ${size} KB (target < 3 MB). Try CRF=28 or a shorter DURATION."
done
echo "Done. Add the clips in src/content/site.ts as media: '/media/<name>' (and webm: true)."
