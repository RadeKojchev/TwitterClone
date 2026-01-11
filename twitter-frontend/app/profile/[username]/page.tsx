'use client';
import { useEffect, useState, use } from 'react';
import { tweetService } from '../../../src/services/tweet.service';
import { userService } from '../../../src/services/user.service';
import TweetCard from '../../../src/components/TweetCard';
import EditProfileModal from '../../../src/components/EditProfileModal';
import api from '../../../src/lib/axios';

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const unwrappedParams = use(params);
  const username = unwrappedParams.username;

  const [user, setUser] = useState<any>(null);
  const [tweets, setTweets] = useState<any[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingTweets, setLoadingTweets] = useState(false);

  useEffect(() => {
    loadProfileData();
    fetchLoggedInUser();
  }, [username]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const userData = await userService.getUserProfile(username);
      setUser(userData);
      setIsFollowing(userData.isFollowedByMe);
      fetchUserTweets();
    } catch (error) {
      console.error("Грешка при вчитување профил:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTweets = async () => {
    try {
      setLoadingTweets(true);
      const data = await tweetService.getUserTweets(username); 
      setTweets(data);
    } catch (err) {
      console.error("Грешка при вчитување твитови на профилот", err);
    } finally {
      setLoadingTweets(false);
    }
  };

  const fetchLoggedInUser = async () => {
    try {
      const res = await api.get('/users/me'); 
      setLoggedInUser(res.data);
    } catch (err) {
      console.error("Грешка при вчитување на најавениот корисник");
    }
  };

  const handleFollowToggle = async () => {
    if (!user || !loggedInUser) return;
    try {
      await userService.followUser(user.id);
      setIsFollowing(!isFollowing);
      setUser((prev: any) => ({
        ...prev,
        _count: {
          ...prev._count,
          followers: isFollowing ? prev._count.followers - 1 : prev._count.followers + 1
        }
      }));
    } catch (error) {
      console.error("Грешка при follow/unfollow");
    }
  };

  if (loading && !user) return <div className="p-10 text-white text-center">Се вчитува профил...</div>;
  if (!user) return <div className="p-10 text-white text-center">Корисникот не е пронајден.</div>;

  const isOwnProfile = loggedInUser?.username === username;

  // ФИЛТРИРАЊЕ НА ОДГОВОРИТЕ: Гледаме само твитови кои немаат parentId
  const mainTweetsOnly = tweets.filter((t: any) => t.parentId === null);

  return (
    <div className="min-h-screen bg-transparent border-x border-zinc-800">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md p-3 border-b border-zinc-800 z-10">
        <h1 className="text-xl font-bold text-white">{user.name}</h1>
        <p className="text-sm text-gray-500">{user._count?.tweets || 0} твитови</p>
      </div>

      {/* Banner & Avatar Section */}
      <div className="relative">
        <div className="h-44 bg-zinc-800 overflow-hidden">
          {user.coverImage && <img src={user.coverImage} className="w-full h-full object-cover" alt="Cover" />}
        </div>
        <div className="absolute -bottom-16 left-4">
          {/* ПОПРАВКА 1: Променета позадина во сина (bg-[#1d9bf0]) */}
          <div className="h-32 w-32 rounded-full border-4 border-black bg-[#1d9bf0] flex items-center justify-center text-white text-4xl font-bold overflow-hidden shadow-sm uppercase">
            {user.profileImage ? (
              <img src={user.profileImage} className="w-full h-full object-cover" alt="Avatar" />
            ) : (
              user.name ? user.name[0] : user.username[0]
            )}
          </div>
        </div>
      </div>

      {/* Profile Actions */}
      <div className="flex justify-end p-4 pt-2">
        {isOwnProfile ? (
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="border border-zinc-700 px-4 py-2 rounded-full font-bold hover:bg-zinc-900 transition text-white"
          >
            Модифицирај
          </button>
        ) : (
          <button 
            onClick={handleFollowToggle}
            className={`px-6 py-2 rounded-full font-bold transition ${
              isFollowing 
                ? 'border border-zinc-700 text-white hover:border-red-500 hover:text-red-500 hover:bg-red-500/10' 
                : 'bg-white text-black hover:opacity-90'
            }`}
          >
            {isFollowing ? 'Следиш' : 'Заследи'}
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 mt-8 space-y-1">
        <h2 className="text-xl font-bold text-white">{user.name}</h2>
        <p className="text-gray-500">@{user.username}</p>
        {user.bio && <p className="text-white mt-3 whitespace-pre-wrap">{user.bio}</p>}
        <div className="flex space-x-4 pt-3 text-sm">
          <span className="hover:underline cursor-pointer text-white">
            <strong className="font-bold">{user._count?.following || 0}</strong> <span className="text-gray-500">Following</span>
          </span>
          <span className="hover:underline cursor-pointer text-white">
            <strong className="font-bold">{user._count?.followers || 0}</strong> <span className="text-gray-500">Followers</span>
          </span>
        </div>
      </div>

      {/* Tweets Feed */}
      <div className="mt-6 border-t border-zinc-800 pb-20">
        <div className="flex border-b border-zinc-800">
           <div className="px-6 py-4 text-sm font-bold border-b-4 border-blue-500 text-white">Tвитови</div>
        </div>
        
        {/* ПОПРАВКА 2: Користиме mainTweetsOnly наместо сите tweets */}
        {mainTweetsOnly.length > 0 ? (
          mainTweetsOnly.map((tweet: any) => (
            <TweetCard 
              key={tweet.id} 
              tweet={tweet} 
              currentUser={loggedInUser} 
              onRefresh={loadProfileData} 
            />
          ))
        ) : (
          !loadingTweets && <div className="p-10 text-center text-gray-500 italic">Сè уште нема објави.</div>
        )}
        
        {loadingTweets && <div className="p-4 text-center text-gray-500">Се вчитава...</div>}
      </div>

      {isEditModalOpen && (
        <EditProfileModal 
          user={user} 
          onClose={() => setIsEditModalOpen(false)} 
          onRefresh={loadProfileData} 
        />
      )}
    </div>
  );
}