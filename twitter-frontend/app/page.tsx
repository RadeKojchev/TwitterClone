'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { tweetService } from '../src/services/tweet.service';
import TweetCard from '../src/components/TweetCard';
import { Image as ImageIcon, X, Search } from 'lucide-react';
import api from '../src/lib/axios';
import Link from 'next/link';

export default function Home() {
  const [tweets, setTweets] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newTweet, setNewTweet] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ПАГИНАЦИЈА СОСТОЈБИ
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchCurrentUser();
    loadHomeFeed(1, true); // Вчитај ја првата страница на почеток
  }, []);

  // ФУНКЦИЈА ЗА ВЧИТУВАЊЕ ТВИТОВИ
  const loadHomeFeed = async (pageNum: number, reset: boolean = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setIsFetchingMore(true);

      const data = await tweetService.getHomeFeed(pageNum, 10);
      
      if (data.length < 10) setHasMore(false); // Ако нема повеќе податоци од 10, стопирај пагинација

      setTweets(prev => reset ? data : [...prev, ...data]);
    } catch (error) {
      console.error("Feed error", error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  // LAST ELEMENT OBSERVER (INFINITE SCROLL)
  const lastTweetElementRef = useCallback((node: any) => {
    if (loading || isFetchingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => {
          const nextPage = prevPage + 1;
          loadHomeFeed(nextPage);
          return nextPage;
        });
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, isFetchingMore, hasMore]);

  // ПРЕБАРУВАЊЕ ЛОГИКА
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        try {
          const res = await api.get(`/users/search?q=${searchQuery}`);
          setSearchResults(res.data);
        } catch (err) { console.error("Search error"); }
      } else { setSearchResults([]); }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setCurrentUser(response.data);
    } catch (error) { console.error("User error"); }
  };

  const handlePostTweet = async () => {
    if (!newTweet.trim() && !selectedImage) return;
    setLoading(true);
    try {
      await tweetService.createTweet(newTweet, selectedImage);
      setNewTweet('');
      setSelectedImage(null);
      setImagePreview(null);
      setPage(1);
      setHasMore(true);
      loadHomeFeed(1, true); // Ресетирај го фидот по нов твит
    } catch (error) { alert("Error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="relative w-full">
      <div className="w-full">
        <div className="sticky top-0 bg-[var(--background)]/80 backdrop-blur-md p-4 border-b border-zinc-800 z-20">
          <h1 className="text-xl font-bold"></h1>
        </div>

        {/* Input Area */}
        <div className="p-4 border-b border-zinc-800 flex space-x-4">
          <div className="h-12 w-12 rounded-full shrink-0 overflow-hidden border border-zinc-700 bg-zinc-800">
             {currentUser?.profileImage ? (
               <img src={currentUser.profileImage} className="w-full h-full object-cover" alt="profile" />
             ) : (
               <div className="w-full h-full bg-[#1d9bf0] flex items-center justify-center text-white font-bold text-lg uppercase">
                 {currentUser?.name ? currentUser.name[0] : currentUser?.username?.[0] || '?'}
               </div>
             )}
          </div>
          <div className="flex-1">
            <textarea 
              className="w-full text-xl outline-none bg-transparent resize-none placeholder-zinc-600 mt-2 text-[var(--foreground)]" 
              placeholder="Што би сакал да споделиш?" rows={2} value={newTweet}
              onChange={(e) => setNewTweet(e.target.value)}
            />
            {imagePreview && (
              <div className="relative my-2">
                <button onClick={() => setImagePreview(null)} className="absolute top-2 left-2 bg-black/50 p-1 rounded-full text-white z-10"><X size={16}/></button>
                <img src={imagePreview} className="rounded-2xl w-full max-h-[500px] object-cover border border-zinc-800" alt="preview" />
              </div>
            )}
            <div className="flex justify-between items-center border-t border-zinc-800 pt-3 mt-2">
              <button onClick={() => fileInputRef.current?.click()} className="text-blue-500 hover:bg-blue-500/10 p-2 rounded-full transition"><ImageIcon size={20}/></button>
              <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if(file) { setSelectedImage(file); setImagePreview(URL.createObjectURL(file)); }
              }} />
              <button onClick={handlePostTweet} disabled={loading} className="bg-blue-500 text-white px-6 py-1.5 rounded-full font-bold hover:bg-blue-600 transition disabled:opacity-50">
                {loading ? '...' : 'Твитни'}
              </button>
            </div>
          </div>
        </div>

        {/* Feed со пагинација */}
        <div className="flex flex-col w-full pb-20">
          {tweets.map((tweet: any, index: number) => {
            if (tweets.length === index + 1) {
              // Закачи го референтот на последниот елемент
              return (
                <div ref={lastTweetElementRef} key={tweet.id}>
                  <TweetCard tweet={tweet} currentUser={currentUser} onRefresh={() => loadHomeFeed(1, true)} />
                </div>
              );
            } else {
              return <TweetCard key={tweet.id} tweet={tweet} currentUser={currentUser} onRefresh={() => loadHomeFeed(1, true)} />;
            }
          })}
          
          {isFetchingMore && (
            <div className="p-4 text-center text-zinc-500">Вчитувам уште твитови...</div>
          )}
        </div>
      </div>

      {/* Секција за пребарување */}
<div className="hidden lg:block absolute left-full top-0 ml-10 w-[350px]">
  <div className="sticky top-2">
    
    {/* Search Input Container */}
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search size={18} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
      </div>
      <input
        type="text"
        placeholder="Пребарај корисници..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-background border border-input hover:border-accent focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-background py-3 pl-12 pr-4 rounded-full outline-none text-sm transition-all text-foreground placeholder:text-muted-foreground"
      />

      {/* Резултати од пребарување */}
      {searchResults.length > 0 && (
        <div className="absolute w-full mt-2 bg-popover border border-border rounded-2xl shadow-lg shadow-black/5 dark:shadow-white/5 overflow-hidden z-50">
          {searchResults.map((user: any) => (
            <Link 
              key={user.id} 
              href={`/profile/${user.username}`}
              className="flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors border-b border-border last:border-none group/item"
            >
              <div className="h-10 w-10 rounded-full overflow-hidden bg-muted shrink-0 border border-border">
                {user.profileImage ? (
                  <img src={user.profileImage} className="w-full h-full object-cover" alt={user.username} />
                ) : (
                  <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground font-bold uppercase text-xs">
                    {user.name?.[0] || user.username?.[0]}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-foreground group-hover/item:text-primary transition-colors">
                  {user.name || user.username}
                </span>
                <span className="text-muted-foreground text-xs">@{user.username}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  </div>
</div>
    </div>
  );
}