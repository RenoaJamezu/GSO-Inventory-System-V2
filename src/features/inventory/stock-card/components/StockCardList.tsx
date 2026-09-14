import type { StockCard } from "../types";

type Props = {
  stockCards: StockCard[];
  selectedId: number | null;

  onSelect: (stockCard: StockCard) => void;
};

export default function StockCardList({
  stockCards,
  selectedId,
  onSelect,
}: Props) {
  if (stockCards.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          No stock items found
        </p>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Try a different search or create a new stock item.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {stockCards.map((stockCard) => {
        const selected = selectedId === stockCard.id;

        return (
          <button
            key={stockCard.id}
            type="button"
            onClick={() => onSelect(stockCard)}
            className={[
              "relative w-full",
              "px-4 py-3.5",
              "text-left",
              "transition-colors",

              selected
                ? ["bg-emerald-50", "dark:bg-emerald-950/30"].join(" ")
                : [
                    "bg-white",
                    "hover:bg-slate-50",
                    "dark:bg-slate-900",
                    "dark:hover:bg-slate-800/50",
                  ].join(" "),
            ].join(" ")}
          >
            {selected && (
              <span
                className="
                    absolute
                    inset-y-0 left-0
                    w-0.5
                    bg-emerald-600
                    dark:bg-emerald-500
                  "
              />
            )}

            <div className="pr-2">
              <p
                className={[
                  "truncate text-sm font-medium",

                  selected
                    ? "text-emerald-800 dark:text-emerald-300"
                    : "text-slate-900 dark:text-slate-100",
                ].join(" ")}
              >
                {stockCard.item}
              </p>

              <div className="mt-1.5 space-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                <p>
                  Stock No.{" "}
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {stockCard.stock_no}
                  </span>
                </p>

                <p>
                  Unit{" "}
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {stockCard.unit_of_measurement}
                  </span>
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
