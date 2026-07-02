import React, { useEffect, useState } from 'react';
import { getApplicant, updatedApplicationStatus } from '../api/Jobs';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function GetApplicants() {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    // ⚡ FIX 1: Inner async function inside useEffect
    useEffect(() => {
        const fetchApplicantsData = async () => {
            try {
                if (!jobId) return; // Prevent running if jobId is undefined
                const response = await getApplicant(jobId);
                console.log(response.success);
                if (response.success) {
                    setApplicants(response.data);
                }
            } catch (err) {
                console.error("Error fetching Applicants", err);
                toast.error('Failed to load applicant list');
            } finally {
                setLoading(false);
            }
        };

        fetchApplicantsData();
    }, [jobId]);

    // ⚡ FIX 3: Changed from destructuring object to standard parameters
    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            const response = await updatedApplicationStatus( applicationId, newStatus );
            if (response.success) {
                setApplicants(prevApplicants =>
                    prevApplicants.map(app => app._id === applicationId ? { ...app, status: newStatus } : app)
                );
                toast.success(`Status updated to ${newStatus}`);
            }
        } catch (err) {
            console.error("Error in updating Status ", err);
            toast.error(err.response?.data?.message || "Failed to update status");
        }
    };

    if (loading) {
        return <div className='text-center p-10'>Loading...</div>;
    }

    return (
        <div className='max-w-5xl p-6 mx-auto'>
            <h2 className='text-2xl font-bold mb-4'>Job Applicant Management</h2>

            {applicants.length === 0 ? (
                <p className='text-gray-500'>No students have applied for this position yet.</p>
            ) : (
                <div className='overflow-x-auto border rounded-lg shadow-md'>
                    <table className='w-full text-left bg-white border-collapse'>
                        <thead>
                            <tr className='bg-gray-100 border-b'>
                                <th className='p-4 font-semibold'>Student Name</th>
                                <th className='p-4 font-semibold'>Email Profile</th>
                                <th className='p-4 font-semibold'>Action Tracking</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* ⚡ FIX 2: Swapped curly braces for parentheses to allow automatic return */}
                            {applicants.map((applicant) => (
                                <tr key={applicant._id} className='border-b hover:bg-gray-50'>
                                    <td className='p-4 font-medium text-gray-800'>
                                        {applicant.studentId?.username || 'N/A'}
                                    </td>

                                    <td className='p-4 text-gray-600'>
                                        {applicant.studentId?.email || 'N/A'}
                                    </td>

                                    <td className='p-4'>
                                        <select
                                            value={applicant.status}
                                            onChange={(e) => handleStatusChange(applicant._id, e.target.value)}
                                            className={`p-2 rounded font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 border
                                                ${applicant.status === 'Selected' ? 'bg-green-50 text-green-700 border-green-300' : ''}
                                                ${applicant.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-300' : ''}
                                                ${applicant.status === 'Shortlisted' ? 'bg-purple-50 text-purple-700 border-purple-300' : ''}
                                                ${applicant.status === 'Applied' ? 'bg-gray-50 text-gray-700 border-gray-300' : ''}
                                            `}
                                        >
                                            <option value="Applied">Applied</option>
                                            <option value="Shortlisted">Shortlisted</option>
                                            <option value="Selected">Selected</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default GetApplicants;