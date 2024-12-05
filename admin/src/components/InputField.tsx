import React, { useState } from "react";

interface InputFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  type: string;
  widthCss: string;
  labelCss: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({
  id,
  label,
  placeholder,
  type,
  onChange,
  widthCss,
  labelCss
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const passwordType = showPassword ? "text" : "password";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number") {
      const value = event.target.value;
      if (value === "" || /^[1-9]\d*$/.test(value)) {
        setError("");
        onChange(event);
      } else {
        setError("Positive integers only.");
      }
    } else {
      onChange(event);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          minHeight: "20px"
        }}
      >
        <label style={{
              width: "130px", 
              fontSize:'16px'
            }} className={labelCss} htmlFor={id}>
          {label}
        </label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            width: "130px" // Updated width to 30px
          }}
        >
          <input
            className={widthCss}
            id={id}
            type={type === "password" ? passwordType : type}
            placeholder={placeholder}
            onChange={handleChange}
            min={type === "number" ? "1" : undefined}
            style={{
              width: "130px", 
              fontSize:'16px',
              padding:'5px 0px'
            }}
          />
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default InputField;
