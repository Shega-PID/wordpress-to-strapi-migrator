import { Button } from '@strapi/design-system';

interface IButton{
    label:string;
    onClick:(start:number,end:number,batch:number,restAPI:string) => void;
    id:string;
    startPage:number;
    endPage:number;
    batch:number;
    restAPI:string;
    state:boolean;
}

const SButton = ({label,onClick,id,startPage,state,restAPI,endPage,batch}:IButton) => {
  return (
    <Button disabled={state} className="migrate-button" id={id} onClick={() => onClick(startPage,endPage,batch,restAPI)}>{label}</Button>
  )
}

export default SButton