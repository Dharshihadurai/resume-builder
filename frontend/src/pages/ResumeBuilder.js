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
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => {
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
      }).catch(err => {
        console.error("Load error:", err.response?.data || err.message);
      });
    }
  }, [id]);

  const updatePersonal = (field, val) =>
    setData(d => ({
      ...d,
      personalInfo: { ...d.personalInfo, [field]: val }
    }));

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
      } else {
        const r = await axios.post(`${API}/api/resumes`, payload, config);
        navigate(`/builder/${r.data._id}`, { replace: true });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Save error:", err.response?.data || err.message);
      alert("Save failed: " + (err.response?.data?.message || err.message));
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
            <button onClick={handlePrint}>🖨️ Print</button>
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
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="section-content">

          {/* PERSONAL */}
          {activeTab === 'personal' && (
            <div>
              <h3>Personal Information</h3>
              {[
                { key: 'fullName', placeholder: 'Full Name' },
                { key: 'email', placeholder: 'Email' },
                { key: 'phone', placeholder: 'Phone' },
                { key: 'address', placeholder: 'Address' },
                { key: 'linkedin', placeholder: 'LinkedIn URL' },
                { key: 'github', placeholder: 'GitHub URL' },
                { key: 'website', placeholder: 'Website URL' },
              ].map(({ key, placeholder }) => (
                <input
                  key={key}
                  value={data.personalInfo[key] || ''}
                  onChange={e => updatePersonal(key, e.target.value)}
                  placeholder={placeholder}
                />
              ))}
              <textarea
                value={data.personalInfo.summary || ''}
                onChange={e => updatePersonal('summary', e.target.value)}
                placeholder="Professional Summary"
                rows={4}
              />
            </div>
          )}

          {/* EXPERIENCE */}
          {activeTab === 'experience' && (
            <div>
              <button className="add-btn" onClick={() =>
                addItem('experience', {
                  company: '',
                  position: '',
                  startDate: '',
                  endDate: '',
                  description: ''
                })
              }>
                + Add Experience
              </button>

              {data.experience.map((exp, i) => (
                <div key={exp._id || i} className="item-card">
                  <input
                    value={exp.company || ''}
                    onChange={e => updateItem('experience', i, 'company', e.target.value)}
                    placeholder="Company Name"
                  />
                  <input
                    value={exp.position || ''}
                    onChange={e => updateItem('experience', i, 'position', e.target.value)}
                    placeholder="Position / Title"
                  />
                  <div className="date-row">
                    <input
                      value={exp.startDate || ''}
                      onChange={e => updateItem('experience', i, 'startDate', e.target.value)}
                      placeholder="Start Date (e.g. Jan 2022)"
                    />
                    <input
                      value={exp.endDate || ''}
                      onChange={e => updateItem('experience', i, 'endDate', e.target.value)}
                      placeholder="End Date (or Present)"
                    />
                  </div>
                  <textarea
                    value={exp.description || ''}
                    onChange={e => updateItem('experience', i, 'description', e.target.value)}
                    placeholder="Describe your responsibilities and achievements..."
                    rows={3}
                  />
                  <button className="remove-btn" onClick={() => removeItem('experience', i)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* EDUCATION */}
          {activeTab === 'education' && (
            <div>
              <button className="add-btn" onClick={() =>
                addItem('education', {
                  institution: '',
                  degree: '',
                  field: '',
                  startDate: '',
                  endDate: ''
                })
              }>
                + Add Education
              </button>

              {data.education.map((edu, i) => (
                <div key={edu._id || i} className="item-card">
                  <input
                    value={edu.institution || ''}
                    onChange={e => updateItem('education', i, 'institution', e.target.value)}
                    placeholder="Institution Name"
                  />
                  <input
                    value={edu.degree || ''}
                    onChange={e => updateItem('education', i, 'degree', e.target.value)}
                    placeholder="Degree (e.g. Bachelor's)"
                  />
                  <input
                    value={edu.field || ''}
                    onChange={e => updateItem('education', i, 'field', e.target.value)}
                    placeholder="Field of Study"
                  />
                  <div className="date-row">
                    <input
                      value={edu.startDate || ''}
                      onChange={e => updateItem('education', i, 'startDate', e.target.value)}
                      placeholder="Start Year"
                    />
                    <input
                      value={edu.endDate || ''}
                      onChange={e => updateItem('education', i, 'endDate', e.target.value)}
                      placeholder="End Year"
                    />
                  </div>
                  <button className="remove-btn" onClick={() => removeItem('education', i)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* SKILLS */}
          {activeTab === 'skills' && (
            <div>
              <button className="add-btn" onClick={() =>
                addItem('skills', { name: '', level: '' })
              }>
                + Add Skill
              </button>

              {data.skills.map((sk, i) => (
                <div key={sk._id || i} className="item-card skill-card">
                  <input
                    value={sk.name || ''}
                    onChange={e => updateItem('skills', i, 'name', e.target.value)}
                    placeholder="Skill name (e.g. React, Python)"
                  />
                  <select
                    value={sk.level || ''}
                    onChange={e => updateItem('skills', i, 'level', e.target.value)}
                  >
                    <option value="">Level (optional)</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <button className="remove-btn" onClick={() => removeItem('skills', i)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* PROJECTS */}
          {activeTab === 'projects' && (
            <div>
              <button className="add-btn" onClick={() =>
                addItem('projects', { name: '', description: '', link: '' })
              }>
                + Add Project
              </button>

              {data.projects.map((p, i) => (
                <div key={p._id || i} className="item-card">
                  <input
                    value={p.name || ''}
                    onChange={e => updateItem('projects', i, 'name', e.target.value)}
                    placeholder="Project Name"
                  />
                  <input
                    value={p.link || ''}
                    onChange={e => updateItem('projects', i, 'link', e.target.value)}
                    placeholder="Project Link (optional)"
                  />
                  <textarea
                    value={p.description || ''}
                    onChange={e => updateItem('projects', i, 'description', e.target.value)}
                    placeholder="Project description..."
                    rows={3}
                  />
                  <button className="remove-btn" onClick={() => removeItem('projects', i)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* LIVE PREVIEW - always gets latest `data` */}
      <div className="preview-panel" ref={printRef}>
        <ResumePreview data={data} />
      </div>
    </div>
  );
}