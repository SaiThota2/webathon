import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { collection, getDocs, where, query, doc, deleteDoc } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import Logo from "../assests/BG.jpeg";
import ProjectForm from "./ProjectLinks";

const StudentProfile = () => {
  const { user } = UserAuth();
  const { authorId } = useParams();
  const [profilePhotoURL, setProfilePhotoURL] = useState(null);
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const isCurrentUser = user.uid === authorId;
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [placementStatus, setPlacementStatus] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [packageOffered, setPackageOffered] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState(""); // New state for registration number
  const [batch, setBatch] = useState(""); // New state for batch
  const [branch, setBranch] = useState(""); // New state for branch

  useEffect(() => {
    async function fetchProfileData() {
      if (!authorId) return; // Handle the case where authorId is not provided
  
      const profilesCollection = collection(db, "profiles");
      const q = query(profilesCollection, where("uid", "==", authorId));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
          const profileData = querySnapshot.docs[0].data();
          setProfilePhotoURL(profileData.profilePhotoURL);
          setUsername(profileData.username || "");
          setBio(profileData.bio || "");
          setPlacementStatus(profileData.placementStatus || null);
          setCompanyName(profileData.companyName || "");
          setPackageOffered(profileData.packageOffered || "");
          setRegistrationNumber(profileData.registrationNumber || "");
          setBatch(profileData.batch || "");
          setBranch(profileData.branch || "");
      }
  }
  
    fetchProfileData();

    async function fetchProjectsData() {
      // Fetch projects data from Firestore for the specified authorId
      const projectsCollection = collection(db, "projects");
      const q = query(projectsCollection, where("authorId", "==", authorId));
      const querySnapshot = await getDocs(q);

      const projectData = [];
      querySnapshot.forEach((doc) => {
        projectData.push({ id: doc.id, ...doc.data() });
      });

      setProjects(projectData);
    }

    fetchProjectsData();
  }, [authorId, formSubmitted]);

  // Function to handle the "Add Projects" button click
  const handleAddProjectsClick = () => {
    setShowProjectForm(true); // Show the project form popup
  };

  // Function to handle form submission success
  const handleFormSubmitSuccess = () => {
    setShowProjectForm(false); // Close the project form popup
    setFormSubmitted(true); // Trigger display of newly added project card(s)
  };

  // Function to handle project deletion
  const handleDeleteProject = async (projectId) => {
    try {
      // Create a reference to the project document
      const projectDocRef = doc(db, "projects", projectId);

      // Delete the project document
      await deleteDoc(projectDocRef);

      // Remove the deleted project from the projects state
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== projectId)
      );
    } catch (error) {
      console.error("Error deleting project: ", error);
    }
  };
  


  return (
    <div
      className="bg-gray-100 min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${Logo})` }}
    >
      <div className="bg-white rounded-lg shadow-md w-96 p-6 space-y-6">
        <div className="relative flex items-center justify-center space-x-4">
          <Link to="/dashboard">
            <p className="text-navy-800 absolute top-0 left-0 cursor-pointer">
              <IoMdArrowRoundBack size={24} />
            </p>
          </Link>
          <div className="w-32 h-32 flex rounded-full overflow-hidden bg-gray-300">
            <img
              src={profilePhotoURL || "default-profile-image.jpg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-0 right-0 mt-2 mr-2">
            {isCurrentUser && (
              <Link to="/profile">
                <button className="bg-blue-500 text-white px-2 py-1 rounded-md">
                  Edit
                </button>
              </Link>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Username</h2>
          <p className="text-navy-800">{username}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Bio</h2>
          <p className="text-navy-800">{bio}</p>
        </div>
        <div>
  <h2 className="text-lg font-semibold">Registration Number</h2>
  <p className="text-navy-800">{registrationNumber}</p>
</div>
<div>
  <h2 className="text-lg font-semibold">Batch</h2>
  <p className="text-navy-800">{batch}</p>
</div>
<div>
  <h2 className="text-lg font-semibold">Branch</h2>
  <p className="text-navy-800">{branch}</p>
</div>
        <div>
    <h2 className="text-lg font-semibold">Placement Status</h2>
    <p className="text-navy-800">
        {placementStatus === 'active' 
            ? `Placed at ${companyName} with a package of ${packageOffered}`
            : 'Not Placed'
        }
    </p>
</div>

        
        {/* Add Projects button */}
        {isCurrentUser && (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={handleAddProjectsClick}
          >
            Add Projects
          </button>
        )}
      </div>

      {/* Show the ProjectForm popup when showProjectForm is true */}
      {showProjectForm && (
        <ProjectForm
          onClose={() => setShowProjectForm(false)}
          authorId={authorId}
          onFormSubmitSuccess={handleFormSubmitSuccess}
        />
      )}

      {/* Display project data in cards */}
      {projects.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <h3 className="text-lg font-semibold">{project.projectName}</h3>
                <p className="text-navy-800">{project.projectDescription}</p>
                <a
                  href={project.projectLink}
                  target="_blank" // Set target="_blank" to open in a new tab
                  rel="noopener noreferrer"
                  className="text-navy-500 hover:underline mt-2 inline-block"
                >
                  Project Link
                </a>
                {isCurrentUser && (
                  <button
                    className="bg-gray-500 flex text-white px-2 py-1 rounded-md mt-2"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
