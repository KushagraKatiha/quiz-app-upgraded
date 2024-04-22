import React from 'react'
import { useState, useEffect } from 'react'
import { Drawer } from 'vaul';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, CardContent } from "@/components/ui/card"
import Autoplay from "embla-carousel-autoplay"
import UpdateProfilePage from './UpdateProfilePage';
import ProfileForm from './UpdatePasswordPage';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import { Button } from '@/components/ui/button'

function Dashboard() {
    const [greet, setGreet] = useState('')
    const [user, setUser] = useState({})
    const [btnDisplay, setBtnDisplay] = useState('false')
    const [carouselDisplay, setCarouselDisplay] = useState('true')
    const [questions, setQuestions] = useState([])
    const [errText, setErrText] = useState('false')

    const dummyData = [
        {
            questionText: 'What is the capital of India? Which is the capital of India? How many states are there in India? ',
            options: ['Delhi', 'Mumbai', 'Chennai', 'Kolkata'],
            correctOption: 'Delhi',
            explaintion: 'Delhi is the capital of India.'
        },
        {
            questionText: 'What is the capital of USA?',
            options: ['New York', 'Washington DC', 'California', 'Texas'],
            correctOption: 'Washington DC',
            explaintion: 'Washington DC is the capital of USA.'
        },
        {
            questionText: 'What is the capital of UK?',
            options: ['London', 'Manchester', 'Birmingham', 'Liverpool'],
            correctOption: 'London',
            explaintion: 'London is the capital of UK.'
        },
        {
            questionText: 'What is the capital of France?',
            options: ['Paris', 'Marseille', 'Lyon', 'Toulouse'],
            correctOption: 'Paris',
            explaintion: 'Paris is the capital of France.'
        },
    ]

    const errorTost = (message) => toast.error(message);
    const successTost = (message) => toast.success(message);

    useEffect(() => {
        const date = new Date()
        const hour = date.getHours()
        if (hour >= 4 && hour < 12) {
            setGreet('Good Morning')
        } else if (hour >= 12 && hour < 16) {
            setGreet('Good Afternoon')
        } else {
            setGreet('Good Evening')
        }

        axios.get('/api/user/me')
            .then((response) => {
                setUser(response.data.data)
                if (response.data.data.type === 'teacher') {
                    setBtnDisplay(!btnDisplay)
                    axios.get('/api/test/teacher/get')
                        .then((response) => {
                            console.log(response.data.data);
                            if (!response.data.data) {
                                setQuestions(["NO QUESTIONS AVAILABLE"])
                            }
                            setQuestions(response.data.data)
                        }).catch((error) => {
                            console.log("Error from questions api: ", error.response.data.message)
                            setErrText(!errText)
                            setQuestions(["NO QUESTIONS AVAILABLE"])
                        })
                } else {
                    setCarouselDisplay(!carouselDisplay)

                }
            })
            .catch((error) => {
                console.log(error)
            })


    }, [])

    const handleDeleteAccount = () => {
        axios.delete('/api/user/delete')
            .then((response) => {
                console.log(response)
            }).catch((error) => {
                console.log(error)
                errorTost(error.response.data.message)
            })
    }

    const handleSignOut = () => {
        axios.get('/api/user/logout')
            .then((response) => {
                console.log(response)
            }).catch((error) => {
                console.log(error)
                errorTost(error.response.data.message)
            })
    }

    return (
        <div style={{ minHeight: '100vh' }} className='h-full bg-black text-white'>
            {/* Top Part */}
            <div className='border-b-4 h-1/3 border-white overflow-hidden'>
                <img src={user?.coverImg || "https://images.pexels.com/photos/3560168/pexels-photo-3560168.jpeg?auto=compress&cs=tinysrgb&w=600"} alt="cover_image" className='h-32 w-full' />
            </div>

            {/* Hero Section */}
            <div className='flex items-center h-2/3'>
                <div className='ml-2 absolute top-32'>
                    {/* profile image container */}
                    <div className='rounded-full border-4 overflow-hidden border-solid w-36 relative bottom-16'>
                        <img src={user?.profileImg || "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600"} alt="profile_img" />
                    </div>
                    <div className='ml-2 md:ml-3 -mt-14'>
                        <h1 className='text-green text-xl font-bold '>{user && user.name || 'YOUR_NAME'}<span className='text-brown text-xs font-light'>{" "}{user.type}</span></h1>
                        <p className='text-xs'>{user.email}</p>
                    </div>
                </div>
                {/* Left Pannel */}
                <div className='w-full min-h-full md:w-4/5 pb-5 pt-20'>
                    {/* Name and other buttons */}
                    <div className='flex flex-col gap-5 md:gap-0 mt-24 md:mt-0 justify-center items-center'>
                        <div className='mt-2 ml-1 md:ml-3 flex flex-col gap-2 justify-center items-center'>
                            <h1 className='text-4xl font-bold text-blue'>{greet}</h1>
                            <p className='text-sm text-white'>Welcome to <span>The Quizeee !</span> Get Set Score... </p>
                        </div>

                        {/* Buttons and Drawer Option */}
                        <div className='mt-5 ml-1 flex flex-col md:flex-row gap-8 md:gap-5'>
                            <Button className={`bg-green hover:bg-white md:hover:bg-blue h-1/6 text-white font-bold border-black ${btnDisplay ? 'hidden' : 'visible'}`} variant="outline">Set Exams</Button>
                            <Button className={`bg-green hover:bg-white md:hover:bg-blue h-1/6 text-white font-bold border-black ${!btnDisplay ? 'hidden' : 'visible'}`} variant="outline">Attempt Exams</Button>
                            <Button className={`bg-brown md:hover:bg-white h-1/6 text-white font-bold border-black`} variant="outline">View Results</Button>
                            {/* Drawer for mobile device only*/}
                            <div className='md:hidden flex justify-center items-center'>
                                <Drawer.Root direction="right">
                                    <Drawer.Trigger asChild>
                                        <button>More &#x2192;</button>
                                    </Drawer.Trigger>
                                    <Drawer.Portal>
                                        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                                        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-full w-3/5 mt-24 fixed bottom-0 right-0">
                                            <div className="p-4 bg-white flex-1 h-full">
                                                <div className="max-w-md mx-auto">
                                                    <Drawer.Title className="font-bold mb-4">
                                                        More Options
                                                    </Drawer.Title>
                                                    <p className="text-zinc-600 mb-2">
                                                        This component can be used as a replacement for a Dialog on
                                                        mobile and tablet devices.
                                                    </p>
                                                    <p className="text-zinc-600 mb-8">
                                                        It uses{" "}
                                                        <a
                                                            href="https://www.radix-ui.com/docs/primitives/components/dialog"
                                                            className="underline"
                                                            target="_blank"
                                                        >
                                                            Radix&rsquo;s Dialog primitive
                                                        </a>{" "}
                                                        under the hood and is inspired by{" "}
                                                        <a
                                                            href="https://twitter.com/devongovett/status/1674470185783402496"
                                                            className="underline"
                                                            target="_blank"
                                                        >
                                                            this tweet.
                                                        </a>
                                                    </p>
                                                </div>
                                            </div>
                                        </Drawer.Content>
                                    </Drawer.Portal>
                                </Drawer.Root>
                            </div>
                        </div>
                        <h2 className={`mt-2 hidden md:${carouselDisplay ? 'block' : 'hidden'}`}>Previous Questions</h2>
                    </div>

                    {/* To display some question set by the teacher */}
                    <div className={`hidden md:${carouselDisplay ? 'flex' : 'hidden'} items-center justify-center mt-20 md:mt-1 `}>
                        <Carousel
                            opts={{
                                align: "start",
                            }}
                            plugins={[
                                Autoplay({
                                    delay: 2000,
                                }),
                            ]}
                            className="w-3/5"
                        >
                            <CarouselContent className="h-fit">
                                {dummyData.map((_, index) => (
                                    <CarouselItem key={index}>
                                        <div className="p-1">
                                            <Card className="bg-dark h-fit text-white">
                                                <CardContent className={`${errText ? 'flex' : 'hidden'} gap-5 items-center justify-start pt-4`}>
                                                    <div className='flex flex-col flex-wrap'>
                                                        <p className="text-base font-semibold">{index + 1} {dummyData[index]?.questionText}</p>
                                                        {dummyData[index].options?.map((option, index) => (
                                                            <div className='flex flex-col' key={index}>
                                                                <span className='text-sm'>{option}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <p className='text-blue font-bold'>Correct Option: </p>
                                                        <span className='text-sm font-normal'>{dummyData[index]?.correctOption}</span>
                                                    </div>

                                                    <div className='flex flex-col'>
                                                        <p className='text-green font-bold'>Explaintion: </p>
                                                        <span className='font-normal'>{dummyData[index]?.explaintion}</span>
                                                    </div>
                                                </CardContent>
                                                <CardContent className={`justify-center items-center ${errText? 'hidden' : 'flex'}`}>
                                                    <h1>NO QUESTIONS FOUND !!</h1>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="bg-transparent text-white" />
                            <CarouselNext className="bg-transparent text-white" />
                        </Carousel>
                    </div>
                </div>

                {/* Right Pannel */}
                <div className='h-full hidden md:flex flex-col gap-28 border-l-4 justify-between items-center w-1/5 py-6'>
                    <div className='flex flex-col w-full h-full gap-5 items-center justify-between'>
                        <UpdateProfilePage />
                        <ProfileForm />
                        <Button className={`bg-transparent ${btnDisplay}`} variant="outline">Delete Questions</Button>
                        <Button onClick={handleDeleteAccount} variant="destructive">Delete Account</Button>
                    </div>

                    <Button className="hover:bg-dark" onClick={handleSignOut}>Sign Out</Button>
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

export default Dashboard
