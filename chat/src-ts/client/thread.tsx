import React, { useState , useEffect } from 'react';
import { Home, Settings, Search, UserCircle, X } from 'lucide-react';
import Container from '../components/Container'
import ChatPostHelper from "./chat_post/ChatPostHelper"
import ThreadHelper from "./thread/ThreadHelper"
import LibConfig from "./lib/LibConfig"

// Types
type Post = {
  id: number;
  user: string;
  title: string;
  content: string;
  date: string;
};
let itemId: number = 0;

// Dummy Data
const initialPosts: Post[] = [
  {
    id: 560,
    user: 'User11',
    title: '',
    content: 'test-post-0518-2',
    date: '2026-05-18',
  },
  {
    id: 559,
    user: 'User11',
    title: '',
    content: 'test-post-0518-1',
    date: '2026-05-18',
  },
];

export default function App() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [postOne, setPostOne] = useState({});
  const [threads, setThreads] = useState<[]>([]);
  const [chatThreads, setChatThreads] = useState<[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newReply, setNewReply] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    (async () => {
      // chat-ID receive
      const chat_id = sessionStorage.getItem(LibConfig.STORAGE_KEY_CHAT_ID)
      itemId = Number(chat_id);
      console.log("chatId=" , itemId);
      fetchTodos();
    })()
  }, []);

  const fetchTodos = () => {
    try {
      ThreadHelper.getChatThread(itemId , setChatThreads);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handlePost = () => {
    if (!newContent.trim() && !newTitle.trim()) return;
    const newPost: Post = {
      id: posts.length > 0 ? posts[0].id + 1 : 1,
      user: 'User11',
      title: newTitle,
      content: newContent,
      date: new Date().toISOString().split('T')[0],
    };
    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
  };

  const threadList = function(post_id) {
    ThreadHelper.getThreadList(post_id , setThreads);
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
          <h1 className="text-lg font-bold text-blue-600">Thread</h1>
        </div>

        {/* Post List */}
        <div className="space-y-4">
          {chatThreads.map(thread => (
            <div key={thread.thread_id} className="bg-white p-6 rounded shadow-sm border border-gray-200 flex flex-col gap-3">
              <div className="font-medium text-gray-900 border-b border-gray-300 pb-2 flex items-center">
                {thread.user}
              </div>
              {thread.title && <div className="font-bold text-gray-800 break-words">{thread.title}</div>}
              <div className="text-sm text-gray-800">
                {thread.createdAt} , ID: {thread.thread_id} , chatPostId={thread.chatPostId}
              </div>
              <div className="flex justify-start pt-1">
                <button 
                  onClick={() => {
                    setSelectedPost(thread);
                    ThreadHelper.getPostGet(thread.chatPostId , setPostOne);
                    setTimeout(() => {
                      threadList(thread.chatPostId);
                    }, 500);                    
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

    {/* Post Dialog text-xl */}
    {selectedPost && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden transform transition-all">
          <div className="p-4 border-b border-gray-200 flex justify-between items-start">
            <div className="pr-4">
              <div className="text-sm text-gray-500 mb-1">{postOne.createdAt} &bull; ID: {postOne.id}</div>
              <div className="text-gray-900 break-words">{postOne.title || 'Untitled'}</div>
            </div>
            <button 
              onClick={() => setSelectedPost(null)} 
              className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              aria-label="Close dialog"
            >
              <X size={24} />
            </button>
          </div>
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
              const target = ChatPostHelper.thread_add(itemId, 1, postOne.id, newReply);
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
                        threadList(postOne.id);
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
          <div className="p-6 overflow-y-auto text-gray-600 leading-relaxed space-y-4">
            {threads.map(thread => (
              <div key={thread.id} 
              className="bg-white p-6 rounded  shadow-sm border border-gray-200">
                <div className="font-medium text-gray-900 border-b border-gray-300 pb-2 flex items-center">
                  {thread.user}
                </div>
                {thread.title && <div className="text-gray-800 break-words">{thread.title}</div>}
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
                                threadList(thread.chatPostId);
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
