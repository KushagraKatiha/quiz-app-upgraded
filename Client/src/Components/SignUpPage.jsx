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
        <div className='bg-b w-full h-full flex justify-center items-center'>
            {/* Left Block */}
            <div className='w-3/5'>
                <div>
                    <img src="/src/assets/graph.png" alt="logo" />
                    <h1>THE QUIZEEE</h1>
                </div>

                <div>
                    <img src="src/assets/logo-white.png" alt="main-logo" />
                </div>

                <div>
                    <h2>Conducting Quizes Made Easy !!!!</h2>
                    <p>Set and Take The Time Based Quizes on the Go...</p>
                </div>
            </div>

            {/* _______________________________________________________________________________________________________ */}

            {/* Right Block */}
            <div className='w-2/5'>
                <div>
                    <Button variant="ghost">Login</Button>
                </div>

                {/* Signup Form */}
                <h1>Create an account</h1>
                <p>Enter your details below to create your account</p>

                <Input type="text" placeholder="name" />
                <Input type="email" placeholder="email" />

                <Select>
                    <SelectTrigger className="w-[180px]">
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

                <Input type="password" placeholder="password" />
                <Input type="password" placeholder="confirm password" />

                <Button variant="outline">Sign Up</Button>

            </div>
        </div>
    )
}

export default SignUpPage