import { Button } from '@strapi/design-system';

interface IButton{
    label:string;
    onClick:(start:number,end:number,batch:number,restAPI:string) => void;
    id:string;
    startPage:number;
    endPage:number;
    batch:number;
    restAPI:string;
}

const SButton = ({label,onClick,id,startPage,restAPI,endPage,batch}:IButton) => {
  return (
    <Button className="migrate-button" id={id} onClick={() => onClick(startPage,endPage,batch,restAPI)}>{label}</Button>
  )
}

export default SButton