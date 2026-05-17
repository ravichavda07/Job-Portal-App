import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import { assets, jobsApplied } from "../assets/assets";
import moment from "moment";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

const Applications = () => {

  const { user } = useUser()
  const { getToken } = useAuth()

  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);

  // ✅ NEW STATES
  const [resumeScore, setResumeScore] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const { backendUrl, userData, userApplications = [], fetchUserData, fetchUserApplications} = useContext(AppContext)

  const updateResume = async () => {

    try {
      
      const formData = new FormData()
      formData.append('resume',resume)

      const token = await getToken()

      const { data } = await axios.post(backendUrl + '/api/users/update-resume',
        formData,
        {headers:{ Authorization : `Bearer ${token}`} }
      )

      if (data.success) {
        toast.success(data.message)
        await fetchUserData()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }

    setIsEdit(false)
    setResume(null)
  }

  // ✅ NEW FUNCTION
  const reviewResume = async () => {
    if (!userData?.resume) {
      toast.error("Please upload resume first");
      return;
    }

    try {
      setIsReviewing(true);

      // 🔹 Replace with backend API later
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const score = Math.floor(Math.random() * 40) + 60; // 60–100
      setResumeScore(score);

      toast.success("Resume reviewed successfully!");
    } catch (error) {
      toast.error("Failed to review resume");
    }

    setIsReviewing(false);
  };

  useEffect(()=>{
    if (user) {
      fetchUserApplications()
    }
  },[user])

  return (
    <>
      <Navbar />
      <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
        
        <h2 className="text-xl font-semibold">Your Resume</h2>

        {/* ✅ UPDATED RESUME SECTION */}
        <div className="flex items-center justify-between mb-6 mt-3">
          
          <div>
            {isEdit || userData && userData.resume === ""
            ? <>
                <label className="flex items-center" htmlFor="resumeUpload">
                  <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2">
                    {resume ? resume.name : "Select Resume"}
                  </p>
                  <input 
                    id="resumeUpload" 
                    onChange={e => setResume(e.target.files[0])} 
                    accept="application/pdf" 
                    type="file" 
                    hidden 
                  />
                  <img src={assets.profile_upload_icon} alt="" />
                </label>
                <button 
                  onClick={updateResume} 
                  className="bg-green-100 border border-green-400 rounded-lg px-4 py-2 mt-4"
                >
                  Save
                </button>
            </> 
            : <div className="flex gap-2">
                <a className="bg-blue-100 text-blue-600 px-4 py-2 rounded" href="">
                  Resume
                </a>
                <button 
                  onClick={()=>setIsEdit(true)} 
                  className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2"
                >
                  Edit
                </button>
              </div>
            }
          </div>

          {/* ✅ REVIEW BUTTON + SCORE */}
          <div className="text-right">
            <button
              onClick={reviewResume}
              disabled={isReviewing}
              className="bg-purple-100 text-purple-600 border border-purple-400 rounded-lg px-4 py-2"
            >
              {isReviewing ? "Reviewing..." : "Review Resume"}
            </button>

            {resumeScore !== null && (
              <p className="mt-2 text-sm font-semibold text-gray-700">
                Score: {resumeScore}/100
              </p>
            )}
          </div>

        </div>

        <h2 className="text-xl font-semibold mb-4">Job Applied</h2>

        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b text-left">Company</th>
              <th className="py-3 px-4 border-b text-left">Job Title</th>
              <th className="py-3 px-4 border-b text-left max-sm:hidden">Location</th>
              <th className="py-3 px-4 border-b text-left max-sm:hidden">Date</th>
              <th className="py-3 px-4 border-b text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {userApplications.map((job, index) => true ? (
              <tr key={index}>
                <td className="py-3 px-4 flex items-center gap-2 border-b">
                  <img className="w-8 h-8" src={job.companyId.image} alt="" />
                  {job.companyId.name}
                </td>

                <td className="py-2 px-4 border-b">
                  {job.jobId.title}
                </td>

                <td className="py-2 px-4 border-b max-sm:hidden">
                  {job.jobId.location}
                </td>

                <td className="py-2 px-4 border-b max-sm:hidden">
                  {moment(job.date).format('ll')}
                </td>

                <td className="py-2 px-4 border-b">
                  <span className={`${
                    job.status === 'Accepted' 
                      ? 'bg-green-300' 
                      : job.status === 'Rejected' 
                      ? 'bg-red-300' 
                      : 'bg-blue-100'
                  } px-4 py-1.5 rounded`}>
                    {job.status}
                  </span>
                </td>
              </tr>
            ): null)}
          </tbody>
        </table>

      </div>

      <Footer />
    </>
  );
};

export default Applications;