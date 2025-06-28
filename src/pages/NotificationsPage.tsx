import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

interface Notification {
  id: string;
  type: 'connect' | 'follow' | 'activity';
  message: string;
  timestamp: Date;
  read: boolean;
  fromUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  data?: Record<string, unknown>; // Additional data specific to the notification type
}

const NotificationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'connect' | 'follow' | 'activity'>('all');

  useEffect(() => {
    if (!currentUser) return;

    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('toUserId', '==', currentUser.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as Notification[];
      setNotifications(newNotifications);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    return notification.type === activeTab;
  });

  const handleAcceptConnect = async () => {
    // Implement connect request acceptance logic
  };

  const handleRejectConnect = async () => {
    // Implement connect request rejection logic
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Notifications</h1>
      
      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          className={`pb-2 px-4 ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === 'connect' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('connect')}
        >
          Connect Requests
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === 'follow' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('follow')}
        >
          Followers
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === 'activity' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No notifications to display</p>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${
                notification.read ? 'bg-white' : 'bg-blue-50'
              }`}
            >
              <div className="flex items-start space-x-4">
                {notification.fromUser.avatar && (
                  <img
                    src={notification.fromUser.avatar}
                    alt={notification.fromUser.name}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div className="flex-1">
                  <p className="text-gray-800">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {notification.timestamp.toLocaleDateString()}
                  </p>
                  
                  {notification.type === 'connect' && (
                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={handleAcceptConnect}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Accept
                      </button>
                      <button
                        onClick={handleRejectConnect}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

<<<<<<< Updated upstream
export default NotificationsPage; 
=======
export default NotificationsPage;
>>>>>>> Stashed changes
