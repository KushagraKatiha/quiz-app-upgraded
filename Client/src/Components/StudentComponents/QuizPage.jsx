import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import TestInstruction from './TestInstruction';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function QuizPage() {
    const { subject, teacherName } = useParams();
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [timeRemaining, setTimeRemaining] = useState(null); // Total time remaining for all questions
    const [confirmSubmit, setConfirmSubmit] = useState(false); // State variable to track confirmation
    const navigate = useNavigate();

    const errorTost = (message) => toast.error(message);
    const successTost = (message) => toast.success(message);

    const startTimer = () => {
        if (timeRemaining === null) {
            const totalTime = questions.length * 30;
            setTimeRemaining(totalTime);
        }
    };

    useEffect(() => {
        axios.get(`/api/test/student/get/${subject}/${teacherName}`, { withCredentials: true })
            .then((response) => {
                setQuestions(response.data.data);
                // Initialize userAnswers with default values (no answer selected)
                const initialUserAnswers = {};
                response.data.data.forEach((question, index) => {
                    initialUserAnswers[index] = -1; // Use -1 to represent no answer selected
                });
                setUserAnswers(initialUserAnswers);
            })
            .catch((error) => {
                alert(error.response.data.message)
                navigate('/dashboard');
            });
    }, [subject, teacherName]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleOptionChange = (questionIndex, optionIndex) => {
        setUserAnswers({
            ...userAnswers,
            [questionIndex]: optionIndex
        });
    };

    const handleSubmit = () => {
        if (confirmSubmit) {
            // Calculate score
            let newScore = 0;
            const selectedAnswersArray = [];
            const correctAnswersArray = [];
            questions.forEach((question, index) => {
                const userAnswerIndex = userAnswers[index];
                const correctAnswerIndex = question.correctOption - 1;
                selectedAnswersArray.push(userAnswerIndex);
                correctAnswersArray.push(correctAnswerIndex);
                if (userAnswerIndex !== -1) { // Check if the user has attempted the question
                    if (userAnswerIndex === correctAnswerIndex) {
                        newScore += 3; // Add 3 marks for correct answer
                    } else {
                        newScore -= 1; // Subtract 1 mark for wrong answer
                    }
                }
            });
            // Update score using functional update
            setScore(prevScore => prevScore + newScore);
            setSelectedAnswers(selectedAnswersArray);
            setCorrectAnswers(correctAnswersArray);
            setShowResults(true);
        } else {
            // Show error toast if OK is not clicked
            errorTost("Please click 'OK' before submitting.");
        }
    };


    useEffect(() => {
        // Save the results to the database when score changes
        if (showResults) {
            try {
                axios.post('/api/result/save', {
                    subject,
                    teacherName,
                    maxMarks: questions.length * 3,
                    obtMarks: score
                }, {
                    withCredentials: true
                }).then((response) => {
                    successTost(response.data.message);
                }).catch((error) => {
                    errorTost(error.response.data.message);
                });
            } catch (error) {
                errorTost("An error occurred while processing your request.");
            }
        }
    }, [score, showResults]);


    const handleDone = (e) => {
        navigate('/dashboard');
        setShowResults(false);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            if (timeRemaining > 0) {
                setTimeRemaining((prevTime) => prevTime - 1);
            }
        }, 1000);

        // Clear timer when component unmounts
        return () => clearInterval(timer);
    }, [timeRemaining]);

    useEffect(() => {
        if (timeRemaining === 0 && !showResults) {
            handleSubmit(); // Submit the quiz when time runs out
        }
    }, [timeRemaining, showResults, handleSubmit]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            // Display confirmation message when the user tries to leave the page
            const confirmationMessage = 'If you leave the page, your test progress will be submitted, and you won\'t be able to attempt it again.';
            event.preventDefault();
            event.returnValue = confirmationMessage;
            return confirmationMessage;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    // Run the submit function if the user still reloads the page
    window.onbeforeunload = function () {
        handleSubmit();
    };

    // Function to handle confirmation from TestInstruction component
    const handleTestStart = () => {
        setConfirmSubmit(true); // Update confirmation flag
        startTimer(); // Start the timer
    };

    return (
        <div className='bg-black'>
            <h1 className='text-center text-green text-3xl mt-3 font-bold'>THE QUIZEEE</h1>
            <div className='w-full flex justify-between'>
                <div className="h-full flex flex-col justify-center items-left ml-5 bg-black mb-3">
                    {!showResults && questions.map((question, questionIndex) => (
                        <div key={questionIndex} className="my-4 border-2 p-5 rounded-lg bg-dark w-full">
                            <h1 className="text-xl font-semibold block text-blue"><span className="mr-2 text-white">{questionIndex + 1}</span>{question.questionText}</h1>
                            <div className="mt-2">
                                {question.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center text-white">
                                        <input
                                            type="radio"
                                            value={option}
                                            name={`question_${questionIndex}`}
                                            checked={userAnswers[questionIndex] === optionIndex}
                                            onChange={() => handleOptionChange(questionIndex, optionIndex)}
                                        />
                                        <label className="ml-2">{option}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {showResults && (
                        <div className="my-4 text-white">
                            <div className='w-full border-2 rounded-lg bg-dark p-5'>
                                <h2 className="text-2xl font-semibold text-green">Result</h2>
                                <p className="mb-2"> <span className='text-white font-extrabold'>Your score: </span> {score} out of {questions.length * 3}</p>
                                <p className={(score >= questions.length * 3 / 2) ? 'text-green' : 'text-red'}>
                                <span className='text-white font-extrabold'>Remarks: </span>    {score >= questions.length * 3 / 2 ? 'Congratulations, you passed!' : 'You need more practice.'}</p>
                            </div>

                            <h2 className='mt-2 text-center text-blue text-2xl font-bold underline underline-offset-8 '>Answers Below</h2>

                            {questions.map((question, questionIndex) => (
                                <div key={questionIndex} className="my-4 border-2 p-5 rounded-lg bg-dark w-full">
                                    <h1 className="text-xl font-semibold"><span className='mr-2'>{questionIndex + 1}</span>{question.questionText}</h1>
                                    <div className="mt-2">
                                        {question.options.map((option, optionIndex) => (
                                            <p key={optionIndex} className={(correctAnswers[questionIndex] === optionIndex) ? 'text-green' : (selectedAnswers[questionIndex] === optionIndex) ? 'text-red' : 'text-blue'}>
                                                {option}
                                            </p>
                                        ))}
                                        <p className="text-white">Marks:
                                            {userAnswers[questionIndex] !== -1 ?
                                                correctAnswers[questionIndex] === selectedAnswers[questionIndex] ? '+3' : '-1' :
                                                '0'
                                            }
                                        </p>
                                        <div className='flex gap-2'>
                                            <h2 >Explanation: </h2>
                                            <p >{question.explanation}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className='flex'>
                        {
                            !showResults && <Button className="w-fit mt-4 bg-blue hover:bg-black hover:text-white" onClick={handleSubmit}>Submit</Button>
                        }
                        {showResults && <Button className="w-fit mt-4 bg-green hover:bg-brown" onClick={handleDone}>Done</Button>}
                    </div>
                </div>

                <div className='mr-0 w-1/6 flex gap-3 flex-col items-center fixed right-5'>
                    <img src="/src/assets/main-logo.png" alt="main-logo" className='w-fit' />
                    {!showResults && (
                        <>
                            <p className='text-white'>Time Remaining: </p>
                            <p className='text-white'>{formatTime(timeRemaining)}</p>
                            <TestInstruction
                                onStartTest={handleTestStart} // Pass the handleTestStart function
                                className={`bg-white text-black hover:bg-dark hover:text-green`}
                            />
                        </>
                    )}
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
    );
}

export default QuizPage;
