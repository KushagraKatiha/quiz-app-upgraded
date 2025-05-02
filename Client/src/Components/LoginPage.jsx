import React from 'react'
import { z } from 'zod'
import { useState } from 'react'
import { signInSchema } from '@/Schemas/signInSchema'
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import ForgetPasswordPage from './ForgetPasswordPage'
import { useNavigate } from 'react-router-dom'

function LoginPage({
    display,
    toogleVisibility,
    position
}) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const errorTost = (message) => toast.error(message);
    const successTost = (message) => toast.success(message);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleSignIn = () => {
        try {
            // Validate the form data
            signInSchema.parse(formData);
            // If validation succeeds, hit the API endpoint
            // and set the error messages to the response
            axios.post('/api/user/login', formData, {
                withCredentials: true
            })
                .then((response) => {
                    navigate('/dashboard');
                    successTost(response.data.message);
                })
                .catch((error) => {
                    errorTost(error.response.data.message);
                    setErrors(error.response.data.errors);
                });
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = {};
                error.errors.forEach((err) => {
                    const path = err.path.join('.');
                    fieldErrors[path] = err.message;
                });
                setErrors(fieldErrors);
            }
        }
    }

    return (
        <>
            {/* Left Block */}
            <div className={`h-full md:h-full w-full md:w-2/5 bg-black hover:bg-dark md:p-10 pt-5 ${display} ${position}`}>
                {/* Right Block Content */}
                <div className='text-right'>
                    <Button variant="ghost" className='text-blue hover:bg-blue hover:text-black' onClick={toogleVisibility}>Sign Up</Button>
                </div>
                <div className='flex flex-col items-center justify-center'>
                    <h1 className='font-extrabold text-2xl text-green'>Login To Your Account</h1>
                    <p className='font-semibold text-center text-xs text-brown'>Enter your details below to proceed ahead !!</p>

                    <div className='w-full flex flex-col gap-2 my-2 text-blue'>
                        <Input autoComplete="off"
                            className='bg-transparent h-1/6'
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        {errors?.email && <span className="text-red text-xs">{errors.email}</span>}

                        <Input autoComplete="off"
                            className='bg-transparent h-1/6'
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        {errors?.password && <span className="text-red text-xs">{errors.password}</span>}

                    </div>
                    <Button className={`hover:bg-brown h-1/6 text-green`} variant="ghost" onClick={handleSignIn}>Sign In</Button>
                    <ForgetPasswordPage />
                </div>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition:Bounce
            />
        </>
    )
}

export default LoginPage
