import React, { useState, useEffect } from 'react';
import { Home, Settings, Search, UserCircle, X } from 'lucide-react';
import Container from '../components/Container'
import ChatPostHelper from "./chat_post/ChatPostHelper"
import LibConfig from "./lib/LibConfig"

// Types
type Post = {
  id: number;
  user: string;
  title: string;
  content: string;
  createdAt: string;
};
let itemId: number = 0;

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [threads, setThreads] = useState<[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newReply, setNewReply] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    (async () => {
      const chat_id = sessionStorage.getItem(LibConfig.STORAGE_KEY_CHAT_ID)
      itemId = Number(chat_id);
      console.log("chatId=" , itemId);
      fetchTodos();
    })()
  }, []);

  const fetchTodos = async () => {
    try {
      const lsitData = {
        chatId: itemId
      };        
      const target = {
        action: "chat_post_list",
        path: "/api/chat_posts/get_list",
        data: JSON.stringify(lsitData)
      }        
      const sendJson = JSON.stringify(target)        
      console.log(sendJson)
      if (window.chrome && window.chrome.webview) {
        const eventHandler = (event) => {
          const resp = event.data;
          if(resp){
            const j1 = JSON.parse(resp)
            //console.log(j1)
            if(j1.ret === 200){
              const j2 = JSON.parse(j1.data)
              console.log(j2.data)
              setPosts(j2.data)
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
  };  
 

  const handlePost = async() => {
    //if (!newContent.trim() && !newTitle.trim()) return;
    if (!newContent.trim()) return;
    const newPost: Post = {
      id: posts.length > 0 ? posts[0].id + 1 : 1,
      user: 'User11',
      chatId: itemId,
      userId: 1,
      title: newContent,
      body: "",
      content: "",
      date: new Date().toISOString().split('T')[0],
    };
    const target = {
      action: "chat_post_create",
      path: "/api/chat_posts/create",
      data: JSON.stringify(newPost)
    }          
    const sendJson = JSON.stringify(target)
    console.log(target)
    try{    
      if (window.chrome && window.chrome.webview) {
        const eventHandler = (event) => {
          const resp = event.data;
          console.log("resp=" + resp)
          if(resp){
            const target = JSON.parse(resp)
            console.log(target)
            fetchTodos();
          }
          window.chrome.webview.removeEventListener('message', eventHandler);
        }
        window.chrome.webview.addEventListener('message', eventHandler);
        window.chrome.webview.postMessage(sendJson);        
      }
    } catch (error) {
      console.error('通信に失敗しました:', error);
    }

    setNewTitle('');
    setNewContent('');
  };

  const handleDelete = async(id) => {
    if(!confirm('delete post?')) {
      return
    }    
    console.log("id=", id)
    const deleteData = {
      id: id,
    };
    const target = {
      action: "chat_post_delete",
      path: "/api/chat_posts/delete",
      data: JSON.stringify(deleteData)
    }          
    const sendJson = JSON.stringify(target)
    try{    
      if (window.chrome && window.chrome.webview) {
        const eventHandler = (event) => {
          const resp = event.data;
          console.log("resp=" + resp)
          if(resp){
            const target = JSON.parse(resp)
            console.log(target)
            if(target.ret === 200){
              setSelectedPost(null)
              fetchTodos();
            }
          }
          window.chrome.webview.removeEventListener('message', eventHandler);
        }
        window.chrome.webview.addEventListener('message', eventHandler);
        window.chrome.webview.postMessage(sendJson);        
      }
    } catch (error) {
      console.error('通信に失敗しました:', error);
    }
  }

  const threadList = function(post_id) {
    const target = ChatPostHelper.thread_list(post_id);
    const sendJson = JSON.stringify(target)
    console.log(target)
    try{    
      if (window.chrome && window.chrome.webview) {
        const eventHandler = (event) => {
          const resp = event.data;
          //console.log("resp=" + resp)
          if(resp){
            const j1 = JSON.parse(resp)
            console.log(j1)
            if(j1.ret === 200){
              const j2 = JSON.parse(j1.data)
              console.log(j2.data)
              setThreads(j2.data)
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
      console.error('通信に失敗しました:', error);
    }
  }

  return (
  <Container>
    {/* Main Content */}
    <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        
        {/* Search Bar Area */}
        <div className="bg-white p-4 rounded bg-white shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Key" 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-6 py-2 border border-blue-500 text-blue-600 text-sm font-medium rounded hover:bg-blue-50 transition-colors">
            Search
          </button>
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
            <UserCircle size={40} className="text-white" strokeWidth={1} fill="#e5e7eb" />
          </div>
        </div>

        {/* Post Form */}
        <div className="bg-white p-6 rounded shadow-sm border border-gray-200 flex flex-col gap-4">
{/*
          <textarea 
            className="w-full text-lg font-bold border-none focus:ring-0 resize-none p-0 placeholder-gray-400 focus:outline-none"
            placeholder=""
            rows={1}
            value={newTitle}
            onChange={(e) => {
              setNewTitle(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />
*/}
          <textarea 
            className="w-full border border-gray-300 rounded p-3 min-h-[120px] focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <div className="flex justify-start">
            <button 
              onClick={handlePost}
              className="px-6 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition-colors text-sm"
            >
              Post
            </button>
          </div>
        </div>

        {/* Post List */}
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white p-6 rounded shadow-sm border border-gray-200 flex flex-col gap-3">
              <div className="font-medium text-gray-900 border-b border-gray-300 pb-2 flex items-center">
                {post.user}
              </div>
              {post.title && <div className="font-bold text-gray-800 break-words">{post.title}</div>}
              <div className="text-gray-800 whitespace-pre-wrap flex-1">{post.content}</div>
              <div className="text-sm text-gray-800">
                {post.createdAt} , ID: {post.id}
              </div>
              <div className="flex justify-start pt-1">
                <button 
                  onClick={() => {
                    setSelectedPost(post);
                    threadList(post.id)
                  }}
                  className="px-5 py-1.5 border border-blue-500 text-blue-600 text-sm font-medium rounded hover:bg-blue-50 transition-colors"
                >
                  Show
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>

    {/* Post Dialog bg-gray-400 bg-opacity-50 */}
    {selectedPost && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden transform transition-all">
          <div className="p-4 border-b border-gray-200 flex justify-between items-start">
            <div className="pr-4">
              <div className="text-sm text-gray-500 mb-1">{selectedPost.user_name} &bull; {selectedPost.createdAt}</div>
              {/* <h3 className="font-bold text-xl text-gray-900 break-words">{selectedPost.title || 'Untitled'}</h3> */}
              <div className="text-gray-900 break-words">{selectedPost.title || 'Untitled'}</div>
            </div>
            <button 
              onClick={() => setSelectedPost(null)} 
              className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              aria-label="Close dialog"
            >
              <X size={24} />
            </button>
          </div>
          {/*
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <p className="text-gray-800 whitespace-pre-wrap">{selectedPost.content}</p>
          </div>
          */}
          <hr />
          <div className="pt-2">
            <textarea 
            className="w-full border border-gray-400 placeholder-gray-400"
            placeholder="input Reply"
            rows={3}
            value={newReply}
            onChange={(e) => {
              setNewReply(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />
          </div>
          <div>
            <button
            className="px-6 py-2 mb-2 bg-blue-500 text-white font-medium rounded hover:bg-gray-300 transition-colors text-sm mx-2"
            onClick={()=>{
              /* chatId, userId, chatPostId , title */
              const target = ChatPostHelper.thread_add(itemId, 1, selectedPost.id, newReply);
              const sendJson = JSON.stringify(target)
              console.log(sendJson);
              try{    
                if (window.chrome && window.chrome.webview) {
                  const eventHandler = (event) => {
                    const resp = event.data;
                    console.log("resp=" + resp)
                    if(resp){
                      const target = JSON.parse(resp)
                      console.log(target)
                      if(target.ret === 200){
                        threadList(selectedPost.id);
                        setNewReply("");
                      }
                    }
                    window.chrome.webview.removeEventListener('message', eventHandler);
                  }
                  window.chrome.webview.addEventListener('message', eventHandler);
                  window.chrome.webview.postMessage(sendJson);        
                }
              } catch (error) {
                console.error('通信に失敗しました:', error);
              }              
            }}
            >Reply
            </button>

          </div>
          <hr />
          {/* thread-List fixed inset-0 bg-gray-600 bg-opacity-50 */}
          <div className="p-6 overflow-y-auto text-gray-600 leading-relaxed space-y-4">
            {threads.map(thread => (
              <div key={thread.id} 
              className="bg-white p-6 rounded  shadow-sm border border-gray-200">
                <div className="font-medium text-gray-900 border-b border-gray-300 pb-2 flex items-center">
                  {thread.user}
                </div>
                {thread.title && <div className="font-bold text-gray-800 break-words">{thread.title}</div>}
                <div className="text-sm text-gray-800">
                  {thread.createdAt} 
                  <span>
                    <button className="text-blue-400 ms-2"
                    onClick={() => {
                      const target = ChatPostHelper.thread_delete(thread.thread_id)
                      const sendJson = JSON.stringify(target)
                      console.log(sendJson);
                      try{    
                        if (window.chrome && window.chrome.webview) {
                          const eventHandler = (event) => {
                            const resp = event.data;
                            console.log("resp=" + resp)
                            if(resp){
                              const target = JSON.parse(resp)
                              console.log(target)
                              if(target.ret === 200){
                                threadList(selectedPost.id);
                              }
                            }
                            window.chrome.webview.removeEventListener('message', eventHandler);
                          }
                          window.chrome.webview.addEventListener('message', eventHandler);
                          window.chrome.webview.postMessage(sendJson);        
                        }
                      } catch (error) {
                        console.error('通信に失敗しました:', error);
                      }                      
                    }}
                    >[ × ]</button> 
                    {/* thread.thread_id */}
                  </span>
                </div>
              </div>
            ))}
          </div>          

          <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
            <button 
              onClick={()=>handleDelete(selectedPost.id)}
              className="px-6 py-2 outline-2 outline-red-500 text-red-800 font-medium rounded hover:bg-gray-300 transition-colors text-sm mx-2"
            >
              Delete
            </button>

            <button 
              onClick={() => setSelectedPost(null)}
              className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded hover:bg-gray-300 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}        
  </Container>
  );
}
