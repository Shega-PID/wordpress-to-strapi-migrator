import { Alert } from '@strapi/design-system/Alert';
import { ReactNode, useState } from 'react';

interface AlertProps{
  variant:string;
  icon:ReactNode;
  message:string;
  handleClose:() => void;
}
const CustomAlert = ({variant,icon,message,handleClose}:AlertProps) => {

  return (
    <Alert className='custom-alert'
      variant={variant}
      icon={icon}
      closeLabel="Close alert"
      onClose={handleClose}
    >
      {message}
    </Alert>
  
  );
};

export default CustomAlert;
