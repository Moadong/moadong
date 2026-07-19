import ClearableTextArea from '@/pages/AdminPage/components/ClearableTextArea/ClearableTextArea';
import EditField from '../EditField/EditField';

interface TextFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  maxLength?: number;
}

const TextField = ({
  label,
  placeholder,
  value,
  onChange,
  onClear,
  maxLength,
}: TextFieldProps) => (
  <EditField label={label}>
    <ClearableTextArea
      value={value}
      onChange={onChange}
      onClear={onClear}
      placeholder={placeholder ?? label}
      maxLength={maxLength}
      size='large'
    />
  </EditField>
);

export default TextField;
