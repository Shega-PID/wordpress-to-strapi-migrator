interface IButton {
  label: string;
  onClick: (start: number, end: number, batch: number, restAPI: string) => void;
  id: string;
  startPage: number;
  endPage: number;
  batch: number;
  restAPI: string;
  state: boolean;
}

const SButton = ({
  label,
  onClick,
  id,
  startPage,
  state,
  restAPI,
  endPage,
  batch
}: IButton) => {
  return (
    <button
      disabled={state}
      id={id}
      onClick={() => onClick(startPage, endPage, batch, restAPI)}
      style={{
        backgroundColor: 'blue',
        color: 'white', 
        border: '1px solid black',
        padding: '0px 20px',
        borderRadius: '5px',
        cursor: state ? 'not-allowed' : 'pointer',
        marginTop:'35px',
        height:'42px',
        fontSize:'16px'
      }}
    >
      {label}
    </button>
  );
};

export default SButton;
