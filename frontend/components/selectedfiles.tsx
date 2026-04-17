"use client";

export default function SelectedFiles({
  files,
  onRemove,
}: {
  files: File[];
  onRemove?: (index: number) => void;
}) {
  if (!files.length) return null;

  return (
    <div className="mt-4 space-y-2">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg"
        >
          <span className="text-gray-700 text-sm truncate">
            {file.name}
          </span>

          {onRemove && (
            <button
              onClick={() => onRemove(index)}
              className="text-red-500 text-sm hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
}