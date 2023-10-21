import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";

import { SiPhpmyadmin } from "react-icons/si";
import { RiProfileLine, RiBookmarkLine } from "react-icons/ri";
import { db } from "../firebaseConfig";
import { collection } from "firebase/firestore";
import { getDocs, where, query } from "firebase/firestore";


import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import DeptPlacements from "./DeptPlacements";



const DeptDashboard = () => {
    const { user, logout } = UserAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [data, setData] = useState([]);
    const [hasDepartment, setHasDepartment] = useState(false);
    const [userBranch, setUserBranch] = useState("");
    const [placements, setPlacements] = useState([]);

    useEffect(() => {
        async function fetchAndFilterPlacements() {
          if (!userBranch) return;
      
          const placementsCollection = collection(db, "placements");  // Assuming the name of the collection is "placements"
          const placementsQuery = query(placementsCollection, where("branch", "==", userBranch));
          const placementsQuerySnapshot = await getDocs(placementsQuery);
      
          const placementsData = placementsQuerySnapshot.docs.map(doc => doc.data());
          setPlacements(placementsData);
        }
      
        fetchAndFilterPlacements();
      }, [userBranch]);
      
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
        async function checkUserDepartment() {
            const deptCollection = collection(db, "department");
            const deptQuery = query(deptCollection, where("uid", "==", user.uid));
            const deptQuerySnapshot = await getDocs(deptQuery);
          
            if (!deptQuerySnapshot.empty) {
              const deptData = deptQuerySnapshot.docs[0].data();
              setHasDepartment(true);
              setUserBranch(deptData.branch || "");  // assuming "branch" is the field name in the "department" collection
            } else {
              setHasDepartment(false);
            }
          }
          

        checkUserDepartment();


    }, [user.uid]);


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
                        <div className="flex justify-around">
                            <BarChart width={600} height={300} data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="batch" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="avgPackage" fill="#8884d8" />
                            </BarChart>

                        </div>


                    </div>
                    
        <div className="mb-8 pb-8 mt-8 pt-8">
        <DeptPlacements data={userBranch} />

          <div className="text-center mt-4"></div>
        </div>

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


                    {hasDepartment && (
                        <div className="text-gray-600 hover:text-blue-500">
                            <Link to="/deptdashboard">
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


        </div>
    );
};

export default DeptDashboard;
