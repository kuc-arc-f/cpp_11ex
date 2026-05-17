
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, X, Bookmark as BookmarkIcon, Search } from 'lucide-react';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  createdAt: number;
}

function getCookieValue(key) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === key) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

//
export default function App() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const target = {
          action: "book_mark_list",
          path: "/api/book_marks/list",
          data: JSON.stringify({})
        }        
        const sendJson = JSON.stringify(target)        
        console.log(sendJson)
        if (window.chrome && window.chrome.webview) {
          const eventHandler = (event) => {
            const resp = event.data;
            //console.log("resp=" + resp)
            if(resp){
              const j1 = JSON.parse(resp)
              if(j1.ret === 200){
                const j2 = JSON.parse(j1.data)
                const j3 = JSON.parse(j2.data)
                console.log(j3)
                setBookmarks(j3)
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
    fetchTodos();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    let finalUrl = newUrl;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    const newBookmark: Bookmark = {
      //id: crypto.randomUUID(),
      title: newTitle.trim(),
      url: finalUrl,
      //createdAt: Date.now(),
    } as Bookmark; // Cast to ensure type matching inside strict mode if needed

    setBookmarks([newBookmark, ...bookmarks]);
    try {
      const target = {
        action: "book_mark_create",
        path: "/api/book_marks/create",
        data: JSON.stringify(newBookmark)
      }        
      const sendJson = JSON.stringify(target)
      console.log(target)
      if (window.chrome && window.chrome.webview) {
        const eventHandler = (event) => {
          const resp = event.data;
          console.log("resp=" + resp)
          if(resp){
            const target = JSON.parse(resp)
            console.log(target)
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
    setNewUrl('');
  };

  const handleDelete = async(id: string) => {
    if(!confirm('delete bookmark?')) {
      return
    }
    try {
      const deleteData = {
        id: id
      }
      const target = {
        action: "book_mark_delete",
        path: "/api/book_marks/delete",
        data: JSON.stringify(deleteData)
      }
      const sendJson = JSON.stringify(target)
      console.log(target)
      if (window.chrome && window.chrome.webview) {
        const eventHandler = (event) => {
          const resp = event.data;
          console.log("resp=" + resp)
          if(resp){
            const target = JSON.parse(resp)
            console.log(target)
          }
          window.chrome.webview.removeEventListener('message', eventHandler);
        }
        window.chrome.webview.addEventListener('message', eventHandler);
        window.chrome.webview.postMessage(sendJson);        
      }       
    } catch (error) {
      console.error('通信に失敗しました:', error);
    }
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  const handleSaveEdit = async (id: string, updatedTitle: string, updatedUrl: string) => {
    let finalUrl = updatedUrl;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }
    try {
      const upData = {
        id: id,
        title: updatedTitle.trim(),
        url: finalUrl,
      }
      const target = {
        action: "book_mark_update",
        path: "/api/book_marks/update",
        data: JSON.stringify(upData)
      }    
      const sendJson = JSON.stringify(target)
      console.log(target)
      if (window.chrome && window.chrome.webview) {
        const eventHandler = (event) => {
          const resp = event.data;
          console.log("resp=" + resp)
          if(resp){
            const target = JSON.parse(resp)
            console.log(target)
          }
          window.chrome.webview.removeEventListener('message', eventHandler);
        }
        window.chrome.webview.addEventListener('message', eventHandler);
        window.chrome.webview.postMessage(sendJson);        
      }      
    } catch (error) {
      console.error('通信に失敗しました:', error);
    }
    setBookmarks(bookmarks.map(b => b.id === id ? { ...b, title: updatedTitle.trim(), url: finalUrl } : b));
    setEditingBookmark(null);
  };

  const filteredBookmarks = []

  const searchProc = async () => {
      try {
        if(searchQuery.trim()) {
          const sc = searchQuery.trim();
          console.log("sc=", sc)
        }
        const scData = {
          query: searchQuery.trim(),
        }        
        const target = {
          action: "book_mark_seacrh",
          path: "/api/book_marks/search",
          data: JSON.stringify(scData)
        }        
        const sendJson = JSON.stringify(target)
        console.log(target)
        if (window.chrome && window.chrome.webview) {
          const eventHandler = (event) => {
            const resp = event.data;
            //console.log("resp=" + resp)
            if(resp){
              const j1 = JSON.parse(resp)
              if(j1.ret === 200){
                const j2 = JSON.parse(j1.data)
                const j3 = JSON.parse(j2.data)
                console.log(j3)
                setBookmarks(j3)
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

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans pb-12">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8 pt-8 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-sm">
              <BookmarkIcon className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
              Bookmark Manager
            </h1>
          </div>
          <p className="text-neutral-500 sm:ml-14 text-sm sm:text-base">お気に入りのリンクを保存・管理しましょう。</p>
        </header>

        {/* Add Bookmark Form */}
        <section className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-neutral-200 mb-8 sm:ml-14">
          <h2 className="text-lg font-semibold mb-4 text-neutral-800">新しいブックマークを追加</h2>
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1.5">タイトル(TITLE)</label>
              <input
                id="title"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="例: example-titile"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="url" className="block text-sm font-medium text-neutral-700 mb-1.5">URL</label>
              <input
                id="url"
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
                disabled={!newTitle.trim() || !newUrl.trim()}
              >
                <Plus className="w-5 h-5" />
                <span>追加</span>
              </button>
            </div>
          </form>
        </section>

        {/* Bookmarks List */}
        <section className="sm:ml-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <h2 className="text-lg font-semibold text-neutral-800 whitespace-nowrap">
              登録済みブックマーク <span className="text-neutral-400 font-normal ml-1">({bookmarks.length})</span>
            </h2>
            
            {/* Search Input */}
            <div className="flex-1 sm:max-w-xs text-end">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="タイトルで検索..."
                className="flex-1 pl-9 pr-4 py-2 bg-white border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all text-sm"
              />
            </div>
          </div>
          <div className="text-end mb-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => searchProc()}
            >Search</button>
          </div>
          
          {bookmarks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200 border-dashed">
              <div className="bg-neutral-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookmarkIcon className="w-8 h-8 text-neutral-400" />
              </div>
              <p className="text-neutral-500 font-medium">ブックマークが登録されていません。</p>
              <p className="text-neutral-400 text-sm mt-1">上のフォームから追加してください。</p>
            </div>                     
          ) : (
            <ul className="space-y-3">
              {bookmarks.map((bookmark) => (
                <li key={bookmark.id} className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-200 flex items-center justify-between group hover:border-blue-300 transition-colors">
                  <div className="flex-1 min-w-0 pr-4">
                    <a 
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[24px] font-semibold text-neutral-900 hover:text-blue-600 truncate flex items-center gap-1.5 w-fit"
                    >
                      {bookmark.title}
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <a 
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                       className="text-sm text-neutral-500 truncate block mt-0.5 hover:underline"
                    >
                      {bookmark.url}
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingBookmark(bookmark)}
                      className="p-2.5 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="編集"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(bookmark.id)}
                      className="p-2.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="削除"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Edit Dialog Modal */}
      {editingBookmark && (
        <EditDialog 
          bookmark={editingBookmark} 
          onSave={handleSaveEdit}
          onClose={() => setEditingBookmark(null)} 
        />
      )}
    </div>
  );
}

function EditDialog({ 
  bookmark, 
  onSave, 
  onClose 
}: { 
  bookmark: Bookmark; 
  onSave: (id: string, title: string, url: string) => void; 
  onClose: () => void; 
}) {
  const [title, setTitle] = useState(bookmark.title);
  const [url, setUrl] = useState(bookmark.url);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    onSave(bookmark.id, title, url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Dialog content */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md w-full sm:scale-100 origin-center duration-200 overflow-hidden text-neutral-900">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
          <h2 className="text-lg font-semibold">ブックマークを編集</h2>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/50 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium text-neutral-700 mb-1.5">タイトル(TITLE)</label>
              <input
                id="edit-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="edit-url" className="block text-sm font-medium text-neutral-700 mb-1.5">URL</label>
              <input
                id="edit-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                required
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl font-medium transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors disabled:opacity-50 active:scale-[0.98]"
              disabled={!title.trim() || !url.trim()}
            >
              保存する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

