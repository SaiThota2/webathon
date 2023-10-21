import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import TweetForm from "./TweetForm";
import { SiPhpmyadmin } from "react-icons/si";
import { RiProfileLine, RiBookmarkLine } from "react-icons/ri";
import { db } from "../firebaseConfig";
import { collection } from "firebase/firestore";
import { getDocs, where, query } from "firebase/firestore";
import { LuMessagesSquare } from "react-icons/lu";


import BookmarkedList from "./BookmarksTab";

const BookmarkDashboard = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [showTweetForm, setShowTweetForm] = useState(false);
  const [username, setUsername] = useState("");
  const [adminUid, setAdminUid] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/register");
    } catch (e) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    async function fetchProfilePhotoURL() {
      if (!user.uid) return;

      const profilesCollection = collection(db, "profiles");
      const q = query(profilesCollection, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const profileData = querySnapshot.docs[0].data();
        setUsername(profileData.username || "");
      }
    }

    fetchProfilePhotoURL();

    async function fetchAdminUid() {
      try {
        const adminsCollection = collection(db, "admin");
        const adminsQuerySnapshot = await getDocs(adminsCollection);
        if (!adminsQuerySnapshot.empty) {
          const adminData = adminsQuerySnapshot.docs[0].data();
          setAdminUid(adminData.uid || "");

          // Check if the user is an admin
          setIsAdmin(user.uid === adminData.uid); // Set isAdmin state based on the comparison
        }
      } catch (error) {
        console.error("Error fetching admin UID:", error);
      }
    }

    fetchAdminUid();
  }, [user.uid, adminUid]);

  return (
    <div className="flex">
      <div className="flex-grow p-4 max-w-screen ">
        <div className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 flex justify-around">
          <h1
            className={`text-white font-medium text-xl sm:text-3xl duration-300 origin-center`}
          >
                <span className="text-green-600">Placement-</span>
            <span className="text-blue-500">Portal</span>
          </h1>

          <div className="flex py-2 mx-auto">
            <p className="text-sm font-semibold sm:text-lg">{username}</p>
          </div>
          <div className="flex gap-2  justify-end">
            <Link
              to="/placements"
              className=" px-2 bg-transparent border border-blue-500 text-black hover:bg-blue-500 hover:text-white py-2  rounded">
              Placements
            </Link>

            <button
              className="bg-green-400 px-2 py-1 rounded hover:text-white"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-8 pb-8 mt-8 pt-8">
          <BookmarkedList />
          <div className="text-center mt-4"></div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 flex justify-around">
          <div className="text-gray-600 hover:text-blue-500">
            <Link to="/dashboard">
              <AiFillHome size={24} />
            </Link>
          </div>
          <div className="text-gray-600 hover:text-blue-500">
          <Link to={`/profile/${user.uid}`}>
              <RiProfileLine size={24} />
            </Link>
          </div>
          {isAdmin&&(
          <div className="text-gray-600 hover:text-blue-500">
            <Link to="/admindashboard">
              <SiPhpmyadmin size={24} />
            </Link>
          </div>
          )}
          <div className="text-gray-600 hover:text-blue-500">
            <Link to="/deptdashboard">
              <SiPhpmyadmin size={24} />
            </Link>
          </div>
          <div className="text-gray-600 hover:text-blue-500">
            <Link to="/bookmarks">
            <RiBookmarkLine size={24} />
            </Link>
          </div>
          <div
            className="fixed text-white cursor-pointer text-xl px-3 py-3 bottom-[100px] right-4 transform translate-y-1/2 bg-blue-400 shadow-md rounded-md hover:bg-blue-600"
            onClick={() => setShowTweetForm(true)}
          >
            <button className="h-2">
              <LuMessagesSquare size={19} />
            </button>
          </div>
        </div>
      </div>

      {showTweetForm && (
        <div className="fixed backdrop-blur-md inset-0 flex justify-center items-center bg-gray-800 z-50">
          <div className="bg-white p-4 rounded-md shadow-md w-2/3">
            <TweetForm user={user} onClose={() => setShowTweetForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarkDashboard;
