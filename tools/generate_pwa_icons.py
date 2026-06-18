from pathlib import Path
import sys

from PIL import Image, ImageDraw, ImageFilter


SIZES = {
    "icon-1024.png": 1024,
    "icon-512.png": 512,
    "icon-256.png": 256,
    "icon-192.png": 192,
    "apple-touch-icon-180.png": 180,
    "icon-152.png": 152,
    "icon-144.png": 144,
    "icon-128.png": 128,
    "favicon-64.png": 64,
    "favicon-32.png": 32,
}


def prepare_master(source_path: Path) -> Image.Image:
    image = Image.open(source_path).convert("RGB")

    # The supplied artwork includes black pixels outside its rounded white frame.
    # Flood-filling from each corner preserves all interior shadows and lettering.
    for corner in (
        (0, 0),
        (image.width - 1, 0),
        (0, image.height - 1),
        (image.width - 1, image.height - 1),
    ):
        ImageDraw.floodfill(image, corner, (255, 255, 255), thresh=42)

    return image.resize((1024, 1024), Image.Resampling.LANCZOS)


def resize_icon(master: Image.Image, size: int) -> Image.Image:
    icon = master.resize((size, size), Image.Resampling.LANCZOS)
    if size <= 256:
        radius = 0.7 if size >= 128 else 0.5
        percent = 135 if size >= 128 else 125
        icon = icon.filter(ImageFilter.UnsharpMask(radius=radius, percent=percent, threshold=3))
    return icon.convert("RGB")


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("Usage: generate_pwa_icons.py SOURCE_PNG OUTPUT_DIR")

    source_path = Path(sys.argv[1])
    output_dir = Path(sys.argv[2])
    output_dir.mkdir(parents=True, exist_ok=True)

    master = prepare_master(source_path)
    for filename, size in SIZES.items():
        resize_icon(master, size).save(
            output_dir / filename,
            format="PNG",
            optimize=True,
            compress_level=9,
        )


if __name__ == "__main__":
    main()
