import React, { useState, useEffect } from "react";
import { db, storage } from "../firebaseConfig";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { UserAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

import { Link } from "react-router-dom";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaSpinner } from "react-icons/fa"; // Import the spinner icon
import Logo from "../assests/BG.jpeg";
import emailjs from "emailjs-com";

const Profile = () => {
  const { user } = UserAuth();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoURL, setProfilePhotoURL] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false); // New state for upload status
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState(""); // New state for registration number
  const [batch, setBatch] = useState(""); // New state for batch
  const [branch, setBranch] = useState(""); // New state for branch

  const [placementStatus, setPlacementStatus] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [packageOffered, setPackageOffered] = useState("");
  const [offerLetter, setOfferLetter] = useState(null);
  

  useEffect(() => {
    async function fetchProfilePhotoURL() {
      if (!user.uid) return;

      const profilesCollection = collection(db, "profiles");
      const q = query(profilesCollection, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const profileData = querySnapshot.docs[0].data();
        setProfilePhotoURL(profileData.profilePhotoURL);
        setUsername(profileData.username || "");
        setBio(profileData.bio || "");
        setRegistrationNumber(profileData.registrationNumber || ""); // Set registration number from Firestore
        setBatch(profileData.batch || ""); // Set batch from Firestore
        setBranch(profileData.branch || ""); // Set branch from Firestore
      }
    }

    fetchProfilePhotoURL();
  }, [user.uid, profilePhotoURL]);

  const handlePhotoUpload = async () => {
    if (!profilePhoto || !user?.uid) return;

    try {
      setIsUploading(true); // Set upload status to true

      const storageRef = ref(storage, `profile-photos/${user.uid}`);
      await uploadBytes(storageRef, profilePhoto);

      const photoURL = await getDownloadURL(storageRef);
      setProfilePhotoURL(photoURL);
      setSelectedFileName("");
      setIsUploading(false); // Set upload status to false after successful upload

      const profilesCollection = collection(db, "profiles");
      const profileQuery = query(
        profilesCollection,
        where("uid", "==", user.uid)
      );
      const profileSnapshot = await getDocs(profileQuery);
      if (!profileSnapshot.empty) {
        const profileDoc = profileSnapshot.docs[0];
        const profileDocRef = doc(db, "profiles", profileDoc.id);

        // Update the document with the new photo URL and bio
        await updateDoc(profileDocRef, {
          profilePhotoURL: photoURL,
          registrationNumber, // Include registration number in the update
          batch, // Include batch in the update
          branch, 
        });

        toast.success("Profile updated successfully");
      } else {
        await addDoc(profilesCollection, {
          uid:user.uid,
          profilePhotoURL: photoURL,
          registrationNumber, // Include registration number in the creation
          batch, // Include batch in the creation
          branch, 
        });

        toast.success("Profile created successfully");
      }
    } catch (error) {
      setIsUploading(false); // Set upload status to false on error

      console.error("Error adding data to Firestore:", error);
      toast.error(error);
    }
  };
  const sendEmail = () => {
    // Define your template parameters here
    const templateParams = {
      username: username,
      bio: bio,
      registrationNumber: registrationNumber,
      batch: batch,
      branch: branch,
      placementStatus: placementStatus,
      companyName: companyName,
      packageOffered: packageOffered,
      // Add other details as needed
    };
  
    emailjs.send('service_7e6jwna', 'template_6d2gjfa', templateParams, '8KxLJH_yEEOQgZvpz')
      .then((response) => {
        console.log('Email successfully sent!', response);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  }
  
 
  const handleSave = async () => {
    if (!user?.uid) return;

    try {
      const profilesCollection = collection(db, "profiles");
      const profileQuery = query(profilesCollection, where("uid", "==", user.uid));
      const profileSnapshot = await getDocs(profileQuery);

      let offerLetterURL = null;
      if (offerLetter) {
        const storageRef = ref(storage, `offer-letters/${user.uid}`);
        await uploadBytes(storageRef, offerLetter);
        offerLetterURL = await getDownloadURL(storageRef);
      }

      const profileData = {
        uid: user.uid,
        username: username,
        bio: bio,
        profilePhotoURL: profilePhotoURL,
        registrationNumber: registrationNumber, // Include registration number
        batch: batch, // Include batch
        branch: branch, // Include branch
        placementStatus: placementStatus,
        companyName: placementStatus === "active" ? companyName : null,
        packageOffered: placementStatus === "active" ? packageOffered : null,
        offerLetterURL: offerLetterURL,
      };

      if (!profileSnapshot.empty) {
        const profileDoc = profileSnapshot.docs[0];
        const profileDocRef = doc(db, "profiles", profileDoc.id);

        // Update the document with the new data
        await updateDoc(profileDocRef, profileData);
        sendEmail();
        toast.success("Profile updated successfully");
      } else {
        await addDoc(profilesCollection, profileData);
        toast.success("Profile created successfully");
      }
    } catch (error) {
      console.error("Error saving profile data to Firestore:", error);
      toast.error(error.message || "Error saving profile data");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setSelectedFileName(file.name);
    }
  };
  const handlePlacementStatusChange = (e) => {
    setPlacementStatus(e.target.value);
  };

  const handleOfferLetterChange = (e) => {
    setOfferLetter(e.target.files[0]);
  };
  const handleRegistrationNumberChange = (e) => {
    setRegistrationNumber(e.target.value);
  };

  const handleBatchChange = (e) => {
    setBatch(e.target.value);
  };

  const handleBranchChange = (e) => {
    setBranch(e.target.value);
  };
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 "
      style={{ backgroundImage: `url(${Logo})` }}
    >
      <div className="bg-white w-full max-w-sm p-6 rounded-lg shadow-md">
      <Link to={`/profile/${user.uid}`}>
          <FontAwesomeIcon
            icon={faUser}
            size="lg"
            className="text-gray-600  top-0 left-0 mt-2 ml-2 cursor-pointer"
          />{" "}
         
        </Link>
        <h2 className="text-2xl font-semibold mb-4 text-center">Edit Profile</h2>
        <div className="mb-6">
          {profilePhotoURL ? (
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden">
                <img
                  src={profilePhotoURL}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              {selectedFileName && (
                <div className="flex flex-col items-center mt-2">
                  <p className="text-gray-500 mr-2">
                    Selected File: {selectedFileName}
                  </p>
                  <button
                    className="bg-blue-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg"
                    onClick={handlePhotoUpload}
                    disabled={isUploading} // Disable the button when uploading
                  >
                    {isUploading ? (
                      <>
                        Uploading <FaSpinner className="animate-spin ml-1" />
                      </>
                    ) : (
                      "Upload"
                    )}
                  </button>
                </div>
              )}
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 p-2 border rounded-md w-full"
              />
              <label htmlFor="bio">Bio</label>
              <textarea
                placeholder="Enter your bio..."
                value={bio}
                id="bio"
                onChange={(e) => setBio(e.target.value)}
                className="mt-2 p-2 border rounded-md w-full"
              ></textarea>
               <label htmlFor="registrationNumber">Registration Number</label>
          <input
            type="text"
            id="registrationNumber"
            value={registrationNumber}
            onChange={handleRegistrationNumberChange}
            className="mt-1 p-2 border rounded-md w-full"
          />
          <label htmlFor="batch">Batch</label>
          <input
            type="text"
            id="batch"
            value={batch}
            onChange={handleBatchChange}
            className="mt-1 p-2 border rounded-md w-full"
          />
          <label htmlFor="branch">Branch</label>
          <input
            type="text"
            id="branch"
            value={branch}
            onChange={handleBranchChange}
            className="mt-1 p-2 border rounded-md w-full"
          />

          {/* ... */}
      
              <label
                htmlFor="profile-photo-input"
                className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 mt-2"
              >
                Change Profile Photo
              </label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                id="profile-photo-input"
              />
            </div>
          ) : (
          
              <div className="flex flex-col items-center "style={{ backgroundImage: `url(${Logo})` }}>
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden">
                <img
                  src={profilePhotoURL || "https://via.placeholder.com/50"}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                id="profile-photo-input"
              />
              <label
                htmlFor="profile-photo-input"
                className="cursor-pointer  bg-blue-500 text-white px-1 rounded-lg hover:bg-green-400"
              >
                Add Profile Photo
              </label>

              {selectedFileName && (
                <div className="flex items-center mt-2">
                  <p className="text-gray-500 mr-2">
                    Selected File: {selectedFileName}
                  </p>
                  <button
                    className="bg-blue-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg"
                    onClick={handlePhotoUpload}
                    disabled={isUploading} // Disable the button when uploading
                  >
                    {isUploading ? (
                      <>
                        Uploading <FaSpinner className="animate-spin ml-1" />
                      </>
                    ) : (
                      "Upload"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Placement Status</h2>

        <label>
          <input
            type="radio"
            value="notActive"
            checked={placementStatus === 'notActive'}
            onChange={handlePlacementStatusChange}
          />
          Not Placed
        </label>
        <label>
          <input
            type="radio"
            value="active"
            checked={placementStatus === 'active'}
            onChange={handlePlacementStatusChange}
          />
          Placed
        </label>

        {placementStatus === 'notActive' && <p>Placement not done yet.</p>}

        {placementStatus === 'active' && (
          <div>
            <label>
              Company Name:
              <input 
                type="text" 
                value={companyName} 
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-1 p-2 border rounded-md w-full"
              />
            </label>

            <label>
              Package in lpa:
              <input 
                type="text" 
                value={packageOffered}
                onChange={(e) => setPackageOffered(e.target.value)}
                className="mt-1 p-2 border rounded-md w-full"
              />
            </label>

            <label>
              Offer Letter:
              <input 
                type="file" 
                onChange={handleOfferLetterChange}
                className="mt-1 p-2 border rounded-md w-full"
              />
            </label>
            {/* Add a submit button to submit the placement details */}
          </div>
        )}
      </div>

        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg self-end"
        >
          {isUploading ? (
            <>
              Saving <FaSpinner className="animate-spin ml-1" />
            </>
          ) : (
            "Save"
          )}
        </button>
        

        {/* Additional form fields for other details */}
      </div>
    </div>
  );
};

export default Profile;
