import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@/components/dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function PPESummaryDialog({ open, onClose }: Props) {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [asOfDate, setAsOfDate] = useState(today);

  function handleGenerate() {
    navigate(`/reports/ppe-summary?date=${asOfDate}`);

    onClose();
  }

  return (
    <Dialog open={open}>
      <DialogHeader title="Generate PPE Summary" />

      <DialogBody>
        <div className="space-y-2">
          <label className="block text-sm font-medium">As Of Date</label>

          <input
            type="date"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
      </DialogBody>

      <DialogFooter>
        <button onClick={onClose} className="rounded border px-4 py-2">
          Cancel
        </button>

        <button
          onClick={handleGenerate}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Generate
        </button>
      </DialogFooter>
    </Dialog>
  );
}
