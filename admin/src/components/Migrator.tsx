
import SButton from "./CommonButton";
import InputField from "./InputField";

interface MigratorProps {
  handleStartPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEndPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBatch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRestApi: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  handleMigration: (
    start: number,
    end: number,
    batch: number,
    restAPI: string,
    fieldMap:string[],
  ) => void;
  startPage: number;
  endPage: number;
  batch: number;
  restApi: string;
  fieldMap:string[]
}
const Migrator = ({
  handleStartPage,
  handleEndPage,
  handleBatch,
  handleRestApi,
  handleMigration,
  startPage,
  endPage,
  batch,
  restApi,
  label,
  fieldMap,
}: MigratorProps) => {

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      width:'100%',
      justifyContent: 'flex-start', 
      flexWrap: 'wrap',
      gap: '10px',
      marginLeft: '5%',
    }}>
    
     
    <div style={{
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'start',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '40px'
}}>
      <InputField
        id="start-page"
        label="Start Page:"
        type="number"
        widthCss="input-field1"
        labelCss="label-width1"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          handleStartPage(event)
        }
      />
      <InputField
        id="rest-page"
        label="End Page:"
        type="number"
        widthCss="input-field1"
        labelCss="label-width1"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          handleEndPage(event)
        }
      />
      <InputField
        id="batch"
        label="Batch:"
        type="number"
        widthCss="input-field1"
        labelCss="label-width1"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          handleBatch(event)
        }
      />
      <InputField
        id="rest-api"
        label="End point:"
        widthCss="input-field1"
        labelCss="label-width1"
        type="string"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          handleRestApi(event)
        }
      />
    
    </div>
    <div style={{
  display: 'flex',
  justifyContent: 'end',
  alignItems: 'end'
}}>  <SButton
        id="migrate-button"
        onClick={() =>
          handleMigration(startPage, endPage, batch, restApi,fieldMap)
        }
        label={label}
        startPage={startPage}
        endPage={endPage}
        batch={batch}
        restAPI={restApi}
        state={restApi !== '' ? false : true}
      /></div>
    </div>
  );
};

export default Migrator;
