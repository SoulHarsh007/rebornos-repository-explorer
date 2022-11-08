import {useState} from 'react';

export default function Dropdown(props: {
  label: string;
  list: string[];
  defaultSelected?: string;
  onChange?: (newValue: string) => void;
}) {
  const {label, list, onChange, defaultSelected} = props;
  const [selected, setSelected] = useState(defaultSelected || list[0]);
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <select
        className="select select-bordered"
        value={selected}
        onChange={e => {
          setSelected(e.target.value);
          onChange?.(e.target.value);
        }}
      >
        {list.map(x => (
          <option value={x} key={x}>
            {x}
          </option>
        ))}
      </select>
    </div>
  );
}
