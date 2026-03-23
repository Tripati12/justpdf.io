export default function FileDropzone({
  multiple,
  accept,
  onSelect,
}: {
  multiple?: boolean;
  accept: string;
  onSelect: (files: FileList | null) => void;
}) {
  return (
    <label className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition">
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => onSelect(e.target.files)}
      />
      <p className="text-gray-700">
        Drag & drop files here
      </p>
      <p className="text-gray-500 text-sm">
        or click to select files
      </p>
    </label>
  );
}
