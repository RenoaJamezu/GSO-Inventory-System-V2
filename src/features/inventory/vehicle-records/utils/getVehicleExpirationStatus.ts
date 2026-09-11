export type VehicleExpirationStatus =
  | "EXPIRED"
  | "EXPIRING_SOON"
  | "VALID"
  | "NOT_SPECIFIED";

export function getVehicleExpirationStatus(
  expirationDate: string | null,
): VehicleExpirationStatus {
  if (!expirationDate) {
    return "NOT_SPECIFIED";
  }

  const expiration = new Date(`${expirationDate}T00:00:00`);

  if (Number.isNaN(expiration.getTime())) {
    return "NOT_SPECIFIED";
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (expiration < today) {
    return "EXPIRED";
  }

  const thirtyDaysFromNow = new Date(today);

  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  if (expiration <= thirtyDaysFromNow) {
    return "EXPIRING_SOON";
  }

  return "VALID";
}

export function getVehicleExpirationStatusLabel(
  status: VehicleExpirationStatus,
) {
  switch (status) {
    case "EXPIRED":
      return "Expired";

    case "EXPIRING_SOON":
      return "Expiring Soon";

    case "VALID":
      return "Valid";

    case "NOT_SPECIFIED":
    default:
      return "Not Specified";
  }
}
