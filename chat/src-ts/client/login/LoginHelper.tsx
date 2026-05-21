import LibCookie from "../../lib/LibCookie"
import LibConfig from "../lib/LibConfig"

const LoginHelper = {

  user_login: (email , password) => {
    try{    
      const inData = {
        email: email,
        password: password
      };        
      const target = {
        action: "user_get",
        path: "/api/users/get",
        data: JSON.stringify(inData)
      }        
      const sendJson = JSON.stringify(target)        
      console.log(sendJson)  
      if (window.chrome && window.chrome.webview) {
        const eventHandler = (event) => {
          const resp = event.data;
          console.log(resp)
          const j1 = JSON.parse(resp)
          if(j1.ret === 200){
            const j2 = JSON.parse(j1.data)
            const j2data = j2.data;
            console.log(j2data)
            console.log("j2.id=", j2data.id);
            console.log(j1)
            if(j2data.id){
              localStorage.setItem(LibConfig.STORAGE_KEY_USER_ID, j2data.id);
              //LibCookie.setCookie("" , j2data.id, 365);
            }
            location.href = "#/";
          }if(j1.ret === 400){
            alert("Error, Login failure")
          }else{
            console.log("resp=" + resp)
          }          
          window.chrome.webview.removeEventListener('message', eventHandler);
        }
        window.chrome.webview.addEventListener('message', eventHandler);
        window.chrome.webview.postMessage(sendJson);        
      }      

    } catch (error) {
      console.error('Error fetching:', error);
    }
  },

}
export default LoginHelper;
