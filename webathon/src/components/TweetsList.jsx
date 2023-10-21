// TweetsList.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, doc, getDoc, setDoc } from 'firebase/firestore';
import { getDocs, where, query } from 'firebase/firestore';
import { UserAuth } from '../context/AuthContext';
import { AnimatePresence } from "framer-motion";

import Tweet from './Tweet';

const TweetsList = ({ adminUid }) => {
  const [tweets, setTweets] = useState([]);
  const { user } = UserAuth();
  const showNotification = useCallback((newTweetsCount) => {
    if (Notification.permission === 'granted') {
      const options = {
        body: `${newTweetsCount} new tweets added.`,
        icon: '/path/to/notification-icon.png', // Replace with your notification icon
      };
      new Notification('New Tweets', options);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          showNotification(newTweetsCount);
        }
      });
    }
  }, []);

  const handleBookmarkClick = async (tweetId) => {
    try {
      // Check if the user is authenticated and has a valid UID
      if (!user || !user.uid) {
        console.error('User is not authenticated.');
        return;
      }

      // Check if the tweet is already bookmarked
      const existingTweet = tweets.find((tweet) => tweet.id === tweetId);
      if (!existingTweet) {
        console.error('Tweet not found.');
        return;
      }

      if (existingTweet.isBookmarked) {
        // Remove the tweet from bookmarks if it's already bookmarked
        await setDoc(doc(db, 'users', user.uid, 'bookmarks', tweetId), {
          bookmarked: false,
        });
      } else {
        // Bookmark the tweet by adding it to the user's bookmarks
        await setDoc(doc(db, 'users', user.uid, 'bookmarks', tweetId), {
          bookmarked: true,
        });
      }
    } catch (error) {
      console.error('Error bookmarking tweet:', error);
    }
  };

  useEffect(() => {
    if (!user || !user.uid) {
      console.error('User is not authenticated.');
      return;
    }

    const tweetsCollection = collection(db, 'tweets');
    const unsubscribe = onSnapshot(tweetsCollection, async (querySnapshot) => {
      const tweetsData = await Promise.all(
        querySnapshot.docs.map(async (tweetDoc) => {
          const tweetData = tweetDoc.data();
          const authorUid = tweetData.authorId;

          // Fetch the profile photo URL for the user based on UID
          const profilesCollection = collection(db, 'profiles');
          const q = query(profilesCollection, where('uid', '==', authorUid));
          const profileQuerySnapshot = await getDocs(q);

          let profilePhotoURL = null;
          if (!profileQuerySnapshot.empty) {
            const profileData = profileQuerySnapshot.docs[0].data();
            profilePhotoURL = profileData.profilePhotoURL;
          }
          if ('Notification' in window) {
            // Request permission when the component mounts
            if (Notification.permission !== 'granted') {
              showNotification(0); // 0 indicates no new tweets, just to ask for permission
            }
          }

          // Check if the tweet is bookmarked by the user
          const userBookmarkRef = doc(db, 'users', user.uid, 'bookmarks', tweetDoc.id);
          const userBookmarkSnapshot = await getDoc(userBookmarkRef);

          return {
            id: tweetDoc.id,
            ...tweetData,
            profilePhotoURL,
            isBookmarked: userBookmarkSnapshot?.exists && userBookmarkSnapshot.data()?.bookmarked,
          };
        })
      );

      // Sort tweets by createdAt in descending order
      tweetsData.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      const newTweetsCount = tweetsData.length - tweets.length;
      setTweets(tweetsData);
      if (newTweetsCount > 0) {
        showNotification(newTweetsCount);
      }
    }, (error) => {
      console.error('Error fetching tweets:', error); // Handle error
    });

    return () => unsubscribe();
  }, [tweets.length, showNotification, user]);

  return (
    <div className='pt-2'>
      {tweets.map((tweet) => (
        <AnimatePresence>
        <Tweet
          key={tweet.id}
          id={tweet.id}
          username={tweet.authorEmail}
          content={tweet.content}
          profilePhotoURL={tweet.profilePhotoURL}
          authorId={tweet.authorId}
          tweetPhotoURL={tweet.tweetPhotoURL}
          adminUid={adminUid}
          timestamp={tweet.createdAt?.toDate().toLocaleString()}
          isBookmarked={tweet.isBookmarked}
          onBookmarkClick={() => handleBookmarkClick(tweet.id)}
        />
        </AnimatePresence>
      ))}
    </div>
  );
};

export default TweetsList;
