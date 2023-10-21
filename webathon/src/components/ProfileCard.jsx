import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { collection, addDoc } from "firebase/firestore"; // Import Firestore methods for deleting documents
import { db } from "../firebaseConfig"; // Import Firestore methods

const ProfileCard = ({ profile, onAccept ,onDelete}) => {
  const offerLetterURL = profile.offerLetterURL;

  // State to track whether the profile has been accepted
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAccept = async () => {
    try {
      // Add the accepted profile to the "placements" collection
      const placementsCollection = collection(db, "placements");
      await addDoc(placementsCollection, profile);

      // Trigger the onAccept function to remove the profile from the current view
      onAccept(profile.uid);

      // Update the state to mark the profile as accepted
      setIsAccepted(true);
    } catch (error) {
      console.error("Error accepting profile:", error);
    }
  };



  return (
    <div className="border border-gray-200 p-4 rounded-lg mb-4 shadow-md">
      <div
        className="flex float-right cursor-pointer text-red-500"
        onClick={onDelete}
      >
        <FaTrash />
      </div>
      <div className="flex flex-col items-center">
        <img
          src={profile.profilePhotoURL}
          alt="yo"
          className="w-40 h-40 object-cover rounded-full mb-2"
        />
        <h2 className="text-xl font-semibold">{profile.registrationNumber}</h2>
        <h2 className="text-xl font-semibold">{profile.username}</h2>
      </div>
      <p className="text-gray-800 text-center mt-2">Batch: {profile.batch}</p>
      <p className="text-gray-800 text-center mt-2">Branch: {profile.branch}</p>
      <p className="text-gray-800 text-center mt-2">Company: {profile.companyName}</p>
      <p className="text-gray-800 text-center mt-2">Package Offered: {profile.packageOffered}</p>
      <div className="flex justify-between items-center">
        {offerLetterURL && (
          <div className="">
            <a
              href={offerLetterURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Download/View Offer Letter
            </a>
          </div>
        )}
        {!isAccepted && (
          <div
            className="cursor-pointer text-green-500"
            onClick={handleAccept}
          >
            Accept
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
