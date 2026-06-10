import React from 'react';
import { Briefcase, MapPin, DollarSign, AlertCircle } from 'lucide-react';

export const JobCard = ({ job }) => {
    const isEligible = job.eligible === true;

    return (
        <div 
            className={`transition-all duration-200 border-2 rounded-2xl p-5 bg-white relative
                ${isEligible 
                    ? 'border-violet-100 shadow-sm hover:shadow-md cursor-pointer opacity-100' 
                    : 'border-slate-200 bg-slate-50/50 opacity-60 pointer-events-none select-none'
                }`}
        >
            {/* Ineligibility Badge */}
            {!isEligible && (
                <div className="absolute top-4 right-4 bg-red-50 text-red-600 border border-red-100 rounded-lg px-2.5 py-1 text-[11px] font-bold tracking-wide flex items-center gap-1 z-10">
                    <AlertCircle size={12} />
                    <span>{job.ineligibleReason || 'Not Eligible'}</span>
                </div>
            )}

            {/* Header Data */}
            <div className="flex items-start gap-3">
                <div className={`p-3 rounded-xl shrink-0 ${isEligible ? 'bg-violet-50 text-violet-600' : 'bg-slate-200 text-slate-500'}`}>
                    <Briefcase size={20} />
                </div>
                <div>
                    {/* ✅ Adjusted variables to fit console array structure */}
                    <h4 className="font-bold text-slate-800 text-base">{job.role}</h4>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">{job.companyName}</p>
                </div>
            </div>

            {/* Metadata Badges */}
            <div className="flex flex-wrap gap-4 mt-4 text-xs font-bold text-slate-500">
                <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-slate-400" />
                    <span>{job.location || 'Remote / On-site'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <DollarSign size={14} className="text-slate-400" />
                    <span>{job.ctc || 'Competitive'}</span>
                </div>
                <div className="ml-auto text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    Cutoff: {job.minCgpa || '0.0'} CGPA
                </div>
            </div>
        </div>
    );
};