"use client";

import { useMemo, useState } from "react";

const checklistGroups = [
  {
    title: "タイミング1：今すぐ練習に行くとき",
    accent: "mint",
    items: ["ゴルフグローブ（手袋）", "動きやすい普段着・スニーカー"]
  },
  {
    title: "タイミング2：コースデビュー1〜2ヶ月前",
    accent: "yellow",
    items: ["ゴルフクラブ（ハーフセットでOK）", "ゴルフシューズ（練習場で履き慣らす）", "キャディバッグ（クラブ収納用）"]
  },
  {
    title: "タイミング3：コースデビュー2週間前",
    accent: "mint",
    items: ["ゴルフウェア（襟付き・ポロシャツなどマナーに沿ったもの）"]
  },
  {
    title: "タイミング4：コースデビュー直前・前日",
    accent: "coral",
    items: ["ゴルフボール（多めに15個以上）", "ティー（ロングとショート）", "グリーンマーカー＆フォーク", "ラウンド用ミニバッグ・日焼け止め"]
  }
];

const allItems = checklistGroups.flatMap((group) => group.items);

export function BeginnerChecklist() {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const progress = useMemo(() => {
    if (!allItems.length) return 0;
    return Math.round((checkedItems.length / allItems.length) * 100);
  }, [checkedItems.length]);

  const message = progress === 100 ? "準備バッチリ！楽しんできてね！" : `準備度 ${progress}%`;

  function toggleItem(item: string) {
    setCheckedItems((current) =>
      current.includes(item) ? current.filter((checked) => checked !== item) : [...current, item]
    );
  }

  return (
    <section className="beginner-checker" aria-labelledby="beginner-checker-title">
      <div className="beginner-section-heading">
        <p>Items Checker</p>
        <h2 id="beginner-checker-title">持ち物チェッカー</h2>
        <span>必要なタイミングごとに、準備できたものをチェック。</span>
      </div>

      <div className="beginner-progress-panel" aria-live="polite">
        <div className="beginner-progress-copy">
          <strong>{message}</strong>
          <span>{checkedItems.length} / {allItems.length} アイテム完了</span>
        </div>
        <div className="beginner-progress-track" aria-label={`準備度 ${progress}%`}>
          <i style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="beginner-checker-list">
        {checklistGroups.map((group, groupIndex) => (
          <details key={group.title} className={`beginner-check-group is-${group.accent}`} open={groupIndex < 2}>
            <summary>{group.title}</summary>
            <div className="beginner-check-items">
              {group.items.map((item) => {
                const inputId = `beginner-check-${item}`;
                const isChecked = checkedItems.includes(item);
                return (
                  <label key={item} className={isChecked ? "is-checked" : ""} htmlFor={inputId}>
                    <input
                      id={inputId}
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleItem(item)}
                    />
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
