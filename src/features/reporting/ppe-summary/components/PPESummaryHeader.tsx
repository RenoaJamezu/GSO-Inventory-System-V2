type Props = {
  reportTitle: string;
  propertyType: string;
  asOf: Date;
};

export default function PPESummaryHeader({
  reportTitle,
  propertyType,
  asOf,
}: Props) {
  const formattedDate = asOf.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-1">
      {/* Green Header */}
      <div className="bg-green-600 py-1 text-center text-xs font-bold uppercase text-black text-[13px]">
        {reportTitle}
      </div>

      {/* Property Type */}
      <div className="text-center text-xs font-bold text-[13px]">
        ({propertyType})
      </div>

      {/* Date */}
      <div className="bg-green-600/20 py-1 text-center text-xs font-bold uppercase text-[13px]">
        AS OF {formattedDate}
      </div>
    </div>
  );
}
