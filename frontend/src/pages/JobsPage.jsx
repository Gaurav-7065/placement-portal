import React, { useEffect, useState } from 'react';
import { getAllJobs } from '../api/Jobs';
import { JobCard } from '../components/JobCard';
import { Search, Loader2, AlertTriangle, Layers } from 'lucide-react';

function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchJobsdata = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await getAllJobs();
                console.log("Fetched Data from API:", data);
                setJobs(data);
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to fetch Job Openings');
            } finally {
                setLoading(false);
            }
        };
        fetchJobsdata();
    }, []);

    // ✅ FIXED: Added 'return' statement inside the implicit arrow function body
    const filteredAndSortedJobs = jobs
        .filter((job) => 
            job.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            return (b.eligible === true) - (a.eligible === true);
        });

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2">
                <Loader2 className="animate-spin text-violet-600" size={32} />
                <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">Loading jobs...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-12 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
                <div>
                    <h5 className="text-xs font-bold text-red-700 uppercase tracking-wider">API Error Encountered</h5>
                    <p className="text-xs font-semibold text-red-600 mt-0.5">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 antialiased font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Job Openings</h3>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">Explore career paths matching your academic profile</p>
                </div>

                {/* Search Bar Input Container */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        placeholder="Search by company name..." 
                        className="w-full bg-slate-100 focus:bg-white border border-transparent focus:border-violet-500 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-700 placeholder-slate-400 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Jobs Display Feed Grid */}
            {filteredAndSortedJobs.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 mt-6">
                    {filteredAndSortedJobs.map((job) => (
                        <JobCard key={job._id || job.id} job={job} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl mt-6">
                    <Layers className="mx-auto text-slate-300" size={36} />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-3">No matching job listings found</p>
                </div>
            )}
        </div>
    );
}

export default JobsPage;