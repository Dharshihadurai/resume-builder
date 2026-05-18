import React from 'react';
import './ResumePreview.css';

const LEVEL_MAP = { Beginner: 20, Intermediate: 50, Advanced: 75, Expert: 100 };

export default function ResumePreview({ data }) {
  const { personalInfo: p, experience, education, skills, projects } = data;

  return (
    <div className="resume-doc">
      <div className="resume-header">
        <h1>{p.fullName || 'Your Name'}</h1>
        <div className="contact-row">
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>📞 {p.phone}</span>}
          {p.address && <span>📍 {p.address}</span>}
          {p.linkedin && <span>🔗 {p.linkedin}</span>}
          {p.github && <span>💻 {p.github}</span>}
          {p.website && <span>🌐 {p.website}</span>}
        </div>
      </div>

      {p.summary && (
        <section>
          <h2 className="sec-title">Summary</h2>
          <p className="summary-text">{p.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section>
          <h2 className="sec-title">Experience</h2>
          {experience.map((exp, i) => (
            <div key={i} className="entry">
              <div className="entry-header">
                <span className="entry-title">{exp.position}</span>
                <span className="entry-date">{exp.startDate} {exp.startDate && '–'} {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div className="entry-sub">{exp.company}</div>
              {exp.description && <p className="entry-desc">{exp.description}</p>}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section>
          <h2 className="sec-title">Education</h2>
          {education.map((edu, i) => (
            <div key={i} className="entry">
              <div className="entry-header">
                <span className="entry-title">{edu.degree} {edu.field && `in ${edu.field}`}</span>
                <span className="entry-date">{edu.startDate} {edu.startDate && '–'} {edu.endDate}</span>
              </div>
              <div className="entry-sub">{edu.institution} {edu.gpa && `· GPA: ${edu.gpa}`}</div>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className="sec-title">Skills</h2>
          <div className="skills-grid">
            {skills.map((sk, i) => (
              <div key={i} className="skill-row">
                <span className="skill-name">{sk.name}</span>
                <div className="skill-bar"><div className="skill-fill" style={{ width: `${LEVEL_MAP[sk.level] || 50}%` }} /></div>
                <span className="skill-level">{sk.level}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section>
          <h2 className="sec-title">Projects</h2>
          {projects.map((proj, i) => (
            <div key={i} className="entry">
              <div className="entry-header">
                <span className="entry-title">{proj.name}</span>
                {proj.link && <a href={proj.link} className="proj-link">{proj.link}</a>}
              </div>
              {proj.technologies && <div className="entry-sub">Tech: {proj.technologies}</div>}
              {proj.description && <p className="entry-desc">{proj.description}</p>}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
