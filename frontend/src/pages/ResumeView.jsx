import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ResumePreview from '../components/ResumePreview';

const API = "https://resume-builder-fkrj.onrender.com";

const EMPTY = {
  title: 'My Resume',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    website: '',
    summary: ''
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
};

export default function ResumeView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('No resume ID provided.');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    axios.get(`${API}/api/resumes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => {
        const res = r.data;
        setData({
          ...EMPTY,
          ...res,
          personalInfo: { ...EMPTY.personalInfo, ...(res.personalInfo || {}) },
          experience: res.experience || [],
          education: res.education || [],
          skills: res.skills || [],
          projects: res.projects || []
        });
      })
      .catch(err => {
        console.error("View load error:", err.response?.data || err.message);
        setError('Failed to load resume. It may not exist or you may not have access.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div style={styles.center}>
        <p style={styles.loadingText}>Loading resume...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.center}>
        <p style={styles.errorText}>{error}</p>
        <button style={styles.btn} onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Toolbar - hidden on print */}
      <div style={styles.toolbar} className="no-print">
        <Link to="/dashboard" style={styles.backLink}>← Dashboard</Link>
        <h2 style={styles.toolbarTitle}>{data.title}</h2>
        <div style={styles.toolbarActions}>
          <button
            style={styles.btn}
            onClick={() => navigate(`/builder/${id}`)}
          >
            ✏️ Edit
          </button>
          <button
            style={{ ...styles.btn, ...styles.btnPrimary }}
            onClick={handlePrint}
          >
            🖨️ Print / Save PDF
          </button>
        </div>
      </div>

      {/* Resume Content */}
      <div style={styles.previewWrapper}>
        <ResumePreview data={data} />
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    paddingBottom: '40px',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    flexWrap: 'wrap',
    gap: '10px',
  },
  toolbarTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 600,
    color: '#1a202c',
  },
  toolbarActions: {
    display: 'flex',
    gap: '10px',
  },
  backLink: {
    textDecoration: 'none',
    color: '#4a5568',
    fontWeight: 500,
    fontSize: '14px',
  },
  btn: {
    padding: '8px 16px',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#2d3748',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
  },
  btnPrimary: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: '1px solid #2563eb',
  },
  previewWrapper: {
    maxWidth: '860px',
    margin: '30px auto',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '16px',
  },
  loadingText: {
    color: '#718096',
    fontSize: '16px',
  },
  errorText: {
    color: '#e53e3e',
    fontSize: '16px',
    textAlign: 'center',
    maxWidth: '400px',
  },
};