import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Check, Paperclip, Smile, Send, X, File, Music2, Video, Image, User, AlertTriangle, ShieldOff, MoreVertical } from 'lucide-react';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { db, storage } from '../firebase/config';
import { collection, addDoc, updateDoc, doc, onSnapshot, query, orderBy, getDocs, writeBatch, setDoc, serverTimestamp, where, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable, UploadTaskSnapshot } from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext';
import { uploadFile, STORAGE_PATHS, StorageFile } from '../firebase/storage';

// Types
interface Message {
  id: string;
  text: string;
  time: string;
  fromMe: boolean;
  status: 'sent' | 'delivered' | 'read';
  mediaType?: 'image' | 'video' | 'audio' | 'file';
  mediaUrl?: string;
  fileName?: string;
  fileSize?: number;
}

interface Chat {
  id: string;
  username: string;
  realName: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  lastMessageStatus: 'sent' | 'delivered';
  messages: Message[];
  files: {
    audio: number;
    video: number;
    file: number;
    picture: number;
  };
  links: {
    url: string;
    time: string;
  }[];
  isGroup: boolean;
  members?: string[];
}

interface GroupMember {
  id: string;
  username: string;
  realName: string;
  avatar: string;
  selected?: boolean;
}

interface FileInfo {
  name: string;
  time: string;
  url?: string;
}

interface SelectedFiles {
  audio: FileInfo[];
  video: FileInfo[];
  file: FileInfo[];
  picture: FileInfo[];
}

// Mock data for users, chats, messages, files, etc.
const mockChats: Chat[] = [
  {
    id: '1',
    username: 'john_doe',
    realName: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    lastMessage: 'Hey, how are you?',
    lastMessageTime: '10:30 AM',
    lastMessageStatus: 'delivered',
    messages: [
      { id: 'm1', text: 'Hey, how are you?', time: '10:30 AM', fromMe: false, status: 'delivered' },
      { id: 'm2', text: 'I am good! You?', time: '10:31 AM', fromMe: true, status: 'delivered' },
    ],
    files: { audio: 0, video: 0, file: 0, picture: 0 },
    links: [
      { url: 'https://example.com', time: 'Yesterday' },
      { url: 'https://github.com', time: 'Today' },
    ],
    isGroup: false,
  },
  {
    id: '2',
    username: 'jane_smith',
    realName: 'Jane Smith',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    lastMessage: 'Let\'s start the project!',
    lastMessageTime: '9:15 AM',
    lastMessageStatus: 'sent',
    messages: [
      { id: 'm1', text: 'Let\'s start the project!', time: '9:15 AM', fromMe: false, status: 'sent' },
    ],
    files: { audio: 0, video: 0, file: 0, picture: 0 },
    links: [],
    isGroup: false,
  },
];

const mockConnects = [
  { id: '3', username: 'alice', realName: 'Alice Wonderland', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
  { id: '4', username: 'bob', realName: 'Bob Builder', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
];

const MessagesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showUserSidebar, setShowUserSidebar] = useState(false);
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentButtons, setShowAttachmentButtons] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<GroupMember[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>(mockConnects);
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFiles>({
    audio: [],
    video: [],
    file: [],
    picture: []
  });

  // File input refs
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fix scroll behavior
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const messagesContainer = messagesEndRef.current.parentElement;
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  };

  // Only scroll on new messages
  useEffect(() => {
    if (selectedChat?.messages.length) {
      const lastMessage = selectedChat.messages[selectedChat.messages.length - 1];
      if (lastMessage.fromMe || lastMessage.status === 'sent') {
        scrollToBottom();
      }
    }
  }, [selectedChat?.messages.length]);

  // Load chats from Firebase
  useEffect(() => {
    if (!currentUser) return;

    const loadChats = async () => {
      try {
        const chatsRef = collection(db, 'chats');
        const q = query(
          chatsRef,
          where('participants', 'array-contains', currentUser.uid),
          orderBy('updatedAt', 'desc')
        );
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const loadedChats = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              username: data.username || '',
              realName: data.realName || '',
              avatar: data.avatar || '',
              lastMessage: data.lastMessage || '',
              lastMessageTime: data.lastMessageTime || '',
              lastMessageStatus: data.lastMessageStatus || 'sent',
              messages: [],
              files: data.files || { audio: 0, video: 0, file: 0, picture: 0 },
              links: data.links || [],
              isGroup: data.isGroup || false,
              members: data.members || []
            } as Chat;
          });
          setChats(loadedChats);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error loading chats:', error);
      }
    };

    loadChats();
  }, [currentUser]);

  // Listen for new messages in selected chat
  useEffect(() => {
    if (!selectedChat || !currentUser) return;

    const messagesRef = collection(db, `chats/${selectedChat.id}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const messageData = change.doc.data();
          const newMessage = {
            id: change.doc.id,
            text: messageData.text,
            time: new Date(messageData.timestamp.toDate()).toLocaleTimeString(),
            fromMe: messageData.senderId === currentUser.uid,
            status: messageData.status,
            mediaType: messageData.mediaType,
            mediaUrl: messageData.mediaUrl,
            fileName: messageData.fileName,
            fileSize: messageData.fileSize
          };

          setSelectedChat(prev => {
            if (!prev) return null;
            const updatedMessages = [...prev.messages, newMessage];
            return {
              ...prev,
              messages: updatedMessages,
              lastMessage: messageData.text,
              lastMessageTime: new Date(messageData.timestamp.toDate()).toLocaleTimeString(),
              lastMessageStatus: messageData.status
            };
          });

          // Mark message as read if it's not from the current user
          if (messageData.senderId !== currentUser.uid) {
            updateDoc(doc(db, `chats/${selectedChat.id}/messages/${change.doc.id}`), {
              status: 'read'
            });
          }
        }
      });
    });

    return () => unsubscribe();
  }, [selectedChat?.id, currentUser]);

  // Handle chat selection
  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    setShowUserSidebar(false);
  };

  // Create a new chat
  const createNewChat = async (userId: string) => {
    if (!currentUser) return;

    try {
      // Check if chat already exists
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        where('participants', 'array-contains', currentUser.uid)
      );
      const snapshot = await getDocs(q);
      
      const existingChat = snapshot.docs.find(doc => {
        const data = doc.data();
        return data.participants.includes(userId);
      });

      if (existingChat) {
        const chatData = existingChat.data();
        setSelectedChat({
          id: existingChat.id,
          username: chatData.username || '',
          realName: chatData.realName || '',
          avatar: chatData.avatar || '',
          lastMessage: chatData.lastMessage || '',
          lastMessageTime: chatData.lastMessageTime || '',
          lastMessageStatus: chatData.lastMessageStatus || 'sent',
          messages: [],
          files: chatData.files || { audio: 0, video: 0, file: 0, picture: 0 },
          links: chatData.links || [],
          isGroup: chatData.isGroup || false,
          members: chatData.members || []
        });
        return;
      }

      // Create new chat
      const chatRef = await addDoc(chatsRef, {
        participants: [currentUser.uid, userId],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: '',
        lastMessageTime: '',
        lastMessageStatus: 'sent',
        files: { audio: 0, video: 0, file: 0, picture: 0 },
        links: [],
        isGroup: false
      });

      // Get user data
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      const newChat: Chat = {
        id: chatRef.id,
        username: userData?.username || '',
        realName: userData?.displayName || '',
        avatar: userData?.avatarUrl || '',
        lastMessage: '',
        lastMessageTime: '',
        lastMessageStatus: 'sent',
        messages: [],
        files: { audio: 0, video: 0, file: 0, picture: 0 },
        links: [],
        isGroup: false
      };

      setChats(prev => [...prev, newChat]);
      setSelectedChat(newChat);
      setShowNewChat(false);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat || !currentUser) return;

    try {
      const messageData = {
        text: messageInput.trim(),
        timestamp: serverTimestamp(),
        senderId: currentUser.uid,
        status: 'sent'
      };

      // Add message to Firestore
      const messageRef = await addDoc(collection(db, `chats/${selectedChat.id}/messages`), messageData);
      
      // Update chat's last message
      const chatRef = doc(db, 'chats', selectedChat.id);
      await updateDoc(chatRef, {
        lastMessage: messageInput.trim(),
        lastMessageTime: new Date().toLocaleTimeString(),
        lastMessageStatus: 'sent',
        updatedAt: serverTimestamp()
      });

      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle file upload
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (!file || !selectedChat || !currentUser) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Upload file using the storage utility
      const storageFile = await uploadFile(
        file,
        STORAGE_PATHS.CHAT_MEDIA(selectedChat.id, type),
        (progress) => setUploadProgress(progress)
      );
      
      // Add file message to chat
      const messageData = {
        text: `Shared a ${type}`,
        timestamp: serverTimestamp(),
        senderId: currentUser.uid,
        status: 'sent',
        mediaType: type,
        mediaUrl: storageFile.url,
        fileName: storageFile.name,
        fileSize: storageFile.size
      };

      // Add message to Firestore
      await addDoc(collection(db, `chats/${selectedChat.id}/messages`), messageData);
      
      // Update the chat's files count
      const chatRef = doc(db, 'chats', selectedChat.id);
      await updateDoc(chatRef, {
        [`files.${type}`]: (selectedChat.files[type as keyof typeof selectedChat.files] || 0) + 1,
        lastMessage: `Shared a ${type}`,
        lastMessageTime: new Date().toLocaleTimeString(),
        lastMessageStatus: 'sent',
        updatedAt: serverTimestamp()
      });

      setIsUploading(false);
      setUploadProgress(0);
    } catch (error) {
      console.error('Error in file upload process:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (type: string) => {
    switch(type) {
      case 'audio':
        audioInputRef.current?.click();
        break;
      case 'video':
        videoInputRef.current?.click();
        break;
      case 'image':
        imageInputRef.current?.click();
        break;
      case 'file':
        fileInputRef.current?.click();
        break;
    }
    setShowAttachmentButtons(false);
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessageInput(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleMemberSelect = (member: GroupMember) => {
    setGroupMembers(prev => 
      prev.map(m => 
        m.id === member.id ? { ...m, selected: !m.selected } : m
      )
    );
    setSelectedMembers(prev => {
      if (prev.find(m => m.id === member.id)) {
        return prev.filter(m => m.id !== member.id);
      } else {
        return [...prev, { ...member, selected: true }];
      }
    });
  };

  const handleCreateGroup = async () => {
    if (groupName.trim() && selectedMembers.length > 0) {
      try {
        const newGroup: Chat = {
          id: `g${Date.now()}`,
          username: groupName.trim().toLowerCase().replace(/\s+/g, '_'),
          realName: groupName.trim(),
          avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
          lastMessage: 'Group created',
          lastMessageTime: new Date().toLocaleTimeString(),
          lastMessageStatus: 'sent',
          messages: [],
          files: { audio: 0, video: 0, file: 0, picture: 0 },
          links: [],
          isGroup: true,
          members: selectedMembers.map(m => m.id)
        };

        // Add to Firebase
        const groupRef = doc(collection(db, 'chats'));
        await setDoc(groupRef, {
          ...newGroup,
          id: groupRef.id, // Use Firebase's document ID
          createdAt: new Date(),
          createdBy: 'current_user_id',
          members: selectedMembers.map(m => m.id)
        });

        // Update local state with the new group
        const createdGroup = {
          ...newGroup,
          id: groupRef.id
        };
        setChats(prev => [...prev, createdGroup]);
        setSelectedChat(createdGroup); // Automatically select the new group
        setShowGroupModal(false);
        setGroupName('');
        setSelectedMembers([]);
        setGroupMembers(mockConnects);
      } catch (error) {
        console.error('Error creating group:', error);
      }
    }
  };

  // Filtered chats for search
  const filteredChats = chats.filter(chat =>
    chat.username.toLowerCase().includes(search.toLowerCase()) ||
    chat.realName.toLowerCase().includes(search.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[90vh] bg-gray-900 text-white">
      {/* Left Sidebar */}
      <div className="w-80 border-r border-gray-800 flex flex-col relative">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search chats or messages"
              className="bg-transparent outline-none flex-1 text-white"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map(chat => (
            <div
              key={chat.id}
              className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-800 border-b border-gray-800 transition-colors duration-200 ${
                selectedChat?.id === chat.id ? 'bg-gray-800' : ''
              }`}
              onClick={() => handleChatSelect(chat)}
            >
              <img src={chat.avatar} alt={chat.username} className="w-10 h-10 rounded-full mr-3" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {chat.realName}
                  {chat.isGroup && <span className="text-xs text-gray-400 ml-2">({chat.members?.length} members)</span>}
                </div>
                <div className="text-xs text-gray-400 flex items-center truncate">
                  {chat.lastMessage}
                  {chat.lastMessageStatus === 'sent' && <Check className="h-4 w-4 ml-1 text-gray-500" />}
                  {chat.lastMessageStatus === 'delivered' && <><Check className="h-4 w-4 ml-1 text-blue-400" /><Check className="h-4 w-4 -ml-2 text-blue-400" /></>}
                </div>
              </div>
              <div className="text-xs text-gray-500 ml-2 whitespace-nowrap">{chat.lastMessageTime}</div>
            </div>
          ))}
        </div>
        {/* New Chat Button */}
        <button
          className="absolute bottom-6 right-6 bg-purple-600 hover:bg-purple-700 rounded-full p-4 shadow-lg transition-colors duration-200"
          onClick={() => setShowNewChat(true)}
        >
          <Plus className="h-6 w-6" />
        </button>
        {/* New Chat Modal */}
        {showNewChat && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg w-96 p-6 relative">
              <button className="absolute top-4 right-4" onClick={() => setShowNewChat(false)}><X /></button>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search users"
                  className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white outline-none"
                />
              </div>
              <button
                className="w-full flex items-center px-4 py-2 mb-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
                onClick={() => { setShowNewChat(false); setShowGroupModal(true); }}
              >
                <User className="h-5 w-5 mr-2" /> New Group
              </button>
              <div className="text-xs text-gray-400 mb-2">Connects & Following</div>
              <div className="max-h-48 overflow-y-auto">
                {mockConnects.map(user => (
                  <div key={user.id} className="flex items-center px-3 py-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                    <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full mr-2" />
                    <div>
                      <div className="font-medium">{user.realName}</div>
                      <div className="text-xs text-gray-400">@{user.username}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* New Group Modal */}
        {showGroupModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg w-96 p-6 relative">
              <button className="absolute top-4 right-4" onClick={() => setShowGroupModal(false)}><X /></button>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Group name"
                  className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white outline-none mb-2"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Search members"
                  className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white outline-none"
                />
              </div>
              <div className="max-h-48 overflow-y-auto mb-4">
                {groupMembers.map(member => (
                  <div 
                    key={member.id} 
                    className={`flex items-center px-3 py-2 hover:bg-gray-800 rounded-lg cursor-pointer ${member.selected ? 'bg-gray-700' : ''}`}
                    onClick={() => handleMemberSelect(member)}
                  >
                    <img src={member.avatar} alt={member.username} className="w-8 h-8 rounded-full mr-2" />
                    <div className="flex-1">
                      <div className="font-medium">{member.realName}</div>
                      <div className="text-xs text-gray-400">@{member.username}</div>
                    </div>
                    {member.selected && <Check className="h-5 w-5 text-green-500" />}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-400 mb-4">
                {selectedMembers.length} members selected
              </div>
              <button 
                className={`w-full rounded-lg py-2 font-medium ${
                  groupName.trim() && selectedMembers.length > 0
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-gray-700 cursor-not-allowed'
                }`}
                onClick={handleCreateGroup}
                disabled={!groupName.trim() || selectedMembers.length === 0}
              >
                Create Group
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4 bg-gray-900">
              <div className="flex items-center cursor-pointer" onClick={() => setShowUserSidebar(true)}>
                <img src={selectedChat.avatar} alt={selectedChat.username} className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <div className="font-medium">{selectedChat.realName}</div>
                  <div className="text-xs text-gray-400">@{selectedChat.username}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200">
                  <Search className="h-5 w-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200">
                  <MoreVertical className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-900">
              {selectedChat.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg shadow transition-all duration-200 ${
                    msg.fromMe ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-200'
                  }`}>
                    {msg.mediaType && msg.mediaUrl && (
                      <div className="mb-2">
                        {msg.mediaType === 'image' && (
                          <img src={msg.mediaUrl} alt={msg.fileName} className="max-w-full rounded-lg" />
                        )}
                        {msg.mediaType === 'video' && (
                          <video src={msg.mediaUrl} controls className="max-w-full rounded-lg" />
                        )}
                        {msg.mediaType === 'audio' && (
                          <audio src={msg.mediaUrl} controls className="w-full" />
                        )}
                        {msg.mediaType === 'file' && (
                          <a 
                            href={msg.mediaUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                          >
                            <File className="h-4 w-4" />
                            <span>{msg.fileName}</span>
                          </a>
                        )}
                      </div>
                    )}
                    <div className="flex items-center">
                      <span>{msg.text}</span>
                      <span className="ml-2 text-xs text-gray-300">{msg.time}</span>
                      {msg.fromMe && (
                        msg.status === 'sent' ? <Check className="h-4 w-4 ml-1 text-gray-300" /> :
                        msg.status === 'delivered' ? <><Check className="h-4 w-4 ml-1 text-blue-400" /><Check className="h-4 w-4 -ml-2 text-blue-400" /></> :
                        msg.status === 'read' ? <><Check className="h-4 w-4 ml-1 text-green-400" /><Check className="h-4 w-4 -ml-2 text-green-400" /></> : null
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            {/* Message Input Bar */}
            <div className="flex items-center px-6 py-4 border-t border-gray-800 bg-gray-900">
              {isUploading && (
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-lg p-4 shadow-lg">
                  <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-400 mt-2">Uploading... {uploadProgress}%</div>
                </div>
              )}
              <button 
                className="mr-2 p-2 hover:bg-gray-800 rounded-full transition-colors duration-200"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="h-6 w-6 text-gray-400" />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-20 left-10 z-50">
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    width={350}
                    height={400}
                    searchDisabled={false}
                    skinTonesDisabled={false}
                    autoFocusSearch={true}
                    theme={Theme.DARK}
                  />
                </div>
              )}
              <div className="relative">
                <button 
                  className="mr-2 p-2 hover:bg-gray-800 rounded-full transition-colors duration-200"
                  onClick={() => setShowAttachmentButtons(!showAttachmentButtons)}
                >
                  <Paperclip className="h-6 w-6 text-gray-400" />
                </button>
                {showAttachmentButtons && (
                  <div className="absolute bottom-12 left-0 bg-gray-800 rounded-lg p-4 shadow-lg z-50 w-48">
                    <button 
                      className="w-full flex items-center px-3 py-2 hover:bg-gray-700 rounded-lg mb-2 transition-colors duration-200"
                      onClick={() => handleFileSelect('audio')}
                    >
                      <Music2 className="h-5 w-5 mr-2" />
                      <span>Audio</span>
                    </button>
                    <button 
                      className="w-full flex items-center px-3 py-2 hover:bg-gray-700 rounded-lg mb-2 transition-colors duration-200"
                      onClick={() => handleFileSelect('video')}
                    >
                      <Video className="h-5 w-5 mr-2" />
                      <span>Video</span>
                    </button>
                    <button 
                      className="w-full flex items-center px-3 py-2 hover:bg-gray-700 rounded-lg mb-2 transition-colors duration-200"
                      onClick={() => handleFileSelect('image')}
                    >
                      <Image className="h-5 w-5 mr-2" />
                      <span>Picture</span>
                    </button>
                    <button 
                      className="w-full flex items-center px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                      onClick={() => handleFileSelect('file')}
                    >
                      <File className="h-5 w-5 mr-2" />
                      <span>File</span>
                    </button>
                  </div>
                )}
                {/* Hidden file inputs */}
                <input
                  type="file"
                  ref={audioInputRef}
                  className="hidden"
                  accept="audio/*"
                  onChange={(e) => handleFileChange(e, 'audio')}
                />
                <input
                  type="file"
                  ref={videoInputRef}
                  className="hidden"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, 'video')}
                />
                <input
                  type="file"
                  ref={imageInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'image')}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'file')}
                />
              </div>
              <input
                type="text"
                placeholder="Type a message"
                className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-white outline-none transition-colors duration-200 focus:bg-gray-700"
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <button 
                className="ml-2 bg-purple-600 hover:bg-purple-700 rounded-full p-2 transition-colors duration-200" 
                onClick={handleSendMessage}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-900">
            <div className="text-center text-gray-400">
              <div className="text-2xl mb-2">Select a chat to start messaging</div>
              <div className="text-sm">Choose from your existing conversations or start a new one</div>
            </div>
          </div>
        )}
      </div>

      {/* User Info Sidebar */}
      {showUserSidebar && (
        <div className="fixed inset-y-0 right-0 w-96 bg-gray-900 border-l border-gray-800 z-50 flex flex-col">
          <div className="flex flex-col items-center p-8 border-b border-gray-800">
            <img src={selectedChat?.avatar} alt={selectedChat?.username} className="w-20 h-20 rounded-full mb-4" />
            <div className="text-xl font-bold mb-1">@{selectedChat?.username}</div>
            <div className="text-gray-400 text-base mb-4">{selectedChat?.realName}</div>
            <button className="w-full bg-gray-800 hover:bg-gray-700 rounded-lg py-2 mb-4 font-medium" style={{maxWidth: '16rem'}}>
              View Profile
            </button>
            <button onClick={() => setShowUserSidebar(false)} className="absolute top-6 right-6"><X className="h-6 w-6" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 flex flex-col">
            <div className="font-semibold text-lg mb-2">Files Shared</div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Music2 className="h-6 w-6" />
                <span>{selectedChat?.files.audio}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Video className="h-6 w-6" />
                <span>{selectedChat?.files.video}</span>
              </div>
              <div className="flex items-center space-x-2">
                <File className="h-6 w-6" />
                <span>{selectedChat?.files.file}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Image className="h-6 w-6" />
                <span>{selectedChat?.files.picture}</span>
              </div>
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowLinksModal(true)}>
                <div className="font-medium">Links Shared</div>
                <div className="flex flex-col text-xs text-blue-400">
                  {selectedChat?.links.slice(0,2).map(link => (
                    <span key={link.url}>{link.url}</span>
                  ))}
                  {selectedChat?.links && selectedChat.links.length > 2 && <span className="text-xs text-purple-400 cursor-pointer">...see more</span>}
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 flex flex-col gap-2 mt-auto">
            <button className="w-full bg-red-600 hover:bg-red-700 rounded-lg py-2 font-medium" onClick={() => setShowReportModal(true)}>
              <AlertTriangle className="h-5 w-5 inline mr-2" /> Report
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-800 rounded-lg py-2 font-medium" onClick={() => setShowBlockModal(true)}>
              <ShieldOff className="h-5 w-5 inline mr-2" /> Block
            </button>
          </div>
        </div>
      )}
      {/* Files Modal */}
      {showFilesModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg w-[32rem] p-6 relative">
            <button className="absolute top-4 right-4" onClick={() => setShowFilesModal(false)}><X /></button>
            <div className="font-bold mb-4">Files Shared</div>
            <div className="space-y-4">
              {Object.entries(selectedFiles).map(([type, files]) => (
                files.length > 0 && (
                  <div key={type} className="border-b border-gray-800 pb-4">
                    <div className="font-medium mb-2 capitalize">{type}</div>
                    <div className="space-y-2">
                      {files.map((file: FileInfo, index: number) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-300">{file.name}</span>
                          <span className="text-gray-500">{file.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Links Modal */}
      {showLinksModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg w-[32rem] p-6 relative">
            <button className="absolute top-4 right-4" onClick={() => setShowLinksModal(false)}><X /></button>
            <div className="font-bold mb-4">Links Shared</div>
            <div className="text-gray-400">(Mock links list by date here)</div>
          </div>
        </div>
      )}
      {/* Block Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg w-96 p-6 relative">
            <button className="absolute top-4 right-4" onClick={() => setShowBlockModal(false)}><X /></button>
            <div className="font-bold mb-4">Block {selectedChat?.realName}?</div>
            <div className="mb-4 text-gray-400">Are you sure you want to block @{selectedChat?.username}?</div>
            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 bg-gray-700 rounded-lg" onClick={() => setShowBlockModal(false)}>No</button>
              <button className="px-4 py-2 bg-red-600 rounded-lg" onClick={() => setShowBlockModal(false)}>Yes, Block</button>
            </div>
          </div>
        </div>
      )}
      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg w-96 p-6 relative">
            <button className="absolute top-4 right-4" onClick={() => setShowReportModal(false)}><X /></button>
            <div className="font-bold mb-4">Report {selectedChat?.realName}</div>
            <div className="mb-4 text-gray-400">Please describe the issue or select a reason for reporting this user/chat.</div>
            <textarea className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white outline-none mb-4" rows={3} placeholder="Describe the issue..." />
            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 bg-gray-700 rounded-lg" onClick={() => setShowReportModal(false)}>Cancel</button>
              <button className="px-4 py-2 bg-red-600 rounded-lg" onClick={() => setShowReportModal(false)}>Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage; 