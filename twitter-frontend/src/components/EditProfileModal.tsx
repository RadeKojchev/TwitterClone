'use client';
import { useState, useRef } from 'react';
import { X, Camera } from 'lucide-react';
import { userService } from '../services/user.service';

export default function EditProfileModal({ user, onClose, onRefresh }: any) {
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [loading, setLoading] = useState(false);

  // Состојби за преглед на слики
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(user.profileImage);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState(user.coverImage);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);
      if (avatarFile) formData.append('profileImage', avatarFile);
      if (coverFile) formData.append('coverImage', coverFile);

      // Повикуваме ажурирање (осигурај се дека користиш PATCH /users/profile)
      await userService.updateProfile(formData);
      onRefresh();
      onClose();
    } catch (error) {
      alert("Грешка при зачувување");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-[var(--background)] w-full max-w-lg rounded-2xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center space-x-4">
            <button onClick={onClose} className="p-2 hover:bg-gray-200/50 dark:hover:bg-zinc-900 rounded-full">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-[var(--foreground)]">Edit Profile</h2>
          </div>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-[var(--foreground)] text-[var(--background)] px-4 py-1.5 rounded-full font-bold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>

        <div className="overflow-y-auto max-h-[80vh]">
          {/* Cover Image Selection */}
          <div 
            className="h-32 bg-gray-300 dark:bg-zinc-800 relative cursor-pointer group"
            onClick={() => coverInputRef.current?.click()}
          >
            {coverPreview && <img src={coverPreview} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition">
              <Camera className="text-white" size={30} />
            </div>
            <input type="file" hidden ref={coverInputRef} accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setCoverFile(file);
                setCoverPreview(URL.createObjectURL(file));
              }
            }} />
          </div>

          {/* Avatar Image Selection */}
          <div className="px-4 relative -mt-12 mb-8">
            <div 
              className="h-24 w-24 rounded-full border-4 border-[var(--background)] bg-blue-500 relative cursor-pointer group overflow-hidden"
              onClick={() => avatarInputRef.current?.click()}
            >
              {avatarPreview ? (
                <img src={avatarPreview} className="w-full h-full object-cover" />
              ) : <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">{name[0]}</div>}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition">
                <Camera className="text-white" size={24} />
              </div>
            </div>
            <input type="file" hidden ref={avatarInputRef} accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setAvatarFile(file);
                setAvatarPreview(URL.createObjectURL(file));
              }
            }} />
          </div>

          {/* Inputs */}
          <div className="p-4 space-y-4">
            <div className="border border-[var(--border)] rounded p-2 focus-within:ring-2 ring-blue-500">
              <label className="text-xs text-gray-500">Name</label>
              <input 
                className="w-full bg-transparent outline-none text-[var(--foreground)]"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="border border-[var(--border)] rounded p-2 focus-within:ring-2 ring-blue-500">
              <label className="text-xs text-gray-500">Bio</label>
              <textarea 
                className="w-full bg-transparent outline-none text-[var(--foreground)] resize-none"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}