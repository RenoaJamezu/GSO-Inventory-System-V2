import { Button } from "@/components/ui";

type Props = {
  onEdit: () => void;
  onPrintQr: () => void;
  onPublicView: () => void;
  onDelete: () => void;
};

export default function InventoryRecordActions({
  onEdit,
  onPrintQr,
  onPublicView,
  onDelete,
}: Props) {
  return (
    <section className="border-b px-6 py-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Actions
      </h3>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={onPrintQr}>
          Print QR
        </Button>

        <Button variant="secondary" onClick={onPublicView}>
          Public View
        </Button>
        
        <Button onClick={onEdit}>Edit Record</Button>

        <Button variant="danger" onClick={onDelete}>
          Delete Record
        </Button>
      </div>
    </section>
  );
}
