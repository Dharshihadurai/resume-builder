import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ResumeView = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);

  useEffect(() => {
    // TODO: replace with your API call
    fetch(`http://localhost:5000/api/resume/${id}`)
      .then(res => res.json())
      .then(data => setResume(data));
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