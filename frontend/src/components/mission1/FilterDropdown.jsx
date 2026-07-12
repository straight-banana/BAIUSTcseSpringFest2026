import Select from '../forms/Select.jsx';

export default function FilterDropdown({ label, value, onChange, options, allLabel = 'All' }) {
  return (
    <Select
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-w-[140px]"
    >
      <option value="">{allLabel}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </Select>
  );
}
