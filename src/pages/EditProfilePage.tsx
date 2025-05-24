import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { updateProfile, updateEmail } from 'firebase/auth';
import { updateUserProfile, getUserProfile } from '../firebase/users';
import { uploadFile, STORAGE_PATHS } from '../firebase/storage';

const EditProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: currentUser?.displayName || '',
    username: (currentUser as any)?.username || '',
    email: currentUser?.email || '',
    bio: (currentUser as any)?.bio || '',
    avatar: currentUser?.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg',
    avatarFile: null as File | null,
  });
  const [avatarPreview, setAvatarPreview] = useState(form.avatar);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({ ...prev, avatarFile: file }));
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      let avatarUrl = form.avatar;
      // If avatar changed, upload to storage
      if (form.avatarFile) {
        // Check file type and size
        if (!form.avatarFile.type.startsWith('image/')) {
          throw new Error('Only image files are allowed for avatar.');
        }
        if (form.avatarFile.size > 5 * 1024 * 1024) {
          throw new Error('Avatar image must be less than 5MB.');
        }
        const uploadPath = STORAGE_PATHS.USER_PROFILE(currentUser.uid);
        console.log('Uploading avatar to:', uploadPath, 'File:', form.avatarFile);
        try {
          const uploaded = await uploadFile(
            form.avatarFile,
            uploadPath
          );
          avatarUrl = uploaded.url;
          console.log('Avatar uploaded. URL:', avatarUrl);
        } catch (uploadErr) {
          console.error('Avatar upload error:', uploadErr);
          throw new Error('Failed to upload avatar: ' + (uploadErr as any)?.message);
        }
      }
      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        displayName: form.name,
        photoURL: avatarUrl,
      });
      if (form.email !== currentUser.email) {
        await updateEmail(currentUser, form.email);
      }
      // Update Firestore user profile
      await updateUserProfile(currentUser.uid, {
        displayName: form.name,
        username: form.username,
        bio: form.bio,
        avatarUrl,
        email: form.email,
      });
      // Fetch updated Firestore profile and redirect
      const updatedProfile = await getUserProfile(currentUser.uid);
      if (updatedProfile?.username) {
        navigate(`/${updatedProfile.username}`);
      } else {
        navigate('/profile');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-gray-800/80 rounded-2xl shadow-2xl border border-gray-700/60 p-10 flex flex-col items-center"
      >
        {/* Avatar Upload */}
        <div className="relative mb-6">
          <img
            src={avatarPreview}
            alt="Avatar Preview"
            className="w-40 h-40 rounded-full object-cover border-4 border-purple-600 shadow-lg"
          />
          <button
            type="button"
            onClick={handleAvatarClick}
            className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg border-2 border-white"
            title="Change Avatar"
          >
            <Camera className="h-6 w-6" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        {/* Form Fields */}
        <div className="w-full flex flex-col gap-5">
          <div>
            <label className="block text-gray-300 font-semibold mb-1" htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-300 font-semibold mb-1" htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-300 font-semibold mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-300 font-semibold mb-1" htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none"
              placeholder="Tell us about yourself, your music, or your favorite DAW..."
              disabled={loading}
            />
          </div>
        </div>
        {/* Error Message */}
        {error && <div className="text-red-400 mt-4 text-center w-full">{error}</div>}
        {/* Buttons */}
        <div className="flex w-full gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-semibold shadow-lg transition-all"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage; 