import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import PlacementCard from "./PlacementCard";

const Placements = () => {
  const [placements, setPlacements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const placementsCollection = collection(db, "placements");
        const querySnapshot = await getDocs(placementsCollection);
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5 max-w-5xl">
        {placements
            .filter((placement) => {
                const username = placement.username?.toLowerCase() || '';
                const registrationNumber = placement.registrationNumber?.toLowerCase() || '';
                const batch = placement.batch?.toLowerCase() || '';
                const branch = placement.branch?.toLowerCase() || '';
                const companyName = placement.companyName?.toLowerCase() || '';

                return (
                    username.includes(searchTerm.toLowerCase()) ||
                    registrationNumber.includes(searchTerm.toLowerCase()) ||
                    batch.includes(searchTerm.toLowerCase()) ||
                    branch.includes(searchTerm.toLowerCase()) ||   
                    companyName.includes(searchTerm.toLowerCase())
                );
            })
            .map((placement) => (
                <PlacementCard key={placement.uid} placement={placement} />
            ))}
      </div>
    </div>
  );
};

export default Placements;
