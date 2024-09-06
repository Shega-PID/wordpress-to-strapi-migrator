import React, { useState } from "react";
import { FieldInput } from "@strapi/design-system";
import { EyeIcon } from "../icons/EyeIcon";
import { EyeStrikedIcon } from "../icons/EyeStrikedIcon";

interface InputFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  type: string;
  widthCss:string;
  labelCss:string;
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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const passwordType = showPassword ? "text" : "password";

  return (
    <div className='custom-input-field'>
      <label className={labelCss} htmlFor={id}>{label}</label>
      {/* <div className='input-field'> */}
        <div className='input-container'>
          <FieldInput
          className={widthCss}
            id={id}
            type={type === "password" ? passwordType : type}
            placeholder={placeholder}
            onChange={onChange}
           

          />
          {type === "password" && (
            <svg
              className={`password-toggle ${showPassword ? "visible" : ""}`}
              onClick={toggleShowPassword}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ cursor: 'pointer', color: 'white' }}
            >
              {showPassword ? (
              <EyeIcon/>
              ) : (
                <EyeStrikedIcon/>
              )}
            </svg>
          )}
        </div>
      {/* </div> */}
    </div>
  );
};

export default InputField;
