import React, { useState } from 'react';
import { GraduationCap, User, Users, Mail, Lock, Award, Hash, Calendar, ArrowRight, Zap, Building2, Tablet, TabletsIcon, Tablets } from 'lucide-react';
import { Login } from './Login';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const SignUp = () => {
    // State to toggle form layout dynamically based on role selection
    const [role, setRole] = useState('student');
    const navigate = useNavigate()

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [currentYear, setCurrentYear] = useState('1');
    const [cgpa, setCgpa] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const payload = {
            username,
            email,
            password,
            role
        }

        if (role === 'student') {
            payload.rollNo = rollNo,
                payload.currentYear = parseInt(currentYear),
                payload.cgpa = parseFloat(cgpa)

        }

        try {
            await axios.post('http://localhost:3000/api/auth/register', payload);
            navigate('/login', { state: { registerSuccess: true } });
        }
        catch (err) {

            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex bg-slate-50 antialiased font-sans">

            {/* LEFT SIDE: AUTHENTICATION CONTAINER (50% Width) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">

                {/* Clean Floating Card Container with Premium Soft Shadow */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 md:p-8 w-full max-w-md transition-all duration-300">

                    {/* Header: Subtitle Pill */}
                    <div className="badge bg-violet-50 border-none px-3 py-3 gap-1.5 mb-3 select-none">
                        <User size={13} className="text-violet-600" />
                        <span className="text-xs font-bold text-violet-600 tracking-wide uppercase">Create your account</span>
                    </div>

                    {/* Header: Titles */}
                    <h3 className="text-3xl font-black tracking-tight text-slate-900">Sign Up</h3>
                    <p className="text-xs font-semibold text-slate-400 mt-1">
                        Already have an account? <span className="text-violet-600 hover:underline cursor-pointer">Login</span>
                    </p>

                    {/* Dynamic Role Switcher Controls */}
                    <div className="flex mt-5 gap-2.5 p-1 bg-slate-100/80 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setRole('student')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold tracking-wide rounded-lg transition-all cursor-pointer
                                ${role === 'student' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <GraduationCap size={15} />
                            Student
                        </button>

                        <button
                            type="button"
                            onClick={() => setRole('coordinator')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold tracking-wide rounded-lg transition-all cursor-pointer
                                ${role === 'coordinator' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Users size={15} />
                            Coordinator
                        </button>
                    </div>

                    {/* Input Forms Body */}

                    <form className="mt-5 flex flex-col gap-3.5" onSubmit={handleSubmit}>

                        {/* Field 1: Username */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Username</label>
                            <div className="flex items-center border border-slate-200/80 focus-within:border-violet-500 rounded-xl px-3 py-2 bg-slate-50/50 transition-colors">
                                <User size={16} className="text-slate-400" />
                                <input type="text" placeholder="Enter full name" className="ml-2.5 text-xs font-medium w-full bg-transparent outline-none text-slate-700" required
                                    onChange={(e) => setUsername(e.target.value)} />
                            </div>
                        </div>

                        {/* Field 2: Email */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                            <div className="flex items-center border border-slate-200/80 focus-within:border-violet-500 rounded-xl px-3 py-2 bg-slate-50/50 transition-colors">
                                <Mail size={16} className="text-slate-400" />
                                <input type="email" placeholder="name@university.edu" className="ml-2.5 text-xs font-medium w-full bg-transparent outline-none text-slate-700"
                                    onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                        </div>

                        {/* Field 3: Password */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                            <div className="flex items-center border border-slate-200/80 focus-within:border-violet-500 rounded-xl px-3 py-2 bg-slate-50/50 transition-colors">
                                <Lock size={16} className="text-slate-400" />
                                <input type="password" placeholder="Create a password" className="ml-2.5 text-xs font-medium w-full bg-transparent outline-none text-slate-700"
                                    onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                        </div>

                        {/* ACADEMIC ROW GRID: Conditionally displays ONLY if role is 'student' */}
                        {role === 'student' && (
                            <div className="grid grid-cols-2 gap-3 mt-0.5 animate-fadeIn">

                                {/* Field 4: CGPA */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current CGPA</label>
                                    <div className="flex items-center border border-slate-200/80 focus-within:border-violet-500 rounded-xl px-3 py-2 bg-slate-50/50 transition-colors">
                                        <Award size={16} className="text-slate-400" />
                                        <input type="number" step="0.01" min="0" max="10" placeholder="0.00" className="ml-2.5 text-xs font-medium w-full bg-transparent outline-none text-slate-700"
                                            onChange={(e) => setCgpa(e.target.value)} required />
                                    </div>
                                </div>

                                {/* Field 5: Roll Number */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Roll No</label>
                                    <div className="flex items-center border border-slate-200/80 focus-within:border-violet-500 rounded-xl px-3 py-2 bg-slate-50/50 transition-colors">
                                        <Hash size={16} className="text-slate-400" />
                                        <input type="text" placeholder="e.g. 21CS01" className="ml-2.5 text-xs font-medium w-full bg-transparent outline-none text-slate-700"
                                            onChange={(e) => setRollNo(e.target.value)} required />
                                    </div>
                                </div>

                                {/* Field 6: Academic Year (Span 2 spaces across to stay neat) */}
                                <div className="flex flex-col gap-1 col-span-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Year</label>
                                    <div className="flex items-center border border-slate-200/80 focus-within:border-violet-500 rounded-xl px-3 bg-slate-50/50 transition-colors h-9">
                                        <Calendar size={16} className="text-slate-400 shrink-0" />
                                        <select className="ml-2 w-full bg-transparent outline-none text-xs font-bold text-slate-600 cursor-pointer h-full " onChange={(e) => setCurrentYear(e.target.value)}>
                                            <option value="1">1st Year </option>
                                            <option value="2">2nd Year</option>
                                            <option value="3">3rd Year </option>
                                            <option value="4">4th Year</option>
                                        </select>
                                    </div>
                                </div>

                            </div>
                        )}

                        {/* Submit Button */}
                        <button type="submit" className="btn bg-violet-600 hover:bg-violet-700 text-white border-none w-full rounded-xl text-xs font-bold tracking-wide shadow-md mt-2 cursor-pointer flex items-center justify-center gap-2 h-10 min-h-10" disabled={loading}>
                            {loading ? <span className='loading loading-spinner loading-xs'></span> :
                                <>
                                    Create Account
                                    <ArrowRight size={14} />
                                </>
                            }
                        </button>

                    </form>

                </div>
            </div>

            {/* RIGHT SIDE: MARKETING PANEL (Placeholder for your solid purple branding view) */}
            <div className="hidden lg:flex lg:w-1/2 bg-violet-600 ">
                {/* Your right side cards content goes here */}
                <div className='mt-24 px-8 '>
                    <div>
                        <h3 className='font-bold    text-4xl font-sans text-gray-100 mb-4'>Join NexusDrive Today</h3>
                        <p className='text-slate-200 text-xs font-medium'>Connect with top companies and launch your carrier</p>
                    </div>
                    <div className='mt-24 space-y-4'>
                        {/* 1 card */}
                        <div className='bg-white/10 shadow-lg w-85 px-8 py-4 rounded-2xl text-slate-50 flex items-center gap-3'>
                            <div className='rounded-full bg-white/10 p-2'>
                                <Zap size={14} className='text-slate-50' />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white text-sm">
                                    Find Jobs Faster
                                </h4>

                                <p className="text-xs text-white/70">
                                    Discover roles matched to your goals
                                </p>
                            </div>
                        </div>
                        {/* card-2 */}

                        <div className='bg-white/10 shadow-lg w-85 px-8 py-4 rounded-2xl text-slate-50 flex items-center gap-3 ml-16'>
                            <div className='rounded-full bg-white/10 p-2'>
                                <Tablet size={14} className='text-slate-50' />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white text-sm">
                                    Top Company Partners
                                </h4>

                                <p className="text-xs text-white/70">
                                    Access Trusted Hiring Networks
                                </p>
                            </div>
                        </div>
                        {/* Card-3 */}
                        <div className='bg-white/10 shadow-lg w-85 px-8 py-4 rounded-2xl text-slate-50 flex items-center gap-3'>
                            <div className='rounded-full bg-white/10 p-2'>
                                <GraduationCap size={14} className='text-slate-50' />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white text-sm">
                                    Carrer Guidence
                                </h4>

                                <p className="text-xs text-white/70">
                                    Support from application to offer
                                </p>
                            </div>
                        </div>

                        <div>

                        </div>
                        <div>

                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}