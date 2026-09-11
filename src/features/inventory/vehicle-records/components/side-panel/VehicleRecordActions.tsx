import { Button } from "@/components/ui";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function VehicleRecordActions({ onEdit, onDelete }: Props) {
  return (
    <section className="border-b px-6 py-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Actions
      </h3>

      <div className="grid grid-cols-2 gap-2">
        <Button onClick={onEdit}>Edit Vehicle</Button>

        <Button variant="danger" onClick={onDelete}>
          Delete Vehicle
        </Button>
      </div>
    </section>
  );
}
