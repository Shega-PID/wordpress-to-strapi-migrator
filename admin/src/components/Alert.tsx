import { Alert } from '@strapi/design-system/Alert';
import { ReactNode, useState } from 'react';
import useHomePage from '../hook/useMigrator';

interface AlertProps{
  variant:string;
  icon:ReactNode;
  message:string;
}
const CustomAlert = ({variant,icon,message}:AlertProps) => {
const{isVisible,handleClose} = useHomePage()
  return (
    isVisible ? ( 
    <Alert className='custom-alert'
      variant={variant}
      icon={icon}
      closeLabel="Close alert"
      onClose={handleClose}
    >
      {message}
    </Alert>
    ) : null
  );
};

export default CustomAlert;
