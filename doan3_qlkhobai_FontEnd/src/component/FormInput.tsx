import React from "react";

interface FormInputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const FormInput: React.FC<FormInputProps> = (props) => {
  const { label, name, value, onChange, type = "text" } = props;

  return (
    <div className="form-group">
      <label>{label}</label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default FormInput;