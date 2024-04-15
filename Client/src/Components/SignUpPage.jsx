import React from 'react'
import { z } from 'zod'
import { useState } from 'react'
import { signUpSchema } from '@/Schemas/signUpSchema'
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
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
} from "@/components/ui/select"

function SignUpPage() {
    const [btnVisiblity, setBtnVisiblity] = useState(false);
    const toogleBtn = () => {
        setBtnVisiblity(!btnVisiblity);
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
        console.log(e);

        if (e == 'student' || e == 'teacher') {
            setFormData({ ...formData, type: e });
            setErrors({ ...errors, type: '' });
            console.log(formData);
        } else {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
            setErrors({ ...errors, [name]: '' });
            console.log(formData);
        }
    };


    const handleSubmit = () => {
        try {
            // Validate the form data
            signUpSchema.parse(formData);
            // If validation succeeds, hit the API endpoint
            // and set the error messages to the response
            console.log(formData);
            axios.post('/api/user/register', formData, {
                withCredentials: true
            })
                .then((response) => {
                    console.log("HEllo response", response.data);
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
                }).catch((error) => {
                    errorTost(error.response.data.message);
                    console.error(error.response.data.message);
                })
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
        <div className='h-screen flex justify-center items-center bg-black'>

            {/* Left Block */}

            <div className='h-full w-3/5 bg-black hover:bg-dark text-blue p-10 pt-5'>
                <div className='flex items-center'>
                    <img src="/src/assets/graph.png" alt="logo" className='w-1/12' />
                    <h1 className='text-sm font-bold'>THE QUIZEEE</h1>
                </div>

                <div className='flex justify-center items-center'>
                    <img src="src/assets/main-logo.png" alt="main-logo" className='w-1/2' />
                </div>

                <div className='text-xs font-semibold mt-6'>
                    <h2>Conducting Quizes Made Easy !!!!</h2>
                    <p>Set and Take The Time Based Quizes on the Go...</p>
                </div>
            </div>


            {/* Right Block */}
            <div className='h-full w-2/5 bg-black hover:bg-dark  p-10 pt-5'>
                {/* Right Block Content */}
                <div className='text-right'>
                    <Button variant="ghost" className='text-blue hover:bg-blue hover:text-black'>Login</Button>
                </div>
                <div className='flex flex-col items-center justify-center'>
                    <h1 className='font-extrabold text-2xl text-green'>Create an account</h1>
                    <p className='font-semibold text-center text-xs text-brown'>Enter your details below to create your account or login if already registered !</p>

                    <div className='w-full flex flex-col gap-2 my-2 text-blue'>
                        <Input
                            className='bg-transparent h-1/6'
                            type="text"
                            placeholder="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        {errors.name && <span className="text-red text-xs">{errors.name}</span>}

                        <Input
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

                        <Input
                            className='bg-transparent h-1/6'
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        {errors.password && <span className="text-red text-xs">{errors.password}</span>}

                        <Input
                            className='bg-transparent h-1/6'
                            type="password"
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                        />
                        {errors.confirmPassword && <span className="text-red text-xs">{errors.confirmPassword}</span>}

                    </div>
                    <Button className={`hover:bg-brown h-1/6 text-green ${(!btnVisiblity) ? 'visible' : 'hidden'}`} variant="ghost" onClick={handleSubmit}>Sign Up</Button>
                    <Button className={`${(btnVisiblity) ? `visible` : `hidden`}`} disabled>
                        <Loader2 className={`mr-2 h-4 w-4 animate-spin ${(btnVisiblity) ? 'visible' : 'hidden'}`} />
                        Please wait
                    </Button>
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
        </div>
    )
}

export default SignUpPage
