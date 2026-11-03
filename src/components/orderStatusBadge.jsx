const colors = {
  pending: "bg-amber-100 text-amber-900",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-teal-100 text-teal-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  returned: "bg-orange-100 text-orange-800",
};

export default function OrderStatusBadge({ status }) {
  const label = status?.trim().toLowerCase() || "unknown";
  const color = colors[label] || "bg-gray-100 text-gray-700";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${color}`}>
      {label}
    </span>
  );
}
