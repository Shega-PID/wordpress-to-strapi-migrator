/*
 *
 * HomePage
 *
 */

import { CheckCircle, Information } from "@strapi/icons";
// import { Page } from '@strapi/strapi/admin';

import CustomAlert from "../components/Alert";
import useMigrateCategory from "../hook/useMigrateCategory";
import Migrator from "../components/Migrator";

const HomePage = () => {
  const {
    startPage,
    endPage,
    batch,
    fieldMap,
    restApi,
    handleStartPage,
    handleRestApi,
    handleEndPage,
    handleBatch,
    isMigrating,
    result,
    showAlert,
    handleClose,
    handleMigration,
  } = useMigrateCategory();
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center',
      // alignItems: 'center',
      // backgroundColor: 'transparent',
      // color: 'white',
      fontSize: '20px',
      width: '100%',
      height: '100vh',
      marginTop: '20px',
      padding: '30px',
      gap: '30px',
      
    }}>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start', 
      alignItems: 'flex-start', 
      width: '1000px',
      gap: '10px',
      padding: '80px 20px',
      marginTop: '10%',
      marginLeft: '5%',
      borderRadius: '5px',
      border: '1px solid black',
      boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
    }}>
        <h1 style={{padding: '0px 35px',}}>Migrate your content from WordPress to Strapi seamlessly</h1>
        {isMigrating ? (
          <h3>Migrating ....</h3>
        ) : (
          <div >
            <Migrator
              startPage={startPage}
              endPage={endPage}
              batch={batch}
              restApi={restApi}
              fieldMap={fieldMap}
              handleBatch={(event) => handleBatch(parseInt(event.target.value))}
              handleStartPage={(event) =>
                handleStartPage(parseInt(event.target.value))
              }
             
              handleRestApi={(event) => handleRestApi(event.target.value)}
              handleEndPage={(event) =>
                handleEndPage(parseInt(event.target.value))
              }
              handleMigration={handleMigration}
              label="Migrate"
            />
          </div>
        )}
        {showAlert && (
          <CustomAlert
            variant={result?.success ? "success" : "danger"}
            message={result?.message ?? ""}
            icon={result?.success ? <CheckCircle /> : <Information />}
            handleClose={handleClose}
          />
        )}
      </div>
    </div>
 
  );
};



export default HomePage