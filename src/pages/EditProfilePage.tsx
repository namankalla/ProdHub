<<<<<<< Updated upstream
import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { updateProfile, updateEmail } from 'firebase/auth';
import { updateUserProfile, getUserProfile } from '../firebase/users';
import { uploadFile, STORAGE_PATHS } from '../firebase/storage';
=======
import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Camera, X } from 'lucide-react';
import { updateProfile, updateEmail } from 'firebase/auth';
import { updateUserProfile, getUserProfile } from '../firebase/users';
import { uploadFile, STORAGE_PATHS, deleteFile } from '../firebase/storage';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
>>>>>>> Stashed changes

const EditProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
<<<<<<< Updated upstream
    name: currentUser?.displayName || '',
    username: (currentUser as any)?.username || '',
    email: currentUser?.email || '',
    bio: (currentUser as any)?.bio || '',
    avatar: currentUser?.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg',
=======
    name: '',
    username: '',
    email: '',
    bio: '',
    avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
>>>>>>> Stashed changes
    avatarFile: null as File | null,
  });
  const [avatarPreview, setAvatarPreview] = useState(form.avatar);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
<<<<<<< Updated upstream
  const fileInputRef = useRef<HTMLInputElement>(null);
=======
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Load user data when component mounts
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        try {
          const userProfile = await getUserProfile(currentUser.uid);
          if (userProfile) {
            setForm(prev => ({
              ...prev,
              name: userProfile.displayName || currentUser.displayName || '',
              username: userProfile.username || '',
              email: userProfile.email || currentUser.email || '',
              bio: userProfile.bio || '',
              avatar: userProfile.avatarUrl || currentUser.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg',
            }));
            setAvatarPreview(userProfile.avatarUrl || currentUser.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg');
          }
        } catch (err) {
          console.error('Error loading user profile:', err);
          setError('Failed to load profile data');
        }
      }
    };
    loadUserData();
  }, [currentUser]);

  // Function to create a circular crop
  function centerAspectCrop(mediaWidth: number, mediaHeight: number) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 100,
        },
        1,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  }

  // Function to get cropped image
  async function getCroppedImg(
    imageSrc: string,
    pixelCrop: PixelCrop
  ): Promise<File> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    // Set canvas size to match the crop
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw the cropped image
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        // Create a File object from the blob
        const file = new File([blob], 'cropped-avatar.jpg', { type: 'image/jpeg' });
        resolve(file);
      }, 'image/jpeg');
    });
  }

  // Helper function to create an image element
  function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });
  }
>>>>>>> Stashed changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

<<<<<<< Updated upstream
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({ ...prev, avatarFile: file }));
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
=======
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type and size
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed for avatar.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Avatar image must be less than 5MB.');
      return;
    }

    // Create preview URL and show crop modal
    const reader = new FileReader();
    reader.onload = (ev) => {
      const previewUrl = ev.target?.result as string;
      setSelectedImage(previewUrl);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async () => {
    if (!selectedImage || !completedCrop) return;

    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);

      // Get cropped image file
      const croppedFile = await getCroppedImg(selectedImage, completedCrop);
      
      // Delete previous avatar if it exists and is not the default
      const currentAvatarUrl = form.avatar;
      if (currentAvatarUrl && 
          !currentAvatarUrl.includes('randomuser.me') && 
          !currentAvatarUrl.includes('firebasestorage.app')) {
        try {
          console.log('Deleting previous avatar...');
          const previousPath = STORAGE_PATHS.USER_PROFILE(currentUser!.uid);
          await deleteFile(previousPath);
          console.log('Previous avatar deleted successfully');
        } catch (deleteErr) {
          console.warn('Failed to delete previous avatar:', deleteErr);
        }
      }

      // Upload cropped image
      const uploadPath = STORAGE_PATHS.USER_PROFILE(currentUser!.uid);
      const uploaded = await uploadFile(
        croppedFile,
        uploadPath,
        (progress) => {
          console.log('Upload progress:', progress);
          setUploadProgress(progress);
        }
      );

      // Update profiles
      await updateProfile(currentUser!, {
        photoURL: uploaded.url
      });

      await updateUserProfile(currentUser!.uid, {
        avatarUrl: uploaded.url
      });

      // Update states
      setForm(prev => ({
        ...prev,
        avatar: uploaded.url,
        avatarFile: croppedFile
      }));
      setAvatarPreview(uploaded.url);
      setShowCropModal(false);
      setSelectedImage(null);

    } catch (err: any) {
      console.error('Avatar upload error:', err);
      setError(err.message || 'Failed to upload avatar');
      setAvatarPreview(form.avatar);
    } finally {
      setLoading(false);
      setUploadProgress(0);
>>>>>>> Stashed changes
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< Updated upstream
    if (!currentUser) return;
    setLoading(true);
    setError(null);
=======
    if (!currentUser) {
      console.error('No current user found');
      setError('You must be logged in to update your profile');
      return;
    }
    setLoading(true);
    setError(null);
    setUploadProgress(0);
>>>>>>> Stashed changes
    try {
      let avatarUrl = form.avatar;
      // If avatar changed, upload to storage
      if (form.avatarFile) {
<<<<<<< Updated upstream
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
=======
        console.log('Starting avatar upload process...');
        // Check file type and size
        if (!form.avatarFile.type.startsWith('image/')) {
          console.error('Invalid file type:', form.avatarFile.type);
          throw new Error('Only image files are allowed for avatar.');
        }
        if (form.avatarFile.size > 5 * 1024 * 1024) {
          console.error('File too large:', form.avatarFile.size);
          throw new Error('Avatar image must be less than 5MB.');
        }
        const uploadPath = STORAGE_PATHS.USER_PROFILE(currentUser.uid);
        console.log('Upload details:', {
          path: uploadPath,
          fileType: form.avatarFile.type,
          fileSize: form.avatarFile.size,
          fileName: form.avatarFile.name,
          userId: currentUser.uid
        });
        try {
          const uploaded = await uploadFile(
            form.avatarFile,
            uploadPath,
            (progress) => {
              console.log('Upload progress:', progress);
              setUploadProgress(progress);
            }
          );
          avatarUrl = uploaded.url;
          console.log('Avatar upload successful. URL:', avatarUrl);
        } catch (uploadErr) {
          console.error('Avatar upload error details:', {
            error: uploadErr,
            message: (uploadErr as any)?.message,
            code: (uploadErr as any)?.code,
            name: (uploadErr as any)?.name
          });
          throw new Error('Failed to upload avatar: ' + (uploadErr as any)?.message);
        }
      }

>>>>>>> Stashed changes
      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        displayName: form.name,
        photoURL: avatarUrl,
      });
<<<<<<< Updated upstream
      if (form.email !== currentUser.email) {
        await updateEmail(currentUser, form.email);
      }
=======

      if (form.email !== currentUser.email) {
        await updateEmail(currentUser, form.email);
      }

>>>>>>> Stashed changes
      // Update Firestore user profile
      await updateUserProfile(currentUser.uid, {
        displayName: form.name,
        username: form.username,
        bio: form.bio,
        avatarUrl,
        email: form.email,
      });
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
            onError={(e) => {
              console.error('Error loading avatar image');
              e.currentTarget.src = 'https://randomuser.me/api/portraits/lego/1.jpg';
            }}
>>>>>>> Stashed changes
          />
          <button
            type="button"
            onClick={handleAvatarClick}
<<<<<<< Updated upstream
            className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg border-2 border-white"
            title="Change Avatar"
=======
            className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg border-2 border-white disabled:opacity-50 disabled:cursor-not-allowed"
            title="Change Avatar"
            disabled={loading}
>>>>>>> Stashed changes
          >
            <Camera className="h-6 w-6" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleAvatarChange}
<<<<<<< Updated upstream
          />
        </div>
=======
            disabled={loading}
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
              <div className="text-white text-sm font-medium">
                {uploadProgress > 0 ? `${uploadProgress}%` : 'Uploading...'}
              </div>
            </div>
          )}
        </div>

        {/* Crop Modal */}
        {showCropModal && selectedImage && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-lg font-semibold">Crop Your Avatar</h3>
                <button
                  onClick={() => setShowCropModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="relative">
                <ReactCrop
                  crop={crop}
                  onChange={(c: Crop) => setCrop(c)}
                  onComplete={(c: PixelCrop) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                >
                  <img
                    ref={imgRef}
                    src={selectedImage}
                    alt="Crop preview"
                    className="max-h-[60vh] mx-auto"
                    onLoad={(e) => {
                      const { width, height } = e.currentTarget;
                      setCrop(centerAspectCrop(width, height));
                    }}
                  />
                </ReactCrop>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCropModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCropComplete}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={loading}
                >
                  {loading ? 'Uploading...' : 'Apply & Upload'}
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="w-full mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        {/* Error Message */}
        {error && <div className="text-red-400 mt-4 text-center w-full">{error}</div>}
=======
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
export default EditProfilePage; 
=======
export default EditProfilePage;
>>>>>>> Stashed changes
