// 'use client';
// import { useState } from 'react';
// import { Heart, MessageCircle, Repeat2, Share, Send } from 'lucide-react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { tweetService } from '../services/tweet.service';

// interface TweetCardProps {
//   tweet: any;
//   currentUser: any;
//   onRefresh?: () => void;
// }

// export default function TweetCard({ tweet, currentUser, onRefresh }: TweetCardProps) {
//   const router = useRouter();
//   const [showReplyInput, setShowReplyInput] = useState(false);
//   const [replyText, setReplyText] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const originalAuthor = tweet.retweet?.author || tweet.author;
//   const authorUsername = originalAuthor?.username;
  
//   const isLiked = tweet.likes?.some((like: any) => like.userId === currentUser?.id);
//   const isRetweeted = tweet.retweets?.some((rt: any) => rt.userId === currentUser?.id);

//   const displayContent = tweet.retweet?.content || tweet.content;
//   const displayImage = tweet.image || tweet.retweet?.image;

//   const handleCardClick = () => {
//     router.push(`/tweet/${tweet.id}`);
//   };

//   const handleLike = async (e: React.MouseEvent) => {
//     e.stopPropagation();
//     try {
//       await tweetService.toggleLike(tweet.id);
//       if (onRefresh) onRefresh(); 
//     } catch (error) {
//       console.error("Like error", error);
//     }
//   };

//   const handleRetweet = async (e: React.MouseEvent) => {
//     e.stopPropagation();
//     try {
//       await tweetService.retweet(tweet.id);
//       if (onRefresh) onRefresh();
//     } catch (error) {
//       console.error("Retweet error", error);
//     }
//   };

//   const handleReplySubmit = async (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (!replyText.trim()) return;
//     setIsSubmitting(true);
//     try {
//       await tweetService.createReply(tweet.id, replyText);
//       setReplyText('');
//       setShowReplyInput(false);
//       if (onRefresh) onRefresh();
//     } catch (error) {
//       console.error("Reply error", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleShare = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     navigator.clipboard.writeText(`${window.location.origin}/tweet/${tweet.id}`);
//     alert("Линкот е копиран!");
//   };

//   return (
//     <div 
//       onClick={handleCardClick}
//       className="p-4 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition border-b border-zinc-200 dark:border-zinc-800 bg-transparent cursor-pointer"
//     >
//       {tweet.retweet && (
//         <div className="flex items-center space-x-2 text-zinc-500 text-xs mb-2 ml-10 font-bold">
//           <Repeat2 size={14} />
//           <span>{tweet.author?.name} го ретвитна ова</span>
//         </div>
//       )}

//       <div className="flex space-x-3">
//         <Link 
//           href={`/profile/${authorUsername}`} 
//           onClick={(e) => e.stopPropagation()} 
//           className="h-10 w-10 rounded-full shrink-0 flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-700"
//         >
//           {originalAuthor?.profileImage ? (
//             <img 
//               src={originalAuthor.profileImage} 
//               className="w-full h-full object-cover" 
//               alt={originalAuthor.name}
//             />
//           ) : (
//             <div className="w-full h-full bg-[#1d9bf0] flex items-center justify-center text-white font-bold uppercase text-sm">
//               {originalAuthor?.name ? originalAuthor.name[0] : originalAuthor?.username?.[0] || '?'}
//             </div>
//           )}
//         </Link>

//         <div className="flex-1">
//           <div className="flex space-x-1 items-center">
//             {/* ТУКА: Избришано text-white за да ја користи бојата од темата */}
//             <Link 
//               href={`/profile/${authorUsername}`}
//               onClick={(e) => e.stopPropagation()}
//               className="font-bold hover:underline"
//             >
//               {originalAuthor?.name}
//             </Link>
//             <span className="text-zinc-500 text-sm">@{authorUsername}</span>
//           </div>

//           {/* ТУКА: Избришано text-white за содржината да биде црна во Light Mode */}
//           <p className="mt-1 text-[15px] break-words">
//             {displayContent}
//           </p>

//           {displayImage && (
//             <div className="mt-3 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
//               <img src={displayImage} alt="Content" className="w-full h-auto max-h-[500px] object-cover" />
//             </div>
//           )}
          
//           <div className="flex justify-between mt-3 max-w-md text-zinc-500">
//             <button 
//               onClick={(e) => { e.stopPropagation(); setShowReplyInput(!showReplyInput); }} 
//               className="flex items-center space-x-2 group hover:text-blue-500 transition"
//             >
//               <div className="p-2 group-hover:bg-blue-500/10 rounded-full"><MessageCircle size={18} /></div>
//               <span className="text-sm">{tweet._count?.replies || 0}</span>
//             </button>

//             <button 
//               onClick={handleRetweet} 
//               className={`flex items-center space-x-2 group transition ${isRetweeted ? 'text-green-500' : 'hover:text-green-500'}`}
//             >
//               <div className="p-2 group-hover:bg-green-500/10 rounded-full"><Repeat2 size={18} /></div>
//               <span className="text-sm">{tweet._count?.retweets || 0}</span>
//             </button>

//             <button 
//               onClick={handleLike} 
//               className={`flex items-center space-x-2 group transition ${isLiked ? 'text-pink-600' : 'hover:text-pink-500'}`}
//             >
//               <div className="p-2 group-hover:bg-pink-500/10 rounded-full">
//                 <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
//               </div>
//               <span className="text-sm">{tweet._count?.likes || 0}</span>
//             </button>

//             <button 
//               onClick={handleShare}
//               className="p-2 hover:bg-blue-500/10 hover:text-blue-500 rounded-full transition"
//             >
//               <Share size={18} />
//             </button>
//           </div>

//           {showReplyInput && (
//             <div className="mt-4 flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
//               <input 
//                 autoFocus
//                 type="text"
//                 placeholder="Твитни го твојот одговор"
//                 className="flex-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
//                 value={replyText}
//                 onChange={(e) => setReplyText(e.target.value)}
//               />
//               <button 
//                 onClick={handleReplySubmit} 
//                 disabled={isSubmitting || !replyText.trim()} 
//                 className="p-2 bg-blue-500 text-white rounded-full disabled:opacity-50"
//               >
//                 <Send size={16} />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';
import { useState } from 'react';
import { Heart, MessageCircle, Repeat2, Share, Send, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { tweetService } from '../services/tweet.service';

interface TweetCardProps {
  tweet: any;
  currentUser: any;
  onRefresh?: () => void;
}

export default function TweetCard({ tweet, currentUser, onRefresh }: TweetCardProps) {
  const router = useRouter();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const originalAuthor = tweet.retweet?.author || tweet.author;
  const authorUsername = originalAuthor?.username;
  
  const isOwner = currentUser && originalAuthor && String(currentUser.id) === String(originalAuthor.id);

  const isLiked = tweet.likes?.some((like: any) => String(like.userId) === String(currentUser?.id));
  const isRetweeted = tweet.retweets?.some((rt: any) => String(rt.userId) === String(currentUser?.id));

  const displayContent = tweet.retweet?.content || tweet.content;
  const displayImage = tweet.image || tweet.retweet?.image;

  const handleCardClick = () => {
    router.push(`/tweet/${tweet.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Дали сте сигурни дека сакате да го избришете овој твит?")) return;

    try {
      await tweetService.deleteTweet(tweet.id);
      if (onRefresh) onRefresh(); 
    } catch (error: any) {
      console.error("Delete error", error);
      alert("Грешка при бришење на твитот.");
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await tweetService.toggleLike(tweet.id);
      if (onRefresh) onRefresh(); 
    } catch (error) {
      console.error("Like error", error);
    }
  };

  const handleRetweet = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await tweetService.retweet(tweet.id);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Retweet error", error);
    }
  };

  const handleReplySubmit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    try {
      await tweetService.createReply(tweet.id, replyText);
      setReplyText('');
      setShowReplyInput(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Reply error", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/tweet/${tweet.id}`);
    alert("Линкот е копиран!");
  };

  return (
    <div 
      onClick={handleCardClick}
      className="p-4 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition border-b border-zinc-200 dark:border-zinc-800 bg-transparent cursor-pointer relative group"
    >
      {isOwner && (
        <button 
          onClick={handleDelete}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition z-20"
          title="Избриши твит"
        >
          <Trash2 size={18} />
        </button>
      )}

      {tweet.retweet && (
        <div className="flex items-center space-x-2 text-zinc-500 text-xs mb-2 ml-10 font-bold">
          <Repeat2 size={14} />
          <span>{tweet.author?.name} го ретвитна ова</span>
        </div>
      )}

      <div className="flex space-x-3">
        <Link 
          href={`/profile/${authorUsername}`} 
          onClick={(e) => e.stopPropagation()} 
          className="h-10 w-10 rounded-full shrink-0 flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-700"
        >
          {originalAuthor?.profileImage ? (
            <img 
              src={originalAuthor.profileImage} 
              className="w-full h-full object-cover" 
              alt={originalAuthor.name}
            />
          ) : (
            <div className="w-full h-full bg-[#1d9bf0] flex items-center justify-center text-white font-bold uppercase text-sm">
              {originalAuthor?.name ? originalAuthor.name[0] : authorUsername?.[0] || '?'}
            </div>
          )}
        </Link>

        <div className="flex-1">
          <div className="flex space-x-1 items-center">
            <Link 
              href={`/profile/${authorUsername}`}
              onClick={(e) => e.stopPropagation()}
              className="font-bold hover:underline text-[var(--foreground)]"
            >
              {originalAuthor?.name}
            </Link>
            <span className="text-zinc-500 text-sm">@{authorUsername}</span>
          </div>

          <p className="mt-1 text-[15px] break-words text-[var(--foreground)]">
            {displayContent}
          </p>

          {displayImage && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <img src={displayImage} alt="Content" className="w-full h-auto max-h-[500px] object-cover" />
            </div>
          )}
          
          <div className="flex justify-between mt-3 max-w-md text-zinc-500">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowReplyInput(!showReplyInput); }} 
              className="flex items-center space-x-2 group hover:text-blue-500 transition"
            >
              <div className="p-2 group-hover:bg-blue-500/10 rounded-full">
                <MessageCircle size={18} />
              </div>
              <span className="text-sm">{tweet._count?.replies || 0}</span>
            </button>

            <button 
              onClick={handleRetweet} 
              className={`flex items-center space-x-2 group transition ${isRetweeted ? 'text-green-500' : 'hover:text-green-500'}`}
            >
              <div className="p-2 group-hover:bg-green-500/10 rounded-full">
                <Repeat2 size={18} />
              </div>
              <span className="text-sm">{tweet._count?.retweets || 0}</span>
            </button>

            <button 
              onClick={handleLike} 
              className={`flex items-center space-x-2 group transition ${isLiked ? 'text-pink-600' : 'hover:text-pink-500'}`}
            >
              <div className="p-2 group-hover:bg-pink-500/10 rounded-full">
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
              </div>
              <span className="text-sm">{tweet._count?.likes || 0}</span>
            </button>

            <button 
              onClick={handleShare}
              className="p-2 hover:bg-blue-500/10 hover:text-blue-500 rounded-full transition"
            >
              <Share size={18} />
            </button>
          </div>

          {showReplyInput && (
            <div className="mt-4 flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
              <input 
                autoFocus
                type="text"
                placeholder="Твитни го твојот одговор"
                className="flex-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-2 text-sm text-[var(--foreground)] outline-none focus:ring-1 focus:ring-blue-500 placeholder-zinc-500"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button 
                onClick={handleReplySubmit} 
                disabled={isSubmitting || !replyText.trim()} 
                className="p-2 bg-blue-500 text-white rounded-full disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}