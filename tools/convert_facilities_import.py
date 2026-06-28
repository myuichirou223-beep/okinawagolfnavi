#!/usr/bin/env python3
import csv
import hashlib
import re
import unicodedata
from pathlib import Path
from typing import Optional


ROOT = Path(__file__).resolve().parents[1]
COURSES_CSV = ROOT / "_data/imports/courses-import-microcms.csv"
PRACTICE_RANGES_CSV = ROOT / "_data/imports/practice-ranges-all-import-microcms.csv"
OUTPUT_CSV = ROOT / "microcms/imports/facilities-import.csv"

FACILITY_FIELDS = [
    "name",
    "slug",
    "type",
    "status",
    "area",
    "address",
    "phone",
    "website",
    "summary",
    "airportAccess",
    "gallery",
    "city",
    "facilityType",
    "holes",
    "par",
    "reservationUrl",
    "features",
]


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as file:
        return list(csv.DictReader(file))


def clean(value: Optional[str]) -> str:
    return (value or "").strip()


def slug_from_name(name: str, used_slugs: set[str]) -> str:
    normalized = unicodedata.normalize("NFKC", name).lower()
    slug = re.sub(r"[^a-z0-9]+", "-", normalized).strip("-")
    if not slug:
        digest = hashlib.sha1(name.encode("utf-8")).hexdigest()[:10]
        slug = f"facility-{digest}"

    base = slug
    suffix = 2
    while slug in used_slugs:
        slug = f"{base}-{suffix}"
        suffix += 1

    used_slugs.add(slug)
    return slug


def practice_type(category: str) -> str:
    if category in {"屋内", "インドア"}:
        return "indoor_practice_range"
    return "outdoor_practice_range"


def course_to_facility(row: dict[str, str], used_slugs: set[str]) -> dict[str, str]:
    slug = clean(row.get("slug"))
    used_slugs.add(slug)

    return {
        "name": clean(row.get("title")),
        "slug": slug,
        "type": "golf_course",
        "status": clean(row.get("status")),
        "area": clean(row.get("area")),
        "address": clean(row.get("address")),
        "phone": clean(row.get("phone")),
        "website": clean(row.get("websiteUrl")),
        "summary": clean(row.get("summary")),
        "airportAccess": clean(row.get("airportAccess")),
        "gallery": "",
        "city": clean(row.get("city")),
        "facilityType": clean(row.get("courseType")),
        "holes": clean(row.get("holes")),
        "par": clean(row.get("par")),
        "reservationUrl": clean(row.get("reservationUrl")),
        "features": clean(row.get("features")),
    }


def practice_range_to_facility(row: dict[str, str], used_slugs: set[str]) -> dict[str, str]:
    name = clean(row.get("name"))
    category = clean(row.get("category"))

    return {
        "name": name,
        "slug": slug_from_name(name, used_slugs),
        "type": practice_type(category),
        "status": clean(row.get("status")),
        "area": clean(row.get("area")),
        "address": clean(row.get("address")),
        "phone": clean(row.get("phone")),
        "website": clean(row.get("url")),
        "summary": "",
        "airportAccess": clean(row.get("accessFromNaha")),
        "gallery": "",
        "city": "",
        "facilityType": category,
        "holes": "",
        "par": "",
        "reservationUrl": "",
        "features": "",
    }


def main() -> None:
    used_slugs: set[str] = set()
    facilities: list[dict[str, str]] = []

    for row in read_csv(COURSES_CSV):
        facilities.append(course_to_facility(row, used_slugs))

    for row in read_csv(PRACTICE_RANGES_CSV):
        facilities.append(practice_range_to_facility(row, used_slugs))

    OUTPUT_CSV.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_CSV.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=FACILITY_FIELDS)
        writer.writeheader()
        writer.writerows(facilities)

    print(f"courses: {len(read_csv(COURSES_CSV))}")
    print(f"practice_ranges: {len(read_csv(PRACTICE_RANGES_CSV))}")
    print(f"facilities: {len(facilities)}")
    print(f"output: {OUTPUT_CSV}")


if __name__ == "__main__":
    main()
