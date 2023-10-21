import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const ProjectForm = ({ onClose, authorId }) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectLink, setProjectLink] = useState("https://"); // Initialize with "https://"

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the project link
    if (!isValidURL(projectLink)) {
      alert("Please enter a valid URL starting with 'https://'");
      return;
    }

    // Create a new document in the "projects" collection
    try {
      const projectRef = collection(db, "projects");
      await addDoc(projectRef, {
        authorId,
        projectName,
        projectDescription,
        projectLink,
      });

      // Close the project form popup
      onClose();
    } catch (error) {
      console.error("Error adding project: ", error);
    }
  };

  // Function to validate a URL
  const isValidURL = (url) => {
    const pattern = /^https:\/\//i;
    return pattern.test(url);
  };

  return (
    <div className="fixed backdrop-blur-md inset-0 flex justify-center items-center bg-gray-800 z-50">
      <div className="bg-white p-4 rounded-md shadow-md w-2/3">
        {/* Close button */}
        <h2 className="text-3xl mb-4">Add a Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="projectName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              placeholder="Project Name"
              className="border border-gray-400 py-1 px-2 w-full"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="projectDescription"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Project Description
            </label>
            <textarea
              id="projectDescription"
              placeholder="Project Description"
              className="border border-gray-400 py-1 px-2 w-full"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="projectLink"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Project Link
            </label>
            <input
              type="text"
              id="projectLink"
              placeholder="Project Link"
              className="border border-gray-400 py-1 px-2 w-full"
              value={projectLink}
              onChange={(e) => setProjectLink(e.target.value)}
              required
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button className="bg-blue-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg">
              Submit
            </button>
            <button
              className="bg-blue-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
