
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ResumePreview from '../components/ResumePreview';
import './ResumeBuilder.css';
const API = "https://resume-builder-fkrj.onrender.com";

const EMPTY = {
  title: 'My Resume',
  personalInfo: { fullName:'', email:'', phone:'', address:'', linkedin:'', github:'', website:'', summary:'' },
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

  useEffect(() => {
    if (id) {
      axios.get(`${API}/api/resumes/${id}`).then(r => setData(r.data));
    }
  }, [id]);

  const updatePersonal = (field, val) =>
    setData(d => ({ ...d, personalInfo: { ...d.personalInfo, [field]: val } }));

  const save = async () => {
    setSaving(true);
    try {
      if (id) { await axios.put(`${API}/api/resumes/${id}`, data); }
      else { const r = await axios.post(`${API}/api/resumes`, data); navigate(`/builder/${r.data._id}`, { replace: true }); }
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } finally { setSaving(false); }
  };

  const addItem = (section, template) =>
    setData(d => ({ ...d, [section]: [...d[section], { ...template, _id: Date.now().toString() }] }));

  const updateItem = (section, index, field, val) =>
    setData(d => ({ ...d, [section]: d[section].map((item, i) => i === index ? { ...item, [field]: val } : item) }));

  const removeItem = (section, index) =>
    setData(d => ({ ...d, [section]: d[section].filter((_, i) => i !== index) }));

  const handlePrint = () => window.print();

  const TABS = ['personal','experience','education','skills','projects'];

  return (
    <div className="builder-layout">
      <div className="builder-panel">
        <div className="builder-top">
          <input className="title-input" value={data.title} onChange={e => setData(d => ({...d, title: e.target.value}))} />
          <div className="builder-actions">
            <button className="btn btn-outline btn-sm" onClick={handlePrint}>🖨️ Print</button>
            <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
              {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save'}
            </button>
          </div>
        </div>

        <div className="tabs">
          {TABS.map(t => (
            <button key={t} className={`tab ${activeTab===t?'active':''}`} onClick={() => setActiveTab(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>

        <div className="section-content">
          {activeTab === 'personal' && (
            <div>
              <h3 className="section-title">Personal Information</h3>
              <div className="grid-2">
                {['fullName','email','phone','address','linkedin','github','website'].map(f => (
                  <div className={`form-group ${f === 'address' ? 'full-width' : ''}`} key={f}>
                    <label>{f.charAt(0).toUpperCase() + f.slice(1).replace(/([A-Z])/g,' $1')}</label>
                    <input value={data.personalInfo[f]} onChange={e => updatePersonal(f, e.target.value)} placeholder={f} />
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label>Professional Summary</label>
                <textarea value={data.personalInfo.summary} onChange={e => updatePersonal('summary', e.target.value)} placeholder="Write a brief summary about yourself..." />
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div>
              <div className="section-header">
                <h3 className="section-title">Work Experience</h3>
                <button className="btn btn-outline btn-sm" onClick={() => addItem('experience', { company:'', position:'', startDate:'', endDate:'', current:false, description:'' })}>+ Add</button>
              </div>
              {data.experience.map((exp, i) => (
                <div key={i} className="list-item card">
                  <div className="grid-2">
                    {['company','position','startDate','endDate'].map(f => (
                      <div className="form-group" key={f}>
                        <label>{f.replace(/([A-Z])/g,' $1')}</label>
                        <input value={exp[f]} onChange={e => updateItem('experience', i, f, e.target.value)} placeholder={f} />
                      </div>
                    ))}
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea value={exp.description} onChange={e => updateItem('experience', i, 'description', e.target.value)} placeholder="Describe your responsibilities..." />
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => removeItem('experience', i)}>Remove</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'education' && (
            <div>
              <div className="section-header">
                <h3 className="section-title">Education</h3>
                <button className="btn btn-outline btn-sm" onClick={() => addItem('education', { institution:'', degree:'', field:'', startDate:'', endDate:'', gpa:'' })}>+ Add</button>
              </div>
              {data.education.map((edu, i) => (
                <div key={i} className="list-item card">
                  <div className="grid-2">
                    {['institution','degree','field','startDate','endDate','gpa'].map(f => (
                      <div className="form-group" key={f}>
                        <label>{f.replace(/([A-Z])/g,' $1')}</label>
                        <input value={edu[f]} onChange={e => updateItem('education', i, f, e.target.value)} placeholder={f} />
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => removeItem('education', i)}>Remove</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'skills' && (
            <div>
              <div className="section-header">
                <h3 className="section-title">Skills</h3>
                <button className="btn btn-outline btn-sm" onClick={() => addItem('skills', { name:'', level:'Intermediate' })}>+ Add</button>
              </div>
              {data.skills.map((sk, i) => (
                <div key={i} className="skill-item">
                  <input value={sk.name} onChange={e => updateItem('skills', i, 'name', e.target.value)} placeholder="Skill name" />
                  <select value={sk.level} onChange={e => updateItem('skills', i, 'level', e.target.value)}>
                    {['Beginner','Intermediate','Advanced','Expert'].map(l => <option key={l}>{l}</option>)}
                  </select>
                  <button className="btn btn-danger btn-sm" onClick={() => removeItem('skills', i)}>✕</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <div className="section-header">
                <h3 className="section-title">Projects</h3>
                <button className="btn btn-outline btn-sm" onClick={() => addItem('projects', { name:'', description:'', technologies:'', link:'' })}>+ Add</button>
              </div>
              {data.projects.map((proj, i) => (
                <div key={i} className="list-item card">
                  <div className="grid-2">
                    {['name','technologies','link'].map(f => (
                      <div className="form-group" key={f}>
                        <label>{f.charAt(0).toUpperCase()+f.slice(1)}</label>
                        <input value={proj[f]} onChange={e => updateItem('projects', i, f, e.target.value)} placeholder={f} />
                      </div>
                    ))}
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea value={proj.description} onChange={e => updateItem('projects', i, 'description', e.target.value)} placeholder="Describe the project..." />
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => removeItem('projects', i)}>Remove</button>
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
