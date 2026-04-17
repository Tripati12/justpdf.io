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
  loading,
}: {
  label: string;
  onClick?: () => void;
  loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-50"
    >
      {loading ? "Processing..." : label}
    </button>
  );
}