import { FormInput } from "@/components/form";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export default function InventoryRecordHeaderRowSelector({
  value,
  onChange,
}: Props) {
  return (
    <div className="max-w-48">
      <FormInput
        type="number"
        min={1}
        step={1}
        value={value}
        onChange={(event) => {
          const nextValue = Number(event.target.value);

          if (Number.isInteger(nextValue) && nextValue >= 1) {
            onChange(nextValue);
          }
        }}
      />
    </div>
  );
}
