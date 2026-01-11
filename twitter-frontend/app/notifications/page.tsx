// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Bell, Heart, UserPlus, MessageCircle, ArrowLeft } from 'lucide-react';
// import { notificationService } from '@/services/notification.service'; // провери ја патеката

// export default function NotificationsPage() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     loadNotifications();
//   }, []);

//   const loadNotifications = async () => {
//     try {
//       const data = await notificationService.getNotifications();
//       setNotifications(data);
//       // Означи ги како прочитани штом корисникот ќе ја отвори страната
//       await notificationService.markAllAsRead();
//     } catch (err) {
//       console.error("Грешка при вчитување на известувањата", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNotificationClick = (n: any) => {
//     if (n.type === 'FOLLOW') {
//       router.push(`/profile/${n.issuer?.username}`);
//     } else if (n.tweetId) {
//       router.push(`/tweet/${n.tweetId}`);
//     }
//   };

//   const getIcon = (type: string) => {
//     switch (type) {
//       case 'LIKE': return <Heart size={24} className="text-pink-600 fill-pink-600" />;
//       case 'FOLLOW': return <UserPlus size={24} className="text-[#1d9bf0]" />;
//       case 'REPLY': return <MessageCircle size={24} className="text-green-500" />;
//       default: return <Bell size={24} />;
//     }
//   };

//   if (loading) return <div className="p-10 text-center text-gray-500">Се вчитува...</div>;

//   return (
//     <div className="min-h-screen border-r border-zinc-800 max-w-2xl w-full bg-black text-white">
//       {/* Header */}
//       <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md p-4 border-b border-zinc-800 flex items-center space-x-6">
//         <button onClick={() => router.back()} className="hover:bg-zinc-900 p-2 rounded-full transition">
//           <ArrowLeft size={20} />
//         </button>
//         <h1 className="text-xl font-bold">Notifications</h1>
//       </div>

//       {notifications.length === 0 ? (
//         <div className="p-10 text-center text-gray-500">Немате нови известувања.</div>
//       ) : (
//         <div className="flex flex-col">
//           {notifications.map((n: any) => (
//             <div 
//               key={n.id} 
//               onClick={() => handleNotificationClick(n)}
//               className="p-4 border-b border-zinc-800 hover:bg-zinc-900/50 transition cursor-pointer flex space-x-4"
//             >
//               <div className="mt-1">{getIcon(n.type)}</div>
              
//               <div className="flex-1">
//                 {/* Слика на иницијаторот */}
//                 <div className="flex items-center space-x-2 mb-1">
//                   <img 
//                     src={n.issuer?.profileImage || '/default-avatar.png'} 
//                     alt="avatar"
//                     className="h-8 w-8 rounded-full object-cover border border-zinc-700"
//                     onError={(e: any) => e.target.src = '/default-avatar.png'}
//                   />
//                   <div className="flex flex-col">
//                     <span className="font-bold hover:underline">
//                       {n.issuer?.name || "Непознат корисник"}
//                     </span>
//                     <span className="text-gray-500 text-sm italic">
//                       @{n.issuer?.username}
//                     </span>
//                   </div>
//                 </div>
                
//                 {/* Текст на акцијата */}
//                 <p className="text-[15px] mt-1 text-gray-200">
//                   {n.type === 'LIKE' && 'го лајкна твојот твит'}
//                   {n.type === 'FOLLOW' && 'те заследи'}
//                   {n.type === 'REPLY' && 'одговори на твојот твит'}
//                 </p>

//                 {/* Ако има твит, прикажи мал дел од содржината */}
//                 {n.tweet && (
//                   <p className="text-gray-500 text-sm mt-2 line-clamp-1 italic border-l-2 border-zinc-700 pl-2">
//                     "{n.tweet.content}"
//                   </p>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Heart, UserPlus, MessageCircle, ArrowLeft } from 'lucide-react';
import { notificationService } from '@/services/notification.service';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
      await notificationService.markAllAsRead();
    } catch (err) {
      console.error("Грешка при вчитување на известувањата", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (n: any) => {
    if (n.type === 'FOLLOW') {
      router.push(`/profile/${n.issuer?.username}`);
    } else if (n.tweetId) {
      router.push(`/tweet/${n.tweetId}`);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'LIKE': return <Heart size={24} className="text-pink-600 fill-pink-600" />;
      case 'FOLLOW': return <UserPlus size={24} className="text-[#1d9bf0]" />;
      case 'REPLY': return <MessageCircle size={24} className="text-green-500" />;
      default: return <Bell size={24} />;
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500 font-medium">Се вчитува...</div>;

  return (
    <div className="min-h-screen border-r border-zinc-800 max-w-2xl w-full bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md p-4 border-b border-zinc-800 flex items-center space-x-6">
        <button onClick={() => router.back()} className="hover:bg-zinc-900 p-2 rounded-full transition">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Notifications</h1>
      </div>

      {notifications.length === 0 ? (
        <div className="p-10 text-center text-gray-500">Немате нови известувања.</div>
      ) : (
        <div className="flex flex-col">
          {notifications.map((n: any) => (
            <div 
              key={n.id} 
              onClick={() => handleNotificationClick(n)}
              className="p-4 border-b border-zinc-800 hover:bg-zinc-900/50 transition cursor-pointer flex space-x-4"
            >
              {/* Лева страна: Икона за тип на нотификација */}
              <div className="mt-1">{getIcon(n.type)}</div>
              
              {/* Десна страна: Содржина */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  
                  {/* АВАТАР ЛОГИКА - Го заменува претходниот <img> таг */}
                  {n.issuer?.profileImage ? (
                    <img
                      src={n.issuer.profileImage}
                      alt={n.issuer.name}
                      className="h-8 w-8 rounded-full object-cover border border-zinc-700"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[#1d9bf0] flex items-center justify-center text-white font-bold text-sm uppercase border border-zinc-700">
                      {n.issuer?.name ? n.issuer.name[0] : n.issuer?.username?.[0] || '?'}
                    </div>
                  )}

                  <div className="flex flex-col">
                    <span className="font-bold hover:underline leading-none">
                      {n.issuer?.name || "Непознат корисник"}
                    </span>
                    <span className="text-gray-500 text-xs mt-0.5">
                      @{n.issuer?.username}
                    </span>
                  </div>
                </div>
                
                {/* Текст на акцијата */}
                <p className="text-[15px] mt-1 text-gray-200">
                  {n.type === 'LIKE' && 'го лајкна твојот твит'}
                  {n.type === 'FOLLOW' && 'те заследи'}
                  {n.type === 'REPLY' && 'одговори на твојот твит'}
                </p>

                {/* Рендерирање на содржина од твит ако постои */}
                {n.tweet && (
                  <p className="text-gray-500 text-sm mt-2 line-clamp-1 italic border-l-2 border-zinc-700 pl-2">
                    "{n.tweet.content}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}