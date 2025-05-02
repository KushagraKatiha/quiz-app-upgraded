import React from 'react'
import { z } from 'zod'
import { useState } from 'react'
import { signUpSchema } from '@/Schemas/signUpSchema'
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select"
import LoginPage from './LoginPage'

function SignUpPage() {
    const [visibility, setVisiblity] = useState(false);

    const toogleVisibility = () => {
        setVisiblity(!visibility);
    }

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        type: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});

    const errorTost = (message) => toast.error(message);
    const successTost = (message) => toast.success(message);

    const handleInputChange = (e) => {
        if (e == 'student' || e == 'teacher') {
            setFormData({ ...formData, type: e });
            setErrors({ ...errors, type: '' });
        } else {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            // Validate the form data
            signUpSchema.parse(formData);
            // If validation succeeds, hit the API endpoint
            // and set the error messages to the response
            axios.post('/api/user/register', formData, {
                withCredentials: true
            })
            .then((response) => {
                successTost(response.data.message);
                if (response.data.success) {
                    setFormData({
                        name: '',
                        email: '',
                        type: '',
                        password: '',
                        confirmPassword: '',
                    });
                }
            })
            .catch((error) => {
                console.error("Hello Error=>", error);
                if (error.response && error.response.data && error.response.data.message) {
                    errorTost(error.response.data.message);
                } else {
                    errorTost("An error occurred while processing your request.");
                }
            });
        } catch (error) {
            // If validation fails, set the error messages
            if (error instanceof z.ZodError) {
                const fieldErrors = {};
                error.errors.forEach((err) => {
                    const path = err.path.join('.');
                    fieldErrors[path] = err.message;
                });
                setErrors(fieldErrors);
            }
        }
    };
    
    return (
        <div className='h-screen flex-row md:flex justify-center items-center'>

            {/* Left Block */}

            <div className={`h-auto md:h-full flex flex-row-reverse md:block w-full md:w-3/5 bg-black hover:bg-dark text-blue md:p-10`}>
                <div className='items-center hidden md:flex'>
                    <img src="/src/assets/graph.png" alt="logo" className='w-1/12' />
                    <h1 className='md:text-sm text-2xl font-bold'>THE QUIZEEE</h1>
                </div>

                <div className='flex justify-center items-center'>
                    <img src="src/assets/main-logo.png" alt="main-logo" className='md:w-1/2 w-1/2' />
                </div>

                <div className='text-xs font-semibold mt-6 md:block hidden'>
                    <h2>Conducting Quizes Made Easy !!!!</h2>
                    <p>Set and Take The Time Based Quizes on the Go...</p>
                </div>
            </div>


            {/* Right Block */}
            <div className={`h-full md:h-full w-full md:w-2/5 bg-black hover:bg-dark p-10 md:p-10 ${(!visibility)? 'visible':'hidden'}`}>
                {/* Right Block Content */}
                <div className='text-right'>
                    <Button variant="ghost" className='text-blue hover:bg-blue hover:text-black' onClick={toogleVisibility}>Login</Button>
                </div>
                <div className='flex flex-col items-center justify-center'>
                    <h1 className='font-extrabold text-2xl text-green'>Create an account</h1>
                    <p className='font-semibold text-center text-xs text-brown'>Enter your details below to create your account or login if already registered !</p>

                    <div className='w-full flex flex-col gap-2 my-2 text-blue'>
                        <Input autoComplete= "off"
                            className='bg-transparent h-1/6'
                            type="text"
                            placeholder="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        {errors.name && <span className="text-red text-xs">{errors.name}</span>}

                        <Input autoComplete= "off"
                            className='bg-transparent h-1/6'
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        {errors.email && <span className="text-red text-xs">{errors.email}</span>}

                        <Select onValueChange={handleInputChange}>
                            <SelectTrigger className="bg-transparent">
                                <SelectValue value='Role' placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="teacher">Teacher</SelectItem>
                                    <SelectItem value="student">Student</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors && errors.type && <span className="text-red text-xs">{errors.type}</span>}

                        <Input autoComplete= "off"
                            className='bg-transparent h-1/6'
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        {errors.password && <span className="text-red text-xs">{errors.password}</span>}

                        <Input autoComplete= "off"
                            className='bg-transparent h-1/6'
                            type="password"
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                        />
                        {errors.confirmPassword && <span className="text-red text-xs">{errors.confirmPassword}</span>}

                    </div>
                    <Button className={`hover:bg-brown h-1/6 text-green`} variant="ghost" onClick={handleSubmit}>Sign Up</Button>
                </div>
            </div>

            {visibility && (
                <LoginPage display={visibility ? 'visible' : 'hidden'} position={`md:pt-24 pt-10 p-5 h-full md:h-full`} toogleVisibility={toogleVisibility}/>
            )}
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
        </div>
    )
}

export default SignUpPage
