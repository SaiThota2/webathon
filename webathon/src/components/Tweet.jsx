import React, { useState } from "react";
import { AiOutlineEllipsis } from "react-icons/ai";
import { db } from "../firebaseConfig";
import { doc, deleteDoc, setDoc } from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";
import ExpandedImage from "./ExpandedImage";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { toast } from 'react-toastify'; // Import toast for notifications
import { Link } from "react-router-dom";
const Tweet = ({
  id,
  username,
  content,
  timestamp,
  profilePhotoURL,
  tweetPhotoURL,
  authorId,
  adminUid,
  onBookmarkClick, // Callback function to handle bookmarking
  isBookmarked,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const { user } = UserAuth();
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [isTweetPhotoExpanded, setIsTweetPhotoExpanded] = useState(false);

  const handleOptionsClick = () => {
    setShowOptions(!showOptions);
  };

  const handleDelete = async () => {
    try {
      if (user.uid === authorId || user.uid === adminUid) {
        const tweetRef = doc(db, "tweets", id);
        await deleteDoc(tweetRef);
      } else {
        // Handle unauthorized delete attempt
      }
    } catch (error) {
      console.error("Error deleting tweet:", error);
    }
  };

  const handleInfo = async () => {
    console.log("info");
  };

  const handleImage = () => {
    setIsImageExpanded(!isImageExpanded);
  };

  const handleTweetPhotoClick = () => {
    setIsTweetPhotoExpanded(!isTweetPhotoExpanded);
  };

  const handleBookmarkClick = async () => {
    try {
      if (!user.uid) {
        // User is not authenticated
        toast.error('Please sign in to bookmark.');
        return;
      }

      const userBookmarkRef = doc(db, 'users', user.uid, 'bookmarks', id);

      if (isBookmarked) {
        // If the tweet is already bookmarked, unbookmark it
        await deleteDoc(userBookmarkRef);
        toast.info('Removed from bookmarks');
      } else {
        // If the tweet is not bookmarked, bookmark it
        await setDoc(userBookmarkRef, { bookmarked: true });
        toast.success('Added to bookmarks');
      }

      // Call the parent component's onBookmarkClick to update the state
      onBookmarkClick();
    } catch (error) {
      console.error('Error bookmarking tweet:', error);
    }
  };

  return (
    <div
      className={`${
        adminUid === authorId ? "bg-green-100" : "bg-white"
      } p-2 sm:p-5 border rounded-lg shadow-md transition duration-50 ease-out hover:ease-in hover:border-navy-300 hover:border-2 mb-4`}
    >
      <div className="flex items-start">
        <img
          className="w-20 h-20 cursor-pointer object-cover rounded-full mr-2"
          src={profilePhotoURL || "https://via.placeholder.com/50"}
          alt="User Avatar"
          onClick={handleImage}
        />
        {isImageExpanded && (
          <ExpandedImage imageURL={profilePhotoURL} onClose={handleImage} />
        )}
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <p className="text-gray-800 text-[14px] sm:text-md font-semibold">
            <Link to={`/profile/${authorId}`}> {username}</Link>
            </p>
            <div className="flex flex-col items-center">
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={handleOptionsClick}
              >
                <AiOutlineEllipsis size={25} />
              </button>
              <button className="bookmark-button" onClick={handleBookmarkClick}>
                {isBookmarked ? (
                  <FaBookmark className="bookmarked-icon" />
                ) : (
                  <FaRegBookmark className="unbookmarked-icon" />
                )}
              </button>
              {showOptions && (
                <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg">
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={
                      user.uid === authorId || user.uid === adminUid
                        ? handleDelete
                        : handleInfo
                    }
                  >
                    {user.uid === authorId || user.uid === adminUid
                      ? "Delete"
                      : "Info"}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex-grow w-full">
            <p className="text-gray-700 mt-1 break-words">{content}</p>
            {tweetPhotoURL && (
              <img
                src={tweetPhotoURL}
                alt="Tweet"
                className="mt-2 rounded-md max-h-72 cursor-pointer"
                onClick={handleTweetPhotoClick}
              />
            )}
            {isTweetPhotoExpanded && (
              <ExpandedImage
                imageURL={tweetPhotoURL}
                onClose={handleTweetPhotoClick}
              />
            )}
          </div>
          <p className="text-gray-600 text-sm mt-2">{timestamp}</p>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
