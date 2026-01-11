// 'use client';
// import { useEffect, useState, use } from 'react';
// import { tweetService } from '../../../src/services/tweet.service';
// import TweetCard from '../../../src/components/TweetCard';
// import { useRouter } from 'next/navigation';
// import { ArrowLeft } from 'lucide-react';

// export default function TweetDetails({ params }: { params: Promise<{ id: string }> }) {
//   // Го отпакуваме ID-то од URL-то
//   const unwrappedParams = use(params);
//   const tweetId = unwrappedParams.id;

//   const [mainTweet, setMainTweet] = useState<any>(null);
//   const [replies, setReplies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     loadTweetDetails();
//   }, [tweetId]);

//   const loadTweetDetails = async () => {
//     try {
//       setLoading(true);
//       // Овој метод ќе го додадеме во tweetService во следниот чекор
//       const data = await tweetService.getTweetWithReplies(tweetId);
//       setMainTweet(data.tweet);
//       setReplies(data.replies);
//     } catch (error) {
//       console.error("Грешка при вчитување детали:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="p-10 text-center text-black">Се вчитува...</div>;
//   if (!mainTweet) return <div className="p-10 text-center text-black">Твитот не е најден.</div>;

//   return (
//     <div className="max-w-2xl mx-auto min-h-screen border-x border-gray-100 bg-white">
//       {/* Навигација назад */}
//       <div className="sticky top-0 bg-white/80 backdrop-blur-md p-4 border-b border-gray-100 z-10 flex items-center space-x-6">
//         <button 
//           onClick={() => router.back()} 
//           className="hover:bg-gray-100 p-2 rounded-full text-black transition"
//         >
//           <ArrowLeft size={20} />
//         </button>
//         <h1 className="text-xl font-bold text-black">Објава</h1>
//       </div>

//       {/* Приказ на главниот твит */}
//       <TweetCard tweet={mainTweet} onRefresh={loadTweetDetails} />

//       {/* Секција за одговори */}
//       <div className="border-t-8 border-gray-50">
//         <div className="p-4 font-bold text-gray-900 border-b border-gray-100">Одговори</div>
//         {replies.length > 0 ? (
//           replies.map((reply: any) => (
//             <TweetCard key={reply.id} tweet={reply} onRefresh={loadTweetDetails} />
//           ))
//         ) : (
//           <div className="p-10 text-center text-gray-400">Сè уште нема одговори.</div>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';
import { useEffect, useState, use } from 'react';
import { tweetService } from '../../../src/services/tweet.service';
import TweetCard from '../../../src/components/TweetCard';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function TweetDetails({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const tweetId = unwrappedParams.id;

  const [mainTweet, setMainTweet] = useState<any>(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadTweetDetails();
  }, [tweetId]);

  const loadTweetDetails = async () => {
    try {
      setLoading(true);
      const data = await tweetService.getTweetWithReplies(tweetId);
      setMainTweet(data.tweet);
      setReplies(data.replies);
    } catch (error) {
      console.error("Грешка при вчитување детали:", error);
    } finally {
      setLoading(false);
    }
  };

  // Поправен Loading статус со CSS променливи
  if (loading) return (
    <div className="p-10 text-center text-[var(--foreground)] bg-transparent">
      Се вчитува...
    </div>
  );

  if (!mainTweet) return (
    <div className="p-10 text-center text-[var(--foreground)] bg-transparent">
      Твитот не е најден.
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent">
      {/* Навигација назад - Користиме променливи за бои и транспарентна позадина со заматување */}
      <div className="sticky top-0 bg-[var(--background)]/80 backdrop-blur-md p-4 border-b border-[var(--border)] z-10 flex items-center space-x-6">
        <button 
          onClick={() => router.back()} 
          className="hover:bg-gray-200/50 dark:hover:bg-zinc-900 p-2 rounded-full text-[var(--foreground)] transition"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-[var(--foreground)]">Објава</h1>
      </div>

      {/* Приказ на главниот твит - TweetCard е веќе среден и ќе работи сам */}
      <TweetCard tweet={mainTweet} onRefresh={loadTweetDetails} />

      {/* Секција за одговори */}
      <div className="border-t-8 border-[var(--border)] opacity-80">
        {/* Овој дел ја дели главната објава од одговорите со подебела линија */}
      </div>

      <div className="p-4 font-bold text-[var(--foreground)] border-b border-[var(--border)]">
        Одговори
      </div>

      <div className="pb-20">
        {replies.length > 0 ? (
          replies.map((reply: any) => (
            <div key={reply.id} className="border-b border-[var(--border)]">
              <TweetCard tweet={reply} onRefresh={loadTweetDetails} />
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-gray-500">
            Сè уште нема одговори.
          </div>
        )}
      </div>
    </div>
  );
}