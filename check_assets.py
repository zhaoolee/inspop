#!/usr/bin/env python3
"""Check inspop quote assets against the files the app and README actually use.

Fails when a CSV wallpaper or GIF is missing from disk, missing from the
generated index, or not a decodable image. Legacy mp3/mp4 names may be absent
from a checkout because those extensions are gitignored; a folder that already
contains any mp3 or mp4 must contain the indexed audio and video files too.
"""

import csv
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PUBLIC = ROOT / "next-inspop" / "public"
PROD_WALL = "https://inspop.fangyuanxiaozhan.com/wallpapers/"
PROD_AV = "https://inspop.fangyuanxiaozhan.com/av/"


def decode_image(path):
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=codec_name,width,height",
            "-of",
            "csv=p=0",
            str(path),
        ],
        capture_output=True,
        text=True,
    )
    info = result.stdout.strip()
    if result.returncode != 0 or not info or info.startswith(","):
        return None
    return info


def main():
    csv_path = PUBLIC / "inspop-data.csv"
    walls = json.loads((PUBLIC / "wallpapers-info.json").read_text(encoding="utf-8"))
    av = json.loads((PUBLIC / "av-info.json").read_text(encoding="utf-8"))
    with csv_path.open(encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))

    errors = []
    checked_images = 0

    def fail(line_id, message):
        errors.append(f"line {line_id}: {message}")

    for row in rows:
        line_id = (row.get("line_id") or "").strip() or "?"
        wall_dir = (row.get("wallpapers_dir") or "").strip()
        av_dir = (row.get("av_dir") or "").strip()
        if not wall_dir:
            fail(line_id, "missing wallpapers_dir")
            continue
        names = walls.get(wall_dir)
        if not names:
            fail(line_id, f"wallpapers_dir not indexed or empty: {wall_dir}")
            continue
        folder = PUBLIC / "wallpapers" / wall_dir
        for name in names:
            path = folder / name
            if not path.is_file():
                fail(line_id, f"wallpaper missing: {path.relative_to(ROOT)}")
                continue
            info = decode_image(path)
            checked_images += 1
            if not info:
                fail(line_id, f"wallpaper does not decode: {path.name}")
        if av_dir:
            info = av.get(av_dir)
            if not info:
                fail(line_id, f"av_dir not in av-info.json: {av_dir}")
                continue
            for key in ("gif", "audio", "video"):
                if not info.get(key):
                    fail(line_id, f"av-info missing {key}")
            gif_name = info.get("gif")
            if gif_name:
                gif_path = PUBLIC / "av" / av_dir / gif_name
                if not gif_path.is_file():
                    fail(line_id, f"gif missing: {gif_path.relative_to(ROOT)}")
                else:
                    gif_info = decode_image(gif_path)
                    checked_images += 1
                    if not gif_info or not gif_info.startswith("gif"):
                        fail(line_id, f"gif does not decode: {gif_name}")
            av_folder = PUBLIC / "av" / av_dir
            has_local_av = av_folder.is_dir() and any(
                p.suffix.lower() in {".mp3", ".mp4"} for p in av_folder.iterdir()
            )
            if has_local_av:
                for key, suffix in (("audio", ".mp3"), ("video", ".mp4")):
                    name = info.get(key) or ""
                    path = av_folder / name
                    if not name or path.suffix.lower() != suffix or not path.is_file():
                        fail(line_id, f"{key} file missing in {av_dir}")

    print(f"rows={len(rows)} decoded_images={checked_images} errors={len(errors)}")
    for message in errors:
        print(message)
    if errors:
        print(
            "App production wallpaper URL is "
            + PROD_WALL
            + "{wallpapers_dir}/{filename}. README previews use "
            + PROD_AV
            + "{av_dir}/{file}."
        )
        return 1
    print("asset index matches decodable files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
