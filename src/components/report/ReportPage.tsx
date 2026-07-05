type Props = {
  children: React.ReactNode;
};

export default function ReportPage({ children }: Props) {
  return (
    <div
      className="mx-auto bg-white shadow"
      style={{
        width: "8.5in",
        minHeight: "13in",
        padding: "0.5in",
      }}
    >
      {children}
    </div>
  );
}
