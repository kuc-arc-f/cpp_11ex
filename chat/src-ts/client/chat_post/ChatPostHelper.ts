import LibCommon from "../lib/LibCommon";

const ChatPostHelper = {

  post_text_conv: (items: array) => {
    try{
      const ret = [];
      items.forEach((element) => {
        console.log(element)
        let row = element;
        let title_tmp = LibCommon.replaceBrString(element.title);
        element.title = title_tmp;
        ret.push(element)
      });
      return ret;
    } catch (error) {
      throw new Error(error)
    }
  },

  thread_add: function(chatId, userId, chatPostId , title){
    const inData = {
      chatId: chatId,
      userId: userId,
      chatPostId: chatPostId,
      title: title,
      body: ""
    }
    const target = {
      action: "chat_thread_create",
      path: "/api/threads/create",
      data: JSON.stringify(inData)
    } 
    return target;
  },

  thread_list: function(chatPostId){
    const inData = {
      chatPostId: chatPostId,
    }
    const target = {
      action: "chat_thread_list",
      path: "/api/threads/get_list",
      data: JSON.stringify(inData)
    } 
    return target;
  },

  thread_delete: function(thread_id){
    const inData = {
      id: thread_id,
    }
    const target = {
      action: "chat_thread_delete",
      path: "/api/threads/delete",
      data: JSON.stringify(inData)
    } 
    return target;
  },  

  chat_get: function(id, setChat:any) {
    try {
      const getData = {
        id: id
      };        
      const target = {
        action: "chat_get_one",
        path: "/api/chats/get",
        data: JSON.stringify(getData)
      }        
      const sendJson = JSON.stringify(target)        
      console.log(sendJson)
      if (window.chrome && window.chrome.webview) {
        const eventHandler = (event) => {
          const resp = event.data;
          if(resp){
            const j1 = JSON.parse(resp)
            console.log(j1)
            if(j1.ret === 200){
              const j2 = JSON.parse(j1.data)
              console.log(j2.data)
              setChat(j2.data)
            }else{
              console.log("resp=" + resp)
            }
          }
          window.chrome.webview.removeEventListener('message', eventHandler);
        }
        window.chrome.webview.addEventListener('message', eventHandler);
        window.chrome.webview.postMessage(sendJson);        
      }        
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }
}
export default ChatPostHelper;