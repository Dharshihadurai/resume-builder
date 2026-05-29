import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ResumeView = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`https://resume-builder-fkrj.onrender.com/api/resumes/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(async (res) => {
        const data = await res.json();

        console.log("STATUS:", res.status);
        console.log("API DATA:", data);

        if (!res.ok) {
          throw new Error(data.message || "Unauthorized / API error");
        }

        return data;
      })
      .then((data) => {
        setResume(data);
      })
      .catch((err) => {
        console.error("Error:", err.message);
        setError(err.message);
      });

  }, [id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (!resume) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{resume.personalInfo?.name}</h1>
      <h3>{resume.personalInfo?.email}</h3>

      <hr />

      <h2>Experience</h2>
      {resume.experience?.length > 0 ? (
        resume.experience.map((item, index) => (
          <p key={index}>{item}</p>
        ))
      ) : (
        <p>No experience added</p>
      )}

      <h2>Education</h2>
      {resume.education?.length > 0 ? (
        resume.education.map((item, index) => (
          <p key={index}>{item}</p>
        ))
      ) : (
        <p>No education added</p>
      )}
    </div>
  );
};

export default ResumeView;