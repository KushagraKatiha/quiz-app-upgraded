import React from 'react'
import {z} from 'zod'
import { useState } from 'react'
import { signUpSchema } from '@/Schemas/signUpSchema'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        type: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear the error message for the input field being changed
        setErrors({ ...errors, [name]: '' });
    };

    const handleSubmit = () => {
        console.log("Form Data: ", formData);
        console.log("type: ", formData.type);
        try {
            // Validate the form data
            signUpSchema.parse(formData);
            // If validation succeeds, submit the form data
            console.log('Form data is valid:', formData);
        } catch (error) {
            // If validation fails, set the error messages
            console.log("Validation Error: ", error.message);
            if (error instanceof z.ZodError) {
                const fieldErrors = {};
                error.errors.forEach((err) => {
                    const path = err.path.join('.');
                    console.log("path: ", path);
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

                        <Select>
                            <SelectTrigger className="bg-transparent">
                                <SelectValue value='Role' placeholder="Role"/>   
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
                    <Button className='hover:bg-brown h-1/6 text-green' variant="ghost" onClick={handleSubmit}>Sign Up</Button>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage



{/* */ }
