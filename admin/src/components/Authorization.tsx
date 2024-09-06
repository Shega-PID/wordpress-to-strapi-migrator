import useMigrator from "../hook/useMigrator";
import SButton from "./CommonButton";
import InputField from "./InputField"


const Authorization = () => {
    const {
      userName,password,url,
        handleUserName,
        handlePassword,
        handleUrl
      } = useMigrator();
      localStorage.setItem('auth',JSON.stringify({userName,password,url}))
  return (
    <div className="authorization-box">
    <h2>If your REST API is protected, Please Authorize It here</h2>
    <InputField
      id="user-name"
      label="User Name:"
      placeholder="user name"
      type="text"
      widthCss="input-field"
       labelCss="label-width"
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        handleUserName(event.target.value)
      }
    />
    <InputField
      id="password"
      label="Password:"
      placeholder="Password"
      type="password"
      widthCss="input-field"
      labelCss="label-width"
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        handlePassword(event.target.value)
      }
    />
       <InputField
      id="wordpress-url"
      label="wordPress URL:"
      placeholder="https://xxx/wp-json/wp/v2/"
      widthCss="input-field"
       labelCss="label-width"
      type="text"
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        handleUrl(event.target.value)
      }
    />
      
  </div>
  )
}

export default Authorization