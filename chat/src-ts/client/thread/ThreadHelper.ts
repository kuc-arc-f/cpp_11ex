import LibCommon from "../lib/LibCommon";
import ChatPostHelper from "../chat_post/ChatPostHelper"

const ThreadHelper = {

  getChatThread: (chatId , setChatThreads: any) => {
    try {
      const lsitData = {
        chatId: chatId
      };        
      const target = {
        action: "chat_thread_list_chat",
        path: "/api/threads/get_list_chat",
        data: JSON.stringify(lsitData)
      }        
      const sendJson = JSON.stringify(target)        
      console.log(sendJson)
      if (window.chrome && window.chrome.webview) {
        const eventHandler = (event) => {
          const resp = event.data;
          const j1 = JSON.parse(resp)
          if(j1.ret === 200){
            const j2 = JSON.parse(j1.data)
            console.log(j2.data)
            const ar = ChatPostHelper.post_text_conv(j2.data)
            setChatThreads(ar)
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

  getPostGet: (postId , setPostOne: any) => {
    try {
      const lsitData = {
        id: postId
      };        
      const target = {
        action: "chat_post_get",
        path: "/api/chat_posts/get",
        data: JSON.stringify(lsitData)
      }        
      const sendJson = JSON.stringify(target)        
      console.log(sendJson)
      if (window.chrome && window.chrome.webview) {
        const eventHandler = (event) => {
          const resp = event.data;
          //console.log(resp)
          const j1 = JSON.parse(resp)
          if(j1.ret === 200){
            const j2 = JSON.parse(j1.data)
            console.log(j2.data)
            setPostOne(j2.data)
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

  getThreadList: (chatPostId , setThreads: any) => {
    try {
      const inData = {
        chatPostId: chatPostId,
      }
      const target = {
        action: "chat_thread_list",
        path: "/api/threads/get_list",
        data: JSON.stringify(inData)
      }      
      const sendJson = JSON.stringify(target)        
      console.log(sendJson)
      if (window.chrome && window.chrome.webview) {
        const eventHandler = (event) => {
          const resp = event.data;
          const j1 = JSON.parse(resp)
          //console.log(j1)
          if(j1.ret === 200){
            const j2 = JSON.parse(j1.data)
            console.log(j2.data)
            const ar = ChatPostHelper.post_text_conv(j2.data)
            setThreads(ar)
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
export default ThreadHelper;