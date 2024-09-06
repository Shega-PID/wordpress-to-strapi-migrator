/*
 *
 * HomePage
 *
 */
import Migrator from '../../components/Migrator'
import SButton from "../../components/CommonButton";
import useMigrator from "../../hook/useMigrator";
import "../App/App.css";
import { LoadingIndicatorPage } from "@strapi/helper-plugin";
import { Information } from '@strapi/icons';
import CustomAlert from "../../components/Alert";
import Authorization from '../../components/Authorization';
import useMigrateCategory from '../../hook/useMigrateCategory';
import useMigrateTag from '../../hook/useMigrateTag';
import useMigrateMedia from '../../hook/useMigrateMedia';

const HomePage = () => {
  const {
    isMigrating,
    result,
    showAlert,
   handleMigration
  } = useMigrator();

  const {
    startPage,
    endPage,
    batch,
    restApi,
    handleStartPage,
    handleRestApi,
    handleEndPage,
    handleBatch,
  } = useMigrateCategory();
 


  return (
    <div className="home-page">
      <h1>Migrate your content from WordPress to Strapi In Minutes</h1>
     <Authorization/>
      {isMigrating && <LoadingIndicatorPage />}
      <div className="migrate-content">
        <Migrator
        startPage={startPage}
        endPage={endPage}
        batch={batch}
        restApi={restApi}
        handleBatch={(event) => handleBatch(parseInt(event.target.value))}
        handleStartPage={ (event) => handleStartPage(parseInt(event.target.value))}
        handleRestApi={(event) =>handleRestApi(event.target.value)}
        handleEndPage={(event) => handleEndPage(parseInt(event.target.value))}
        handleMigration={handleMigration}
        label="Migrate"
        />
         
      </div>
      {showAlert && (
        <CustomAlert
          title= {result?.success ? "Success" : "Error"}
          variant="danger"
          message={result?.message ?? ""}
          icon={<Information />}
        />
      )}{" "}
    </div>
  );
};

export default HomePage;
