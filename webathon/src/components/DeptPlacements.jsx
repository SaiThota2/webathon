import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

const DeptPlacements = () => {
    const [placements, setPlacements] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchPlacements = async () => {
            try {
                const placementsCollection = collection(db, "placements");
                // Filter placements by the AI&DS branch
                const filteredPlacements = query(placementsCollection, where("branch", "==", "AI&DS"));
                const querySnapshot = await getDocs(filteredPlacements);
                const placementData = querySnapshot.docs.map((doc) => doc.data());
                setPlacements(placementData);
            } catch (error) {
                console.error("Error fetching placements:", error);
            }
        };

        fetchPlacements();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-black p-4">
            <div className="flex items-center mb-6 space-x-4">
                <Link to="/dashboard">
                    <button className="bg-green-400 px-2 py-1 rounded hover:text-white">Home</button>
                </Link>
                <h1 className="text-4xl font-bold text-navy-900">Placements</h1>
                <div className="relative">
                   
                </div>
            </div>
            {placements.map((placement, index) => (
                <div key={index}>
                    <div className="border grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5 max-w-5xl border-gray-200 p-4 rounded-lg mb-4 shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-r from-blue-200 to-black">
                        <div className="flex flex-col items-center mb-4">
                            <img
                                src={placement.profilePhotoURL}
                                alt="profile photo"
                                className="w-40 h-40 object-cover rounded-full mb-2"
                            />
                            <h2 className="text-xl font-semibold text-navy-900">{placement.registrationNumber}</h2>
                            <h2 className="text-xl font-semibold text-navy-900">{placement.username}</h2>
                        </div>
                        <p className="text-navy-900 flex justify-center items-center mt-2">Batch: {placement.batch}</p>
                        <p className="text-navy-900 flex justify-center items-center mt-2">Branch: {placement.branch}</p>
                        <p className="text-navy-900 flex justify-center items-center mt-2">Company: {placement.companyName}</p>
                        <p className="text-navy-900 flex justify-center items-center mt-2">Package Offered: {placement.packageOffered}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DeptPlacements;
