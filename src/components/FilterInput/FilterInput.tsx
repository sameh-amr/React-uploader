interface FilterInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const FilterInput = ({ value, onChange }: FilterInputProps) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Filter by name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};