import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import TestInstruction from './TestInstruction';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

function QuizPage() {
    const { subject, teacherName } = useParams();
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [confirmSubmit, setConfirmSubmit] = useState(false);
    const navigate = useNavigate();
    const [warnings, setWarnings] = useState(0);

    const [streamRef, setStreamRef] = useState(null);
    const [intervalRef, setIntervalRef] = useState(null);

    useEffect(() => {
        socket.on('connect', () => console.log("Connected:", socket.id));
        socket.on('connect_error', err => console.error("Connection error:", err));
    }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                toast.warn("Tab switch detected!");
                setWarnings(prev => {
                    const newWarnings = prev + 1;
                    if (newWarnings >= 3) {
                        toast.error("Too many tab switches. Submitting test.");
                        handleSubmit();
                    }
                    return newWarnings;
                });
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    useEffect(() => {
        if (confirmSubmit) {
            let stream;
            // let interval;
            const video = document.createElement('video');
            const startCamera = async () => {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    video.autoplay = true;
                    video.playsInline = true;
                    video.muted = true;
                    video.style.width = '200px';
                    video.style.height = '150px';
                    video.srcObject = stream;
                    video.onplaying = () => {
                        const canvas = document.createElement("canvas");
                        canvas.width = 320;
                        canvas.height = 240;
                        const ctx = canvas.getContext("2d");

                        const newInterval = setInterval(() => {
                            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                            const image = canvas.toDataURL("image/jpeg");
                            socket.emit("video_frame", { image });
                        }, 10000);
                        
                        setIntervalRef(newInterval);
                        

                        // setIntervalRef(interval);
                        setStreamRef(stream);
                    };

                    document.getElementById('vdo-container').appendChild(video);
                } catch (err) {
                    console.error("Webcam error:", err);
                }
            };
            startCamera();
            socket.on('proctor_alert', ({ status }) => {
                const handleWarning = msg => {
                    toast.warn(msg);
                    setWarnings(prev => {
                        const newWarnings = prev + 1;
                        if (newWarnings >= 3) handleSubmit();
                        return newWarnings;
                    });
                };
                if (status === 'no_face') handleWarning("Face not detected!");
                if (status === 'multiple_faces') handleWarning("Multiple faces detected!")
                if (status === 'face_moved') handleWarning("Face moved!");
            });
            return () => {
                stopCamera();
                socket.disconnect();
            };
        }
    }, [confirmSubmit]);

    const startTimer = () => {
        if (timeRemaining === null) {
            setTimeRemaining(questions.length * 30);
        }
    };

    useEffect(() => {
        axios.get(`/api/test/student/get/${subject}/${teacherName}`, { withCredentials: true })
            .then(res => {
                setQuestions(res.data.data);
                const initial = {};
                res.data.data.forEach((q, i) => initial[i] = -1);
                setUserAnswers(initial);
            })
            .catch(err => {
                alert(err.response.data.message);
                navigate('/dashboard');
            });
    }, [subject, teacherName]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (timeRemaining > 0) setTimeRemaining(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeRemaining]);

    useEffect(() => {
        if (timeRemaining === 0 && !showResults) handleSubmit();
    }, [timeRemaining, showResults]);

    useEffect(() => {
        const handleUnload = e => {
            const msg = 'Leaving will submit your test.';
            e.preventDefault();
            e.returnValue = msg;
            handleSubmit();
            return msg;
        };
        window.addEventListener('beforeunload', handleUnload);
        return () => window.removeEventListener('beforeunload', handleUnload);
    }, []);

    const handleOptionChange = (qIdx, oIdx) => setUserAnswers({ ...userAnswers, [qIdx]: oIdx });

    const stopCamera = () => {
        if (intervalRef) {
            clearInterval(intervalRef);
            setIntervalRef(null);
        }
    
        if (streamRef) {
            streamRef.getTracks().forEach(track => track.stop());
            setStreamRef(null);
        }
    
        const videoContainer = document.getElementById('vdo-container');
        if (videoContainer) videoContainer.innerHTML = '';
    };
    

    const handleSubmit = () => {
        stopCamera();

        if (!confirmSubmit) {
            errorTost("Please click 'OK' before submitting.");
            return;
        }

        let newScore = 0;
        const selectedAnswersArray = [];
        const correctAnswersArray = [];
        questions.forEach((question, index) => {
            const userAnswerIndex = userAnswers[index];
            const correctAnswerIndex = question.correctOption - 1;
            selectedAnswersArray.push(userAnswerIndex);
            correctAnswersArray.push(correctAnswerIndex);
            if (userAnswerIndex !== -1) {
                if (userAnswerIndex === correctAnswerIndex) {
                    newScore += 3;
                } else {
                    newScore -= 1;
                }
            }
        });

        setScore(prevScore => prevScore + newScore);
        setSelectedAnswers(selectedAnswersArray);
        setCorrectAnswers(correctAnswersArray);
        setShowResults(true);
    };

    useEffect(() => {
        if (showResults) {
            axios.post('/api/result/save', {
                subject, teacherName,
                maxMarks: questions.length * 3,
                obtMarks: score
            }, { withCredentials: true })
                .then(res => toast.success(res.data.message))
                .then(res => stopCamera())
                .catch(err => toast.error(err.response.data.message));
        }
    }, [score, showResults]);

    const handleTestStart = () => {
        setConfirmSubmit(true);
        startTimer();
    };

    const formatTime = t => `${Math.floor(t / 60)}:${t % 60 < 10 ? '0' : ''}${t % 60}`;

    return (
        <div className='bg-black'>
            <h1 className='text-center text-green text-3xl mt-3 font-bold'>THE QUIZEEE</h1>
            <div className='w-full flex justify-between'>
                <div className="ml-5 bg-black mb-3">
                    {!showResults && questions.map((q, i) => (
                        <div key={i} className="my-4 border-2 p-5 rounded-lg bg-dark">
                            <h1 className="text-xl font-semibold text-blue"><span className="mr-2 text-white">{i + 1}</span>{q.questionText}</h1>
                            <div className="mt-2">
                                {q.options.map((opt, j) => (
                                    <div key={j} className="flex items-center text-white">
                                        <input type="radio" name={`question_${i}`} checked={userAnswers[i] === j} onChange={() => handleOptionChange(i, j)} />
                                        <label className="ml-2">{opt}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {showResults && (
                        <div className="text-white">
                            <div className='border-2 rounded-lg bg-dark p-5'>
                                <h2 className="text-2xl font-semibold text-green">Result</h2>
                                <p>Your score: {score} / {questions.length * 3}</p>
                                <p className={score >= questions.length * 3 / 2 ? 'text-green' : 'text-red'}>
                                    Remarks: {score >= questions.length * 3 / 2 ? 'Passed!' : 'Try Again.'}</p>
                            </div>
                            <h2 className='mt-2 text-center text-blue text-2xl font-bold underline'>Answers Below</h2>
                            {questions.map((q, i) => (
                                <div key={i} className="my-4 border-2 p-5 rounded-lg bg-dark">
                                    <h1 className="text-xl font-semibold">{i + 1}. {q.questionText}</h1>
                                    <div className="mt-2">
                                        {q.options.map((opt, j) => (
                                            <p key={j} className={correctAnswers[i] === j ? 'text-green' : selectedAnswers[i] === j ? 'text-red' : 'text-blue'}>
                                                {opt}
                                            </p>
                                        ))}
                                        <p>Marks: {userAnswers[i] !== -1 ? correctAnswers[i] === selectedAnswers[i] ? '+3' : '-1' : '0'}</p>
                                        <div className='flex gap-2'>
                                            <h2>Explanation:</h2><p>{q.explanation}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className='flex'>
                        {!showResults && <Button className="mt-4 bg-blue" onClick={handleSubmit}>Submit</Button>}
                        {showResults && <Button className="mt-4 bg-green" onClick={() => navigate('/dashboard')}>Done</Button>}
                    </div>
                </div>

                <div className='mr-0 w-1/6 flex gap-3 flex-col items-center fixed right-5'>
                    <img src="/src/assets/main-logo.png" alt="main-logo" className='w-fit' />
                    {!showResults && (
                        <>
                            <p className='text-white'>Time Remaining:</p>
                            <p className='text-white'>{formatTime(timeRemaining)}</p>
                            <TestInstruction onStartTest={handleTestStart} className='bg-white text-black' />
                            <div id="vdo-container" className="border-red border-2"></div>
                        </>
                    )}
                </div>
            </div>
            <p className='text-red font-semibold'>Warnings: {warnings} / 3</p>
            <ToastContainer theme="dark" position="top-right" />
        </div>
    );
}

export default QuizPage;