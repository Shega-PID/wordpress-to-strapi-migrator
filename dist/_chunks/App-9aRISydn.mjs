import { jsxs, jsx } from "react/jsx-runtime";
import { Routes, Route } from "react-router-dom";
import { CheckCircle, Information } from "@strapi/icons";
import { useState } from "react";
const CustomAlert = ({ variant, icon, message, handleClose }) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `alert alert-${variant}`,
      style: {
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "600px",
        zIndex: 1e3,
        marginTop: "10px"
      },
      children: [
        /* @__PURE__ */ jsx("span", { className: "alert-icon", children: icon }),
        /* @__PURE__ */ jsx("span", { className: "alert-message", children: message }),
        /* @__PURE__ */ jsx("button", { className: "alert-close", onClick: handleClose, children: "×" })
      ]
    }
  );
};
const migrationRequest = {
  migratePost: async (startPage, endPage, batch, restApi) => {
    const response = await fetch(`/w-to-s-migrator-plugin/migrate-post/${startPage}/${endPage}/${batch}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ restApi })
    });
    return response.json();
  },
  migrateAuthor: async () => {
    const response = await fetch("/w-to-s-migrator-plugin/migrate-author", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    return await response.json();
  },
  migrateUser: async (startPage, endPage, batch) => {
    const response = await fetch(`/w-to-s-migrator-plugin/migrate-users/${startPage}/${endPage}/${batch}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.json();
  },
  migrateCategory: async (startPage, endPage, batch, restApi) => {
    const response = await fetch(`/w-to-s-migrator-plugin/migrate-category/${startPage}/${endPage}/${batch}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ restApi })
    });
    return response.json();
  },
  migrateTag: async (startPage, endPage, batch, restApi) => {
    const response = await fetch(`/w-to-s-migrator-plugin/migrate-tag/${startPage}/${endPage}/${batch}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ restApi })
    });
    return response.json();
  },
  migrateMedia: async (startPage, endPage, batch, restApi) => {
    const response = await fetch(`/w-to-s-migrator-plugin/migrate-media/${startPage}/${endPage}/${batch}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ restApi })
    });
    console.log({ response: response.json }, "this is inside client");
    return response.json();
  },
  migrateComment: async (startPage, endPage, batch, restApi) => {
    const response = await fetch(`/w-to-s-migrator-plugin/migrate-comment/${startPage}/${endPage}/${batch}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ restApi })
    });
    return response.json();
  }
};
const useMigrateCategory = () => {
  const [startPage, setStartPage] = useState(1);
  const [fieldMap, setFieldMap] = useState([]);
  const [endPage, setEndPage] = useState(5);
  const [batch, setBatch] = useState(100);
  const [restApi, setRestApi] = useState("");
  const [result, setResult] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const handleStartPage = async (value) => {
    setStartPage(value);
  };
  const handleEndPage = async (value) => {
    setEndPage(value);
  };
  const handleBatch = async (value) => {
    setBatch(value);
  };
  const handleRestApi = async (value) => {
    setRestApi(value);
  };
  const handleFieldMapping = async (value) => {
    setFieldMap(value.split(","));
  };
  const handleMigration = async (startpage, endPage2, batch2, restApi2, fieldMap2) => {
    setIsMigrating(true);
    if (restApi2.toLowerCase() === "categories") {
      console.log("inside categories");
      const result2 = await migrationRequest.migrateCategory(startpage, endPage2, batch2, restApi2);
      setResult(result2);
    } else if (restApi2.toLowerCase() === "comments") {
      const result2 = await migrationRequest.migrateComment(startpage, endPage2, batch2, restApi2);
      setResult(result2);
    } else if (restApi2.toLowerCase() === "media") {
      const result2 = await migrationRequest.migrateMedia(startpage, endPage2, batch2, restApi2);
      setResult(result2);
    } else if (restApi2.toLowerCase() === "tags") {
      const result2 = await migrationRequest.migrateTag(startpage, endPage2, batch2, restApi2);
      setResult(result2);
    } else if (restApi2.toLowerCase() === "posts") {
      const result2 = await migrationRequest.migratePost(startpage, endPage2, batch2, restApi2);
      setResult(result2);
    } else if (restApi2.toLowerCase() === "author") {
      const result2 = await migrationRequest.migrateAuthor();
      setResult(result2);
    } else if (restApi2.toLowerCase() === "users") {
      const result2 = await migrationRequest.migrateUser(startpage, endPage2, batch2);
      setResult(result2);
    }
    setShowAlert(true);
    setIsMigrating(false);
    setRestApi("");
    console.log({ isMigrating });
  };
  const handleClose = () => {
    setShowAlert(false);
  };
  return {
    startPage,
    endPage,
    batch,
    result,
    isMigrating,
    showAlert,
    restApi,
    fieldMap,
    handleBatch,
    handleStartPage,
    handleEndPage,
    handleRestApi,
    handleFieldMapping,
    handleMigration,
    handleClose
  };
};
const SButton = ({
  label,
  onClick,
  id,
  startPage,
  state,
  restAPI,
  endPage,
  batch
}) => {
  return /* @__PURE__ */ jsx(
    "button",
    {
      disabled: state,
      id,
      onClick: () => onClick(startPage, endPage, batch, restAPI),
      style: {
        backgroundColor: "blue",
        color: "white",
        border: "1px solid black",
        padding: "0px 20px",
        borderRadius: "5px",
        cursor: state ? "not-allowed" : "pointer",
        marginTop: "35px",
        height: "42px",
        fontSize: "16px"
      },
      children: label
    }
  );
};
const InputField = ({
  id,
  label,
  placeholder,
  type,
  onChange,
  widthCss,
  labelCss
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const passwordType = showPassword ? "text" : "password";
  const handleChange = (event) => {
    if (type === "number") {
      const value = event.target.value;
      if (value === "" || /^[1-9]\d*$/.test(value)) {
        setError("");
        onChange(event);
      } else {
        setError("Positive integers only.");
      }
    } else {
      onChange(event);
    }
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          minHeight: "20px"
        },
        children: [
          /* @__PURE__ */ jsx("label", { style: {
            width: "130px",
            fontSize: "16px"
          }, className: labelCss, htmlFor: id, children: label }),
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                position: "relative",
                width: "130px"
                // Updated width to 30px
              },
              children: /* @__PURE__ */ jsx(
                "input",
                {
                  className: widthCss,
                  id,
                  type: type === "password" ? passwordType : type,
                  placeholder,
                  onChange: handleChange,
                  min: type === "number" ? "1" : void 0,
                  style: {
                    width: "130px",
                    fontSize: "16px",
                    padding: "5px 0px"
                  }
                }
              )
            }
          )
        ]
      }
    ),
    error && /* @__PURE__ */ jsx("p", { className: "error-message", children: error })
  ] });
};
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
  fieldMap
}) => {
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    gap: "10px",
    marginLeft: "5%"
  }, children: [
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "start",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "40px"
    }, children: [
      /* @__PURE__ */ jsx(
        InputField,
        {
          id: "start-page",
          label: "Start Page:",
          type: "number",
          widthCss: "input-field1",
          labelCss: "label-width1",
          onChange: (event) => handleStartPage(event)
        }
      ),
      /* @__PURE__ */ jsx(
        InputField,
        {
          id: "rest-page",
          label: "End Page:",
          type: "number",
          widthCss: "input-field1",
          labelCss: "label-width1",
          onChange: (event) => handleEndPage(event)
        }
      ),
      /* @__PURE__ */ jsx(
        InputField,
        {
          id: "batch",
          label: "Batch:",
          type: "number",
          widthCss: "input-field1",
          labelCss: "label-width1",
          onChange: (event) => handleBatch(event)
        }
      ),
      /* @__PURE__ */ jsx(
        InputField,
        {
          id: "rest-api",
          label: "End point:",
          widthCss: "input-field1",
          labelCss: "label-width1",
          type: "string",
          onChange: (event) => handleRestApi(event)
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      justifyContent: "end",
      alignItems: "end"
    }, children: [
      "  ",
      /* @__PURE__ */ jsx(
        SButton,
        {
          id: "migrate-button",
          onClick: () => handleMigration(startPage, endPage, batch, restApi, fieldMap),
          label,
          startPage,
          endPage,
          batch,
          restAPI: restApi,
          state: restApi !== "" ? false : true
        }
      )
    ] })
  ] });
};
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
    handleMigration
  } = useMigrateCategory();
  return /* @__PURE__ */ jsx("div", { style: {
    display: "flex",
    flexDirection: "column",
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'transparent',
    // color: 'white',
    fontSize: "20px",
    width: "100%",
    height: "100vh",
    marginTop: "20px",
    padding: "30px",
    gap: "30px"
  }, children: /* @__PURE__ */ jsxs("div", { style: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "1000px",
    gap: "10px",
    padding: "80px 20px",
    marginTop: "10%",
    marginLeft: "5%",
    borderRadius: "5px",
    border: "1px solid black",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"
  }, children: [
    /* @__PURE__ */ jsx("h1", { style: { padding: "0px 35px" }, children: "Migrate your content from WordPress to Strapi seamlessly" }),
    isMigrating ? /* @__PURE__ */ jsx("h3", { children: "Migrating ...." }) : /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
      Migrator,
      {
        startPage,
        endPage,
        batch,
        restApi,
        fieldMap,
        handleBatch: (event) => handleBatch(parseInt(event.target.value)),
        handleStartPage: (event) => handleStartPage(parseInt(event.target.value)),
        handleRestApi: (event) => handleRestApi(event.target.value),
        handleEndPage: (event) => handleEndPage(parseInt(event.target.value)),
        handleMigration,
        label: "Migrate"
      }
    ) }),
    showAlert && /* @__PURE__ */ jsx(
      CustomAlert,
      {
        variant: result?.success ? "success" : "danger",
        message: result?.message ?? "",
        icon: result?.success ? /* @__PURE__ */ jsx(CheckCircle, {}) : /* @__PURE__ */ jsx(Information, {}),
        handleClose
      }
    )
  ] }) });
};
const App = () => {
  return /* @__PURE__ */ jsx(Routes, { children: /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(HomePage, {}) }) });
};
export {
  App
};
