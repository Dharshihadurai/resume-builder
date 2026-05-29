import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ResumePreview from '../components/ResumePreview';
import './ResumeBuilder.css';

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

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(EMPTY);
  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const printRef = useRef();

  // LOAD DATA
  useEffect(() => {
    if (id) {
      const token = localStorage.getItem("token");

      axios.get(`${API}/api/resumes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(r => {
        const res = r.data;

        setData({
          ...EMPTY,
          ...res,
          personalInfo: {
            ...EMPTY.personalInfo,
            ...(res.personalInfo || {})
          },
          experience: res.experience || [],
          education: res.education || [],
          skills: res.skills || [],
          projects: res.projects || []
        });
      });
    }
  }, [id]);

  const updatePersonal = (field, val) =>
    setData(d => ({
      ...d,
      personalInfo: {
        ...d.personalInfo,
        [field]: val
      }
    }));

  // ✅ SAVE FUNCTION (FIXED + REFRESH)
  const save = async () => {
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        title: data.title,
        personalInfo: data.personalInfo,
        experience: data.experience || [],
        education: data.education || [],
        skills: data.skills || [],
        projects: data.projects || []
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };

      if (id) {
        await axios.put(`${API}/api/resumes/${id}`, payload, config);

        // 🔥 REFRESH AFTER SAVE
        const updated = await axios.get(`${API}/api/resumes/${id}`, config);

        setData({
          ...EMPTY,
          ...updated.data,
          personalInfo: {
            ...EMPTY.personalInfo,
            ...(updated.data.personalInfo || {})
          },
          experience: updated.data.experience || [],
          education: updated.data.education || [],
          skills: updated.data.skills || [],
          projects: updated.data.projects || []
        });

      } else {
        const r = await axios.post(`${API}/api/resumes`, payload, config);
        navigate(`/resume/${r.data._id}`, { replace: true });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);

    } catch (err) {
      console.log("SAVE ERROR:", err.response?.data || err.message);
    } finally {
      setSaving(false);
    }
  };

  const addItem = (section, template) =>
    setData(d => ({
      ...d,
      [section]: [...d[section], { ...template, _id: Date.now().toString() }]
    }));

  const updateItem = (section, index, field, val) =>
    setData(d => ({
      ...d,
      [section]: d[section].map((item, i) =>
        i === index ? { ...item, [field]: val } : item
      )
    }));

  const removeItem = (section, index) =>
    setData(d => ({
      ...d,
      [section]: d[section].filter((_, i) => i !== index)
    }));

  const handlePrint = () => window.print();

  const TABS = ['personal', 'experience', 'education', 'skills', 'projects'];

  return (
    <div className="builder-layout">

      <div className="builder-panel">

        <div className="builder-top">
          <input
            className="title-input"
            value={data.title}
            onChange={e => setData(d => ({ ...d, title: e.target.value }))}
          />

          <div className="builder-actions">
            <button onClick={handlePrint}>
              🖨️ Print
            </button>

            <button onClick={save} disabled={saving}>
              {saving ? "Saving..." : saved ? "✓ Saved" : "Save"}
            </button>
          </div>
        </div>

        <div className="tabs">
          {TABS.map(t => (
            <button
              key={t}
              className={activeTab === t ? "active" : ""}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="section-content">

          {/* PERSONAL */}
          {activeTab === 'personal' && (
            <div>
              <h3>Personal Information</h3>
              {['fullName', 'email', 'phone', 'address', 'linkedin', 'github', 'website'].map(f => (
                <input
                  key={f}
                  value={data.personalInfo[f]}
                  onChange={e => updatePersonal(f, e.target.value)}
                  placeholder={f}
                />
              ))}
              <textarea
                value={data.personalInfo.summary}
                onChange={e => updatePersonal('summary', e.target.value)}
                placeholder="Summary"
              />
            </div>
          )}

          {/* EXPERIENCE */}
          {activeTab === 'experience' && (
            <div>
              <button onClick={() =>
                addItem('experience', {
                  company: '',
                  position: '',
                  description: ''
                })
              }>
                + Add Experience
              </button>

              {data.experience.map((exp, i) => (
                <div key={i}>
                  <input
                    value={exp.company}
                    onChange={e => updateItem('experience', i, 'company', e.target.value)}
                    placeholder="Company"
                  />
                  <input
                    value={exp.position}
                    onChange={e => updateItem('experience', i, 'position', e.target.value)}
                    placeholder="Position"
                  />
                  <textarea
                    value={exp.description}
                    onChange={e => updateItem('experience', i, 'description', e.target.value)}
                    placeholder="Description"
                  />
                  <button onClick={() => removeItem('experience', i)}>Remove</button>
                </div>
              ))}
            </div>
          )}

          {/* EDUCATION */}
          {activeTab === 'education' && (
            <div>
              <button onClick={() =>
                addItem('education', {
                  institution: '',
                  degree: '',
                  field: ''
                })
              }>
                + Add Education
              </button>

              {data.education.map((edu, i) => (
                <div key={i}>
                  <input
                    value={edu.institution}
                    onChange={e => updateItem('education', i, 'institution', e.target.value)}
                    placeholder="Institution"
                  />
                  <input
                    value={edu.degree}
                    onChange={e => updateItem('education', i, 'degree', e.target.value)}
                    placeholder="Degree"
                  />
                  <input
                    value={edu.field}
                    onChange={e => updateItem('education', i, 'field', e.target.value)}
                    placeholder="Field"
                  />
                  <button onClick={() => removeItem('education', i)}>Remove</button>
                </div>
              ))}
            </div>
          )}

          {/* SKILLS */}
          {activeTab === 'skills' && (
            <div>
              <button onClick={() =>
                addItem('skills', { name: '', level: '' })
              }>
                + Add Skill
              </button>

              {data.skills.map((sk, i) => (
                <div key={i}>
                  <input
                    value={sk.name}
                    onChange={e => updateItem('skills', i, 'name', e.target.value)}
                    placeholder="Skill"
                  />
                </div>
              ))}
            </div>
          )}

          {/* PROJECTS */}
          {activeTab === 'projects' && (
            <div>
              <button onClick={() =>
                addItem('projects', { name: '', description: '' })
              }>
                + Add Project
              </button>

              {data.projects.map((p, i) => (
                <div key={i}>
                  <input
                    value={p.name}
                    onChange={e => updateItem('projects', i, 'name', e.target.value)}
                    placeholder="Project Name"
                  />
                  <textarea
                    value={p.description}
                    onChange={e => updateItem('projects', i, 'description', e.target.value)}
                    placeholder="Description"
                  />
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      <div className="preview-panel" ref={printRef}>
        <ResumePreview data={data} />
      </div>

    </div>
  );
}