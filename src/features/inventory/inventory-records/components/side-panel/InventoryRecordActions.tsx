import { Button } from "@/components/ui";

type Props = {
  onEdit: () => void;
  onPrintQr: () => void;
  onDelete: () => void;
};

export default function InventoryRecordActions({
  onEdit,
  onPrintQr,
  onDelete,
}: Props) {
  return (
    <section className="border-b px-6 py-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Actions
      </h3>

      <div className="grid grid-cols-3 gap-2">
        <Button fullWidth onClick={onEdit}>
          Edit Record
        </Button>

        <Button variant="secondary" fullWidth onClick={onPrintQr}>
          Print QR
        </Button>

        <Button variant="danger" fullWidth onClick={onDelete}>
          Delete Record
        </Button>
      </div>
    </section>
  );
}
