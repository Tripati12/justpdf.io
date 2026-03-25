"useclient";

export default function FileList({
  files,
  onRemove,
}: {
  files: File[];
  onRemove: (index: number) => void;
}) {
  return (
    <div className="mt-4 space-y-2">
      {files.map((file, i) => (
        <div
          key={i}
          className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-2"
        >
          <span className="text-gray-800 text-sm truncate">
            {file.name}
          </span>
          <button
            onClick={() => onRemove(i)}
            className="text-red-500 text-sm hover:underline"
          >
            Remove
          </button>
        </div>
      ))}

      <p className="text-center text-sm text-gray-500">
        {files.length} file{files.length > 1 ? "s" : ""} selected
      </p>
    </div>
  );
}
