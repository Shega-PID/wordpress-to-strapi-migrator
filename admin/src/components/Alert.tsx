import { Alert } from '@strapi/design-system/Alert';
import { ReactNode, useState } from 'react';
import useHomePage from '../hook/useMigrator';

interface AlertProps{
  title:string;
  variant:string;
  icon:ReactNode;
  message:string;
}
const CustomAlert = ({title,variant,icon,message}:AlertProps) => {
const{isVisible,handleClose} = useHomePage()
  return (
    isVisible ? ( 
    <Alert className='custom-alert'
      title={title}
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
