import { Button } from '@strapi/design-system';

interface IButton{
    label:string;
    onClick:() => void;
}

const SButton = ({label,onClick}:IButton) => {
  return (
    <Button onClick={onClick}>{label}</Button>
  )
}

export default SButton