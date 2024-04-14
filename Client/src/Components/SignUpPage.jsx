import React from 'react'
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
    return (
        <div className='h-screen flex justify-center items-center'>
            {/* Left Block */}
            <div className='h-full w-3/5 bg-black hover:bg-dark text-blue p-10'>
                <div className='flex items-center'>
                    <img src="/src/assets/graph.png" alt="logo" className='w-1/12'/>
                    <h1 className='text-sm font-bold'>THE QUIZEEE</h1>
                </div>

                <div className='flex justify-center items-center'>
                    <img src="src/assets/main-logo.png" alt="main-logo" className='w-1/2'/>
                </div>

                <div className='text-xs font-semibold mt-6'>
                    <h2>Conducting Quizes Made Easy !!!!</h2>
                    <p>Set and Take The Time Based Quizes on the Go...</p>
                </div>
            </div>

            {/* _______________________________________________________________________________________________________ */}

            {/* Right Block */}
            <div className='h-full w-2/5 bg-black hover:bg-dark text-green p-10'>
                <div className='text-right'>
                    <Button className='hover:bg-brown h-1/6' variant="ghost">Login</Button>
                </div>

                {/* Signup Form */}
              <div className='flex flex-col items-center justify-center'>
                <h1 className='font-extrabold text-2xl'>Create an account</h1>
                <p className='font-semibold text-center text-xs text-brown'>Enter your details below to create your account or login if already registered !</p>

                <div className='w-full flex flex-col gap-2 my-2 text-blue'>
                    <Input className='bg-transparent h-1/6' type="text" placeholder="Name" />
                    <Input className='bg-transparent h-1/6' type="email" placeholder="Email" />

                    <Select>
                        <SelectTrigger className="bg-transparent">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Role</SelectLabel>
                                <SelectItem value="teacher">Teacher</SelectItem>
                                <SelectItem value="student">Student</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Input className='bg-transparent h-1/6' type="password" placeholder="Password" />
                    <Input className='bg-transparent h-1/6' type="password" placeholder="Confirm Password" />

                </div>
                <Button className='hover:bg-brown h-1/6' variant="ghost">Sign Up</Button>
              </div>

            </div>
        </div>
    )
}

export default SignUpPage