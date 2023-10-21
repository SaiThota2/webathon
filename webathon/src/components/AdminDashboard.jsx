import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import TweetForm from "./TweetForm";
import { SiPhpmyadmin } from "react-icons/si";
import { RiProfileLine, RiBookmarkLine } from "react-icons/ri";
import { db } from "../firebaseConfig";
import { collection, doc, deleteDoc } from "firebase/firestore";
import { getDocs, where, query } from "firebase/firestore";
import Papa from 'papaparse';
import ProfileCard from "./ProfileCard";

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import PlacementUpload from "./PlacementUpload";


const AdminDashboard = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [showTweetForm, setShowTweetForm] = useState(false);
  const [username, setUsername] = useState("");
  const [adminUid, setAdminUid] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [activeProfiles, setActiveProfiles] = useState([]);
  const [data, setData] = useState([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedMaxPackage, setSelectedMaxPackage] = useState("");
  const [selectedYear, setSelectedYear] = useState("");



  // ... rest of your imports and code

  const handleSubmitReport = async () => {
    const placementsCollection = collection(db, "placements");
    const querySnapshot = await getDocs(placementsCollection);
    const allPlacements = querySnapshot.docs.map(doc => doc.data());
    console.log("All placements:", allPlacements);

    // Filter according to user selection
    const filteredPlacements = allPlacements.filter(placement =>
      parseFloat(placement.packageOffered) <= parseFloat(selectedMaxPackage) &&
      placement.batch === selectedYear
    );
    console.log("Filtered placements:", filteredPlacements);

    // Convert filtered data to CSV
    const csv = Papa.unparse(filteredPlacements);
    console.log("CSV data:", csv);

    // Download the CSV
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "filtered_placements.csv";

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const fetchData = async () => {
      const profilesCollection = collection(db, "profiles");
      const querySnapshot = await getDocs(profilesCollection);
      const allProfiles = querySnapshot.docs.map(doc => doc.data());

      const batches = ['2025', '2024', '2023', '2022', '2021'];

      const avgPackages = batches.map(batch => {
        const batchProfiles = allProfiles.filter(profile => profile.batch === batch);
        const validPackages = batchProfiles.map(profile => parseFloat(profile.packageOffered)).filter(pkg => !isNaN(pkg));

        const totalPackage = validPackages.reduce((acc, pkg) => acc + pkg, 0);

        return {
          batch,
          avgPackage: validPackages.length ? (totalPackage / validPackages.length) : 0
        };
      });

      setData(avgPackages);
    }

    fetchData();
  }, []);


  useEffect(() => {
    // Fetch all profiles from the "profiles" collection
    const fetchAllProfiles = async () => {
      try {
        const profilesCollection = collection(db, "profiles");
        const querySnapshot = await getDocs(profilesCollection);
        const profiles = querySnapshot.docs.map((doc) => doc.data());
        setActiveProfiles(profiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchAllProfiles();
  }, []);



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
  const handleDeleteProfile = async (profileUid) => {
    try {
      // Delete the document from Firestore
      const profileDocRef = doc(db, "profiles", profileUid);
      await deleteDoc(profileDocRef);

      // Optionally, you can update the UI to remove the deleted profile
      setActiveProfiles((prevProfiles) =>
        prevProfiles.filter((profile) => profile.uid !== profileUid)
      );
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

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

        <div className="mb-8 pb-8 mt-2 pt-8">

          <div className="mb-8 pb-8 mt-2 pt-8">
            <div className="flex justify-between flex-col sm:flex-row">
              <BarChart width={600} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="batch" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgPackage" fill="#8884d8" />
              </BarChart>
              <div className="flex  justify-center flex-col">
                <PlacementUpload />
                <div className="mt-4">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => setShowReportForm(true)}>
                    Generate Reports
                  </button>
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-semibold mb-4">Active Profiles</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeProfiles.map((profile) => (
                <ProfileCard key={profile.uid} profile={profile} onDelete={() => handleDeleteProfile(profile.uid)} />
              ))}
            </div>
          </div>
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

          {isAdmin && (
            <div className="text-gray-600 hover:text-blue-500">
              <Link to="/admindashboard">
                <SiPhpmyadmin size={24} />
              </Link>
            </div>
          )}

          <div className="text-gray-600 hover:text-blue-500">
            <Link to="/bookmarks">
              <RiBookmarkLine size={24} />
            </Link>
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
      {showReportForm && (
        <div className="fixed backdrop-blur-md inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-md shadow-md sm:w-2/3">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Max Package Upto:</label>
              <select value={selectedMaxPackage} onChange={e => setSelectedMaxPackage(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                {/* Add options as required */}
                <option value="5">5 LPA</option>
                <option value="10">10 LPA</option>
                <option value="15">15 LPA</option>
                <option value="20">20 LPA </option>
                <option value="30">30 LPA </option>

              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Year:</label>
              <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                {/* Add options as required */}
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleSubmitReport}>
              Generate Report
            </button>
            <button className="bg-blue-500 mx-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => setShowReportForm(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
