import React, { useState, useRef ,useEffect} from "react";
import { db, storage } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { BsImage } from "react-icons/bs";
import { FcCheckmark } from "react-icons/fc";
import { FaSpinner } from "react-icons/fa";
import { getDocs, where, query } from 'firebase/firestore';

const TweetForm = ({ user, onClose }) => {
  const [tweet, setTweet] = useState("");
  const [tweetPhoto, setTweetPhoto] = useState(null);
  const inputFileRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [profilePhotoURL, setProfilePhotoURL] = useState(null);
  useEffect(() => {
    async function fetchProfilePhotoURL() {
      if (!user.uid) return;

      const profilesCollection = collection(db, 'profiles');
      const q = query(profilesCollection, where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const profileData = querySnapshot.docs[0].data();
        setProfilePhotoURL(profileData.profilePhotoURL);
        setUsername(profileData.username || '');
      }
    }

    fetchProfilePhotoURL();
  }, [user.uid]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let tweetPhotoURL = "";
      if (tweetPhoto) {
        const storageRef = ref(
          storage,
          `tweet-photos/${user.uid}_${Date.now()}`
        );
        await uploadBytes(storageRef, tweetPhoto);
        tweetPhotoURL = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "tweets"), {
        content: tweet,
        authorId: user.uid,
        authorEmail: user.email,
        createdAt: new Date(),
        username: username, 
        tweetPhotoURL: tweetPhotoURL,
        profilePhotoURL:profilePhotoURL,
      });

      setTweet("");
      setTweetPhoto(null);
      toast.success("Tweeted Successfully");
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIconClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click(); // Trigger the file input's click event
    }
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        {/* {profilePhotoURL && (
          <img
            src={profilePhotoURL}
            alt="Profile"
            className="w-12 h-12 rounded-full mr-3"
          />
        )} */}

        <textarea
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          placeholder="What's on your mind?"
          rows={6}
          className="w-full h-58 p-2 border rounded-md break-words resize-none focus:outline-none focus:border-blue-500"
          required
          style={{ wordWrap: 'break-word' }}
        />
        <div className="flex justify-between w-full">
          <div className="relative flex items-center">
            <div
              className="icon-container cursor-pointer px-4 py-3 bg-blue-300 rounded-md hover:bg-pink-400"
              onClick={handleIconClick}
            >
              <BsImage className="upload-icon text-xl" />
            </div>
            {tweetPhoto && (
              <span className="ml-2">{<FcCheckmark size={19} />}</span>
            )}
            <input
              type="file"
              accept="image/*"
              ref={inputFileRef}
              style={{ display: "none" }}
              onChange={(e) => setTweetPhoto(e.target.files[0])}
            />
          </div>
          <div className="flex gap-0">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-blue-600 ml-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner size={20} className="animate-spin ml-1" />
                </>
              ) : (
                "GO"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TweetForm;
