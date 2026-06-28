import csv
from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path("/Users/miyaguniyuichiro/Downloads/2026_okinawa_golf_integrated_schedule.xlsx")
OUTPUT = ROOT / "_data/imports/tournaments-import-microcms.csv"


def clean(value):
    return "" if pd.isna(value) else str(value).strip()


def normalize_category(value):
    text = clean(value)
    if "ジュニア" in text or "学生" in text:
        return "ジュニア"
    if "シニア" in text or "マスター" in text:
        return "シニア"
    if "レディ" in text or "女子" in text or "女性" in text:
        return "女性"
    if "プロ" in text:
        return "プロ"
    return "一般"


def normalize_status(value):
    text = clean(value)
    if text in ["予定", "開催予定"]:
        return "開催予定"
    if text in ["成績あり", "募集中", "確認中", "draft", "archived"]:
        return text
    return "確認中"


def normalize_number(value, default):
    try:
        return int(float(value))
    except Exception:
        return default


def content_id(index):
    return f"tournament-2026-{index + 1:03d}"


def main():
    df = pd.read_excel(SOURCE, sheet_name=0, header=2)
    rows = []

    for _, row in df.iterrows():
        title = clean(row.get("大会名"))
        if not title:
            continue

        date_label = clean(row.get("開催日"))
        venue = clean(row.get("会場"))
        display_order = normalize_number(row.get("成績URL"), (len(rows) + 1) * 10)
        tags = clean(row.get("表示順")) or clean(row.get("検索キーワード"))

        rows.append(
            {
                "id": content_id(len(rows)),
                "title": title,
                "month": clean(row.get("開催月")),
                "dateLabel": date_label,
                "venue": venue,
                "area": clean(row.get("地域")),
                "category": normalize_category(row.get("種別")),
                "status": normalize_status(row.get("ステータス")),
                "description": f"{date_label}、{venue}で開催予定の大会情報です。公式情報、概要、成績表への導線を確認できます。",
                "entryUrl": "",
                "overviewUrl": clean(row.get("大会概要URL")),
                "resultUrl": "",
                "officialUrl": clean(row.get("公式URL")),
                "displayOrder": display_order,
                "tags": tags,
            }
        )

    fields = [
        "id",
        "title",
        "month",
        "dateLabel",
        "venue",
        "area",
        "category",
        "status",
        "description",
        "entryUrl",
        "overviewUrl",
        "resultUrl",
        "officialUrl",
        "displayOrder",
        "tags",
    ]

    with OUTPUT.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)

    print(OUTPUT)
    print(f"rows={len(rows)}")
    print(pd.DataFrame(rows).head(8).to_string())


if __name__ == "__main__":
    main()
