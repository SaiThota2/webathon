import React, { useState, useEffect } from 'react';
import { collection, onSnapshot,getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Tweet from './Tweet';

const AdminTweetsList = () => {
  const [adminTweets, setAdminTweets] = useState([]);
  const [adminUid, setAdminUid] = useState('');
  useEffect(() => {
    const tweetsCollection = collection(db, 'tweets');
    const unsubscribe = onSnapshot(tweetsCollection, async (querySnapshot) => {
      const adminTweetsData = await Promise.all(
        querySnapshot.docs.map(async (tweetDoc) => {
          const tweetData = tweetDoc.data();
          if (tweetData.authorId === adminUid) {
            // You can fetch profile photo and other info here if needed
            return {
              id: tweetDoc.id,
              ...tweetData,
            };
          }
        })
      );

      // Remove undefined entries and sort tweets by createdAt in descending order
      const validAdminTweets = adminTweetsData.filter((tweet) => tweet !== undefined);
      validAdminTweets.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      setAdminTweets(validAdminTweets);
    }, (error) => {
      console.error('Error fetching admin tweets:', error);
    });

    return () => unsubscribe();

  }, [adminUid]);
useEffect(()=>{
    async function fetchAdminUid() {
        try {
          const adminsCollection = collection(db, 'admins');
          const adminsQuerySnapshot = await getDocs(adminsCollection);
          if (!adminsQuerySnapshot.empty) {
            const adminData = adminsQuerySnapshot.docs[0].data();
            setAdminUid(adminData.adminUid || '');
            console.log(adminUid)
          }
        } catch (error) {
          console.error('Error fetching admin UID:', error);
        }
      }
      
      fetchAdminUid();
},[adminUid])
  return (
    <div className="pt-2">
      {adminTweets.map((tweet) => (
        <Tweet
          key={tweet.id}
          id={tweet.id}
          username={tweet.authorEmail}
          content={tweet.content}
          profilePhotoURL={tweet.profilePhotoURL}
          authorId={tweet.authorId}
          tweetPhotoURL={tweet.tweetPhotoURL}
          timestamp={tweet.createdAt?.toDate().toLocaleString()} // Adding optional chaining
        />
      ))}
    </div>
  );
};

export default AdminTweetsList;
