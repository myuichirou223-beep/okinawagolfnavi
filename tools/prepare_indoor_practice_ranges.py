import csv
from pathlib import Path


SRC = Path("/Users/miyaguniyuichiro/Downloads/okinawa_indoor_golf_ranges.csv")
DST = Path("_data/imports/practice-ranges-indoor-import-microcms.csv")

FIELDNAMES = [
    "id",
    "name",
    "category",
    "area",
    "address",
    "phone",
    "url",
    "accessFromNaha",
    "status",
]


def normalize_row(row):
    normalized = {key: (row.get(key, "") or "").strip() for key in FIELDNAMES if key != "status"}
    if normalized["area"].startswith("離島"):
        normalized["area"] = "離島"
    if normalized["phone"] == "記載なし":
        normalized["phone"] = ""
    normalized["accessFromNaha"] = normalized["accessFromNaha"].lstrip("※").strip()
    normalized["status"] = "営業確認済み"
    return normalized


def main():
    with SRC.open(encoding="utf-8-sig", newline="") as source:
        rows = [normalize_row(row) for row in csv.DictReader(source)]

    with DST.open("w", encoding="utf-8-sig", newline="") as target:
        writer = csv.DictWriter(target, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(rows)

    print(f"{DST} {len(rows)}")


if __name__ == "__main__":
    main()
