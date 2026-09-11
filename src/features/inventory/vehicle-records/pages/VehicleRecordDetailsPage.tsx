import { useParams } from "react-router";

export default function VehicleRecordDetailsPage() {
  const { vehicleId } = useParams();

  return <div className="p-6">Vehicle ID: {vehicleId}</div>;
}
