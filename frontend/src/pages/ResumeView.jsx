import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ResumeView = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
useEffect(() => {
  console.log("Resume ID:", id);

  fetch(`https://resume-builder-fkrj.onrender.com/api/resumes/${id}`)
    .then(res => {
      console.log("Status:", res.status);
      return res.json();
    })
    .then(data => {
      console.log("API DATA:", data);
      setResume(data);
    })
    .catch(err => console.log("Error:", err));

}, [id]);
  if (!resume) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{resume.name}</h1>
      <h3>{resume.email}</h3>

      <hr />

      <h2>Experience</h2>
      <p>{resume.experience}</p>

      <h2>Education</h2>
      <p>{resume.education}</p>
    </div>
  );
};

export default ResumeView;