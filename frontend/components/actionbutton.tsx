"use client";

type ActionButtonProps = {
  label: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export default function ActionButton({
  label,
  onClick,
  loading = false,
  disabled = false,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full mt-4 py-3 rounded-lg text-white font-medium transition-all duration-200
        ${
          disabled || loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
    >
      {label}
    </button>
  );
}
