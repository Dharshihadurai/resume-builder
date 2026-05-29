import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const API = "https://resume-builder-fkrj.onrender.com";

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/api/resumes`)
      .then(r => {
        setResumes(r.data);
        setLoading(false);
      });
  }, []);

  const deleteResume = async (id) => {
    if (!window.confirm('Delete this resume?')) return;

    await axios.delete(`${API}/api/resumes/${id}`);

    setResumes(prev => prev.filter(r => r._id !== id));
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>My Resumes</h1>
          <p>
            {resumes.length} resume{resumes.length !== 1 ? 's' : ''} created
          </p>
        </div>

        <Link to="/builder" className="btn btn-primary">
          + Create New Resume
        </Link>
      </div>

      {resumes.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📄</div>
          <h2>No resumes yet</h2>
          <p>Create your first professional resume to get started</p>

          <Link to="/builder" className="btn btn-primary" style={{ marginTop: 16 }}>
            Create Resume
          </Link>
        </div>
      ) : (
        <div className="resume-grid">
          {resumes.map(r => (
            <div key={r._id} className="resume-card card">
              
              <div className="resume-card-top">
                <div className="resume-icon">📋</div>

                <div>
                  <h3>{r.title || 'Untitled Resume'}</h3>
                  <p className="resume-name">
                    {r.personalInfo?.fullName || 'No name set'}
                  </p>
                  <p className="resume-date">
                    Updated {new Date(r.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="resume-card-actions">
                
                {/* VIEW BUTTON */}
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => navigate(`/resume/${r._id}`)}
                >
                  View
                </button>

                {/* EDIT BUTTON */}
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => navigate(`/builder/${r._id}`)}
                >
                  Edit
                </button>

                {/* DELETE BUTTON */}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteResume(r._id)}
                >
                  Delete
                </button>

              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}