/*
 *
 * HomePage
 *
 */
import Migrator from "../../components/Migrator";
import "../App/App.css";
import { LoadingIndicatorPage } from "@strapi/helper-plugin";
import { Information } from "@strapi/icons";
import { CheckCircle } from "@strapi/icons";
import CustomAlert from "../../components/Alert";
import useMigrateCategory from "../../hook/useMigrateCategory";

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
    handleFieldMapping,
    handleBatch,
    isMigrating,
    result,
    showAlert,
    handleClose,
    handleMigration,
  } = useMigrateCategory();
  return (
    <div className="home-page">
      <div className="inner-container">
        <h1>Migrate your content from WordPress to Strapi seamlessly</h1>
        {isMigrating ? (
          <LoadingIndicatorPage />
        ) : (
          <div className="migrate-content">
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
              handleFieldMapping={(event) =>
                handleFieldMapping(event.target.value)
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

export default HomePage;
