const ChatPostHelper = {

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
}
export default ChatPostHelper;