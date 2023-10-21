import React, { useState } from 'react';
import { storage } from '../firebaseConfig';
import emailjs from 'emailjs-com';
import Papa from 'papaparse';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ref, uploadBytes } from "firebase/storage";
export default function PlacementUpload() {
  const [file, setFile] = useState(null);


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const uploadResults = async () => {
    if (!file) return;

    const storageRef = ref(storage, `placement-results/${file.name}`);
    await uploadBytes(storageRef, file);

    Papa.parse(file, {
        complete: function(results) {
            const students = results.data.filter(row => row[2] === "Student");
            const coordinators = results.data.filter(row => row[2] === "Coordinator");

            students.forEach(student => {
                const studentEmailData = {
                    to_email: student[0],
                    student_name: student[1],
                };

                emailjs.send('service_7e6jwna', 'template_10hrwre', studentEmailData, '8KxLJH_yEEOQgZvpz')
                .then(response => {
                    console.log('SUCCESS!', response.status, response.text);
                    toast.success("Successfully uploaded placement results!");
                }, error => {
                    console.error('FAILED...', error);
                    toast.error("Failed to upload placement results.");
                });
            });

            coordinators.forEach(coordinator => {
                const coordinatorEmailData = {
                    to_email: coordinator[0],
                    coordinator_name: coordinator[1],
                };

                emailjs.send('service_dazmzt7', 'template_rbhy5br', coordinatorEmailData, 'Xk-RmJCqeZaMLy4MX')
                .then(response => {
                    console.log('SUCCESS!', response.status, response.text);
                }, error => {
                    console.error('FAILED...', error);
                });
            });
        }
    });
};

return (
    <div className="flex flex-col h-max-screen  items-center justify-center">
    <div className="p-6 bg-white rounded-lg shadow-xl ">
        <h2 className="text-2xl font-bold mb-4 text-center">Notify Placement Results</h2>
        <div className="flex flex-col space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Select CSV File:</label>
                <input type="file" onChange={handleFileChange} className="p-2 border rounded w-full"/>
            </div>
            <button onClick={uploadResults} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded w-full transition duration-300">
                Notify Results
            </button>
        </div>
    </div>
</div>
);
}