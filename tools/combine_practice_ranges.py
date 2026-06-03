from pathlib import Path


OUTPUT = Path("_data/imports/practice-ranges-all-import-microcms.csv")
INPUTS = [
    Path("_data/imports/practice-ranges-import-microcms.csv"),
    Path("_data/imports/practice-ranges-indoor-import-microcms.csv"),
]


def main():
    with OUTPUT.open("w", encoding="utf-8-sig", newline="") as target:
        wrote_header = False
        for path in INPUTS:
            lines = path.read_text(encoding="utf-8-sig").splitlines()
            if not lines:
                continue
            if not wrote_header:
                target.write(f"{lines[0]}\n")
                wrote_header = True
            for line in lines[1:]:
                if line.strip():
                    target.write(f"{line}\n")
    print(OUTPUT)


if __name__ == "__main__":
    main()
