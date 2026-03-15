
export default function ProductSpecifications({
  material,
  dimensions
}: {
  material: string;
  dimensions: string;
}) {
  return (
    <div className="border-t border-b border-gray-200 py-6 space-y-3">
      <div className="flex justify-between text-base">
        <span className="text-gray-600 font-medium">Material:</span>
        <span className="text-gray-900 font-semibold">{material}</span>
      </div>
      <div className="flex justify-between text-base">
        <span className="text-gray-600 font-medium">Dimensions:</span>
        <span className="text-gray-900 font-semibold">{dimensions}</span>
      </div>
    </div>
  );
}