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
      <div className="py-10 text-center text-sm text-gray-500">
        No stock cards found.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {stockCards.map((stockCard) => {
        const selected = selectedId === stockCard.id;

        return (
          <button
            key={stockCard.id}
            type="button"
            onClick={() => onSelect(stockCard)}
            className={[
              "w-full px-4 py-3 text-left transition-colors",
              selected ? "bg-emerald-50" : "hover:bg-gray-50",
            ].join(" ")}
          >
            <div className="font-medium text-gray-900 capitalize">{stockCard.item}</div>

            <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-gray-500">
              <span>Stock No: {stockCard.stock_no}</span>

              <span>Unit: {stockCard.unit_of_measurement}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
