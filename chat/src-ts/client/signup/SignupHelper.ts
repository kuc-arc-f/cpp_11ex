const SignupHelper = {

  user_create: (email , password, username) => {
    try{    
      const inData = {
        email: email,
        password: password,
        username: username        
      };        
      const target = {
        action: "user_create",
        path: "/api/users/create",
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
            console.log(j2.data)
            //setChatThreads(j2.data)
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
export default SignupHelper;
