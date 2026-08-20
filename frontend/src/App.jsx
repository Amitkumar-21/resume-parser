import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Loader2,
  Mail,
  Phone,
  Globe,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Code,
  ExternalLink,
  RefreshCw,
  Trophy
} from 'lucide-react';

const API_ENDPOINT = 'http://localhost:8000/api/parse-resume';

function LinkedInIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z" />
    </svg>
  );
}

function GitHubIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function App() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please select a valid PDF file.');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.pdf')) {
        setFile(droppedFile);
        setError(null);
      } else {
        setError('Please drop a valid PDF file.');
      }
    }
  };

  const handleParseResume = async () => {
    if (!file) {
      setError('Please select or drop a PDF file first.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: 'Failed to process resume' }));
        throw new Error(errData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setResumeData(data);
    } catch (err) {
      console.error('Error parsing resume:', err);
      setError(err.message || 'An error occurred while parsing the resume.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setResumeData(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-slate-100">
      {/* Header */}
      <header className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>AI-Powered ATS Parser</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent mb-3">
          Resume Parser
        </h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto">
          Upload any candidate resume in PDF format to automatically extract structured contact details, skills, education, and project experience using LLMs.
        </p>
      </header>

      {/* Main Content Area */}
      <main className="space-y-8">
        {!resumeData && (
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            {/* File Upload Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
                  : file
                  ? 'border-emerald-500/50 bg-emerald-500/5'
                  : 'border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/40'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,application/pdf"
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center space-y-4">
                {file ? (
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <FileText className="w-8 h-8" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                )}

                <div>
                  {file ? (
                    <div>
                      <p className="text-lg font-semibold text-emerald-400 mb-1">{file.name}</p>
                      <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB • PDF Document</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-base font-medium text-slate-200 mb-1">
                        <span className="text-indigo-400 font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-slate-400">Supported format: PDF files</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
              {file && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition disabled:opacity-50"
                >
                  Clear File
                </button>
              )}
              <button
                type="button"
                onClick={handleParseResume}
                disabled={!file || loading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extracting Details...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Parse Resume</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Parsing Failed</p>
              <p className="text-red-300/80">{error}</p>
            </div>
          </div>
        )}

        {/* Candidate Profile Card */}
        {resumeData && (
          <div className="space-y-6">
            {/* Top Bar with Reset Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5" />
                <span>Resume parsed successfully</span>
              </div>
              <button
                onClick={resetForm}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Parse Another Resume</span>
              </button>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {resumeData.full_name || 'Candidate Profile'}
                </h2>
                <div className="flex flex-wrap gap-4 text-sm text-slate-300 mt-3">
                  {resumeData.email && (
                    <a
                      href={`mailto:${resumeData.email}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition text-indigo-300"
                    >
                      <Mail className="w-4 h-4 text-indigo-400" />
                      <span>{resumeData.email}</span>
                    </a>
                  )}

                  {resumeData.phone && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-emerald-300">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span>{resumeData.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Social / Link Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800">
                {resumeData.linkedin_url ? (
                  <a
                    href={resumeData.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600/20 text-sm font-medium transition"
                  >
                    <LinkedInIcon className="w-4 h-4 text-blue-400" />
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/40 text-slate-500 text-xs">
                    <LinkedInIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>LinkedIn: N/A</span>
                  </div>
                )}

                {resumeData.github_url ? (
                  <a
                    href={resumeData.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 text-sm font-medium transition"
                  >
                    <GitHubIcon className="w-4 h-4 text-slate-200" />
                    <span>GitHub Profile</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/40 text-slate-500 text-xs">
                    <GitHubIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>GitHub: N/A</span>
                  </div>
                )}

                {resumeData.portfolio_urls && resumeData.portfolio_urls.length > 0 && (
                  resumeData.portfolio_urls.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 text-sm font-medium transition"
                    >
                      <Globe className="w-4 h-4 text-purple-400" />
                      <span>Portfolio #{idx + 1}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>
                  ))
                )}
              </div>
            </div>

            {/* Technical Skills Pills */}
            {resumeData.technical_skills && resumeData.technical_skills.length > 0 && (
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4 text-slate-200 font-semibold">
                  <Code className="w-5 h-5 text-indigo-400" />
                  <span>Technical Skills</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resumeData.technical_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements & Honors Section */}
            {resumeData.achievements && resumeData.achievements.length > 0 && (
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-slate-200 font-semibold">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span>Achievements & Honors</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
                    {resumeData.achievements.length} {resumeData.achievements.length === 1 ? 'Achievement' : 'Achievements'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resumeData.achievements.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-slate-200 text-sm leading-snug">{item.title}</h4>
                          {item.date && (
                            <span className="text-[10px] text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded shrink-0">{item.date}</span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-slate-400 leading-relaxed mt-1">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {resumeData.education && resumeData.education.length > 0 && (
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4 text-slate-200 font-semibold">
                  <GraduationCap className="w-5 h-5 text-emerald-400" />
                  <span>Education</span>
                </div>
                <div className="space-y-4">
                  {resumeData.education.map((edu, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
                      <h4 className="font-semibold text-slate-200">{edu.degree || edu.institution}</h4>
                      <p className="text-sm text-indigo-400 mt-0.5">{edu.institution}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                        {edu.start_date && edu.end_date && (
                          <span>{edu.start_date} – {edu.end_date}</span>
                        )}
                        {(edu.cgpa || edu.gpa) && (
                          <span>CGPA / Score: {edu.cgpa || edu.gpa}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {resumeData.projects && resumeData.projects.length > 0 && (
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-slate-200 font-semibold">
                    <Briefcase className="w-5 h-5 text-purple-400" />
                    <span>Projects</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
                    {resumeData.projects.length} {resumeData.projects.length === 1 ? 'Project' : 'Projects'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resumeData.projects.map((proj, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-slate-200">{proj.name}</h4>
                          {proj.date_range && (
                            <span className="text-[10px] text-slate-400 shrink-0">{proj.date_range}</span>
                          )}
                        </div>
                        {proj.description && (
                          <p className="text-xs text-slate-400 mb-3 leading-relaxed">{proj.description}</p>
                        )}
                      </div>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                          {proj.technologies.map((tech, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
