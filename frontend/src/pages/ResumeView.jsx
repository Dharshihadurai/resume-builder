import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ResumeView = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`https://resume-builder-fkrj.onrender.com/api/resumes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (res) => {
        const data = await res.json();

        console.log("STATUS:", res.status);
        console.log("API DATA:", data);

        if (!res.ok) {
          throw new Error(data.message || "Failed to load resume");
        }

        return data;
      })
      .then((data) => {
        setResume(data);
      })
      .catch((err) => {
        console.error(err.message);
        setError(err.message);
      });
  }, [id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

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