import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getJobById } from '../api/Jobs';
import { applyToJob, getMyApplication } from '../api/applications';
import { AlertTriangle, ArrowLeft, CheckCircle, ExternalLink, HelpCircle, Loader2, Trophy } from 'lucide-react';


function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [hasApplied, sethasApplied] = useState(false);

  const [formOpend, setFormOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applyLoading, setApplyLoading] = useState(false);
  const [error, setError] = useState('');



  useEffect(() => {
    const fetchJobandApplicationStatus = async () => {


      try {
        setLoading(true);
        setError('');

        const [jobData, myApplications] = await Promise.all([getJobById(id), getMyApplication()]);

        setJob(jobData);

        const rawList = myApplications?.applications;
        const applicationsArray = Array.isArray(rawList) ? rawList : [];

        // Clean, well-spaced logic match check
        const alreadyApplied = applicationsArray.some((app) => {
          const targetJobId = app.jobId?._id || app.jobId;
          return targetJobId === id;  
        });

        sethasApplied(alreadyApplied);

      }
      catch (error) {
        setError(error.response?.data.message || 'Failed to finalize application status');
      }
      finally {
        setLoading(false);
      }

    }
    fetchJobandApplicationStatus();
  }, [id]);

  //  open external tab to Apply to job
  const handleOpenForm = () => {
    if (job?.externalLink) {
      window.open(job.externalLink, '_blank', 'noopener,noreferrer');
      setFormOpened(true);

    }
    else {
      setError("External application link missing for this posting.");
    }
  }

  // handle submit application
  const handleConfirmSubmission = async () => {
    setApplyLoading(true);
    setError('');
    try {
      const response = await applyToJob(id);
      console.log(response);
      sethasApplied(true);

    }
    catch (error) {
      setError(error.response?.data?.message || "Failed to finalize application status");
    }
    finally {
      setApplyLoading(false);
    }
  }

  // while syncing data
  if (loading) {
    return (
      <div className='min-h-[60vh] flex flex-col items-center justify-center gap-2'>
        <Loader2 size={32} className='animate-spin text-violet-600' />
        <span className='text-xs text-slate-400 uppercase font-medium'>Syncing Data...</span>
      </div>
    )
  }

  // if any error comes
  if (error && !job) {
    return (
      <div className='max-w-md mx-auto mt-12 bg-red-50  rounded-2xl border-dashed border-red-100 items-start gap-3 p-2'>
        <AlertTriangle size={32} className='text-red-500 mt-0.5' />
        <div>
          <h5 className="text-xs font-bold text-red-700 uppercase tracking-wider">Failed to Load</h5>
          <p className="text-xs font-semibold text-red-600 mt-0.5">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 antialiased font-sans">
      <button onClick={() => navigate('/jobs')} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider mb-6 cursor-pointer">
        <ArrowLeft size={14} /> Return to Openings
      </button>

      <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.01)] rounded-3xl p-6 md:p-8">
        <div>
          <span className="text-[10px] font-extrabold tracking-widest text-violet-600 uppercase bg-violet-50 px-2.5 py-1 rounded-md">
            {job.ctc || 'Competitive CTC'}
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-3">{job.role}</h2>
          <p className="text-sm font-bold text-slate-400 mt-0.5">{job.companyName}</p>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role Specifications</h4>
          <p className="text-xs font-medium text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
            {job.description || "No job description supplied for this post configuration."}
          </p>
        </div>

        {/* Bottom Interactive Workflow Area */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col gap-3">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}

          {hasApplied ? (
            /* STATE A: Database entry verified. Locked completely */
            <div className="w-full bg-slate-100 text-slate-500 font-bold text-xs rounded-xl py-3.5 flex items-center justify-center gap-1.5 select-none border border-slate-200">
              <CheckCircle size={15} className="text-emerald-500" />
              Applied ✓
            </div>
          ) : job.eligible === false ? (
            /* STATE B: Student profile doesn't meet requirements */
            <div className="w-full bg-slate-50 text-slate-400 font-bold text-xs rounded-xl py-3.5 text-center border border-dashed border-slate-200 select-none">
              Profile Ineligible (CGPA Cutoff Mismatch)
            </div>
          ) : !formOpend ? (
            /* STATE C: Phase 1 – Launch Link Form Target Gateway */
            <button
              onClick={handleOpenForm}
              className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl uppercase tracking-wide shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Step 1: Open External Application Form <ExternalLink size={13} />
            </button>
          ) : (
            /* STATE D: Phase 2 – Active user verification loop interface */
            <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <HelpCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h6 className="text-xs font-bold text-amber-900 uppercase tracking-wide">External Form Opened</h6>
                  <p className="text-[11px] font-medium text-amber-700 mt-0.5 leading-normal">
                    Please fill out the form in your other browser tab. If you closed it accidentally, you can safely click the button below to open it again.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-1">
                <button
                  onClick={handleOpenForm}
                  className="flex-1 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-[11px] rounded-lg uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Re-open Tab
                </button>
                <button
                  onClick={handleConfirmSubmission}
                  disabled={applyLoading}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg uppercase tracking-wider cursor-pointer shadow-sm transition-colors flex items-center justify-center gap-1"
                >
                  {applyLoading ? <Loader2 className="animate-spin" size={12} /> : "Confirm Submitted ✓"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobDetailPage; 