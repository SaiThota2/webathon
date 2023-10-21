import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { UserAuth } from "../context/AuthContext";
import Tweet from './Tweet';
import { toast } from 'react-toastify'; // Import toast for notifications

const BookmarkedList = () => {
  const [bookmarkedTweets, setBookmarkedTweets] = useState([]);
  const { user } = UserAuth();

  useEffect(() => {
    if (!user.uid) return;

    const bookmarksCollection = collection(db, 'users', user.uid, 'bookmarks');
    const unsubscribe = onSnapshot(bookmarksCollection, async (querySnapshot) => {
      const bookmarkedTweetIds = querySnapshot.docs.map((doc) => doc.id);

      // Fetch the bookmarked tweets
      const tweetsCollection = collection(db, 'tweets');
      const bookmarkedTweetsData = await Promise.all(
        bookmarkedTweetIds.map(async (tweetId) => {
          const tweetDoc = doc(tweetsCollection, tweetId);
          const tweetSnapshot = await getDoc(tweetDoc);

          if (tweetSnapshot.exists()) {
            const tweetData = tweetSnapshot.data();
            return {
              id: tweetSnapshot.id,
              ...tweetData,
            };
          }
          return null;
        })
      );

      // Filter out null values (tweets that no longer exist)
      const validBookmarkedTweets = bookmarkedTweetsData.filter((tweet) => tweet !== null);

      // Sort tweets by createdAt in descending order
      validBookmarkedTweets.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());

      setBookmarkedTweets(validBookmarkedTweets);
    }, (error) => {
      console.error('Error fetching bookmarked tweets:', error); // Handle error
    });

    return () => unsubscribe();
  }, [user.uid]);

  const handleBookmarkClick = async (tweetId, isBookmarked) => {
    try {
      const userBookmarkRef = doc(db, 'users', user.uid, 'bookmarks', tweetId);

      if (isBookmarked) {
        // If the tweet is already bookmarked, unbookmark it
        await deleteDoc(userBookmarkRef);
        toast.info('Removed from bookmarks'); // Notification for removal
      } else {
        // If the tweet is not bookmarked, bookmark it
        await setDoc(userBookmarkRef, { bookmarked: true });
        toast.success('Added to bookmarks'); // Notification for addition
      }
    } catch (error) {
      console.error('Error bookmarking tweet:', error);
    }
  };

  return (
    <div className="pt-2">
      {bookmarkedTweets.map((tweet) => (
        <Tweet
          key={tweet.id}
          id={tweet.id}
          username={tweet.authorEmail}
          content={tweet.content}
          profilePhotoURL={tweet.profilePhotoURL}
          authorId={tweet.authorId}
          tweetPhotoURL={tweet.tweetPhotoURL}
          timestamp={tweet.createdAt?.toDate().toLocaleString()}
          isBookmarked={true} // Always set to true for bookmarked tweets
          onBookmarkClick={() => handleBookmarkClick(tweet.id, true)}
        />
      ))}
    </div>
  );
};

export default BookmarkedList;
