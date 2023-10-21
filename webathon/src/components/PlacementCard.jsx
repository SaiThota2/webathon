import React from "react";

const PlacementCard = ({ placement }) => {
  return (
    <div className="border border-gray-200 p-4 rounded-lg mb-4 shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-r from-blue-200 to-black">
      <div className="flex flex-col items-center mb-4">
        <img
          src={placement.profilePhotoURL}
          alt="profile photo"
          className="w-40 h-40 object-cover rounded-full mb-2"
        />
        <h2 className="text-xl font-semibold text-navy-900">{placement.registrationNumber}</h2>
        <h2 className="text-xl font-semibold text-navy-900">{placement.username}</h2>
      </div>
      <p className="text-navy-900 text-center mt-2">Batch: {placement.batch}</p>
      <p className="text-navy-900 text-center mt-2">Branch: {placement.branch}</p>
      <p className="text-navy-900 text-center mt-2">Company: {placement.companyName}</p>
      <p className="text-navy-900 text-center mt-2">Package Offered: {placement.packageOffered}</p>
      {/* Add more placement fields as needed */}
    </div>
  );
};

export default PlacementCard;
