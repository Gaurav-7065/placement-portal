import React, { useContext, useState } from 'react';
import { GraduationCap, User, Users, Mail, Lock, ArrowRight, Zap, Tablet, FastForward } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Login = () => {
    // State to toggle layout dynamically based on role selection
    const [role, setRole] = useState('student');
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();
    const location=useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const registerSuccess = location.state?.registerSuccess;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);


        try {
            const payload = {
                email,
                password,
                role
            }
            const response = await axios.post('http://localhost:3000/api/auth/login', payload);

            const { user, token } = response.data;
            // save this on localStorage
            login(user, token);

            if (user.role === 'coordinator') {
                navigate('/admin/jobs');
            }
            else {
                navigate('/jobs');
            }


        }
        catch (error) {
            setError(error.response?.data?.message || 'Invalid email or password credentials.');
        }
        finally {
            setLoading(false);
        }

    };


    return (
        <div className="min-h-screen flex bg-slate-50 antialiased font-sans">

            {/* LEFT SIDE: AUTHENTICATION CONTAINER (50% Width) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">

                {/* Clean Floating Card Container with Premium Soft Shadow */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 md:p-8 w-full max-w-md transition-all duration-300">

                    {/* Header: Subtitle Pill */}
                    <div className="badge bg-violet-50 border-none px-3 py-3 gap-1.5 mb-3 select-none">
                        <User size={13} className="text-violet-600" />
                        <span className="text-xs font-bold text-violet-600 tracking-wide ">Welcome Back To NexusDrive </span>
                    </div>

                    {/* Header: Titles */}
                    <h3 className="text-3xl font-black tracking-tight text-slate-900">Login</h3>
                    <p className="text-xs font-semibold text-slate-400 mt-1">
                        New to NexusDrive? <span className="text-violet-600 hover:underline cursor-pointer">Register</span>
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

                    {/* Registration Success Banner */}

                    {/* Registration Success Banner */}
                    {registerSuccess && (
                        <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-bold">
                            🎉 Registration successful! Log in with your new credentials.
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-semibold">
                            ⚠️ {error}
                        </div>
                    )}
                  

                    {/* Input Forms Body */}
                    <form className="mt-5 flex flex-col gap-3.5" onSubmit={handleSubmit}>

                        {/* Field 1: Email */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                            <div className="flex items-center border border-slate-200/80 focus-within:border-violet-500 rounded-xl px-3 py-2 bg-slate-50/50 transition-colors">
                                <Mail size={16} className="text-slate-400" />
                                <input type="email" placeholder="name@university.edu" className="ml-2.5 text-xs font-medium w-full bg-transparent outline-none text-slate-700" required
                                    onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>

                        {/* Field 2: Password */}
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                                <span className="text-[10px] font-bold text-violet-600 hover:underline cursor-pointer tracking-wide uppercase">Forgot?</span>
                            </div>
                            <div className="flex items-center border border-slate-200/80 focus-within:border-violet-500 rounded-xl px-3 py-2 bg-slate-50/50 transition-colors">
                                <Lock size={16} className="text-slate-400" />
                                <input type="password" placeholder="Enter your password" className="ml-2.5 text-xs font-medium w-full bg-transparent outline-none text-slate-700" required
                                    onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>

                        {/* Remember Me Toggle */}
                        <div className="flex items-center gap-2 mt-0.5 select-none">
                            <input type="checkbox" id="remember" className="checkbox checkbox-xs border-slate-300 checked:bg-violet-600 checked:border-violet-600 rounded" />
                            <label htmlFor="remember" className="text-[11px] font-semibold text-slate-400 cursor-pointer">Keep me logged in</label>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" disabled={loading} className="btn bg-violet-600 hover:bg-violet-700 text-white border-none w-full rounded-xl text-xs font-bold tracking-wide shadow-md mt-2 cursor-pointer flex items-center justify-center gap-2 h-10 min-h-10">
                            {loading ? <span className='loading loading-spinner loading-xs'></span> :
                                <>
                                    Sign In
                                    <ArrowRight size={14} />
                                </>
                            }

                        </button>

                    </form>

                </div>
            </div>

            {/* RIGHT SIDE: MARKETING PANEL (Perfectly cloned from SignUp) */}
            <div className="hidden lg:flex lg:w-1/2 bg-violet-600 ">
                <div className='mt-24 px-8 '>
                    <div>
                        <h3 className='font-bold text-4xl font-sans text-gray-100 mb-4'>Welcome back to<br /> NexusDrive</h3>
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
                    </div>
                </div>
            </div>

        </div>
    );
};