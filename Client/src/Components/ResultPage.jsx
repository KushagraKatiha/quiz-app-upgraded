import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"    // change to @/Components
import { Button } from "@/components/ui/button";    // change to @/Components
import { useNavigate } from 'react-router-dom';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"   // change to @/Components


function ResultPage() {
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch results from the database
        axios.get('/api/result/get')
            .then(response => {
                setResults(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching results:', error);
            });
    }, []);

    useEffect(() => {
    }, [results]);

    return (
        <div className="w-full h-full flex flex-col justify-center">
            <h1 className="text-center text-green text-3xl font-bold mt-5">THE QUIZEEE</h1>
            <h2 className="text-center text-white text-xl font-bold mt-5">Results</h2>
            <div className={`flex items-center justify-center mt-20 md:mt-1 `}>
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    plugins={[
                        Autoplay({
                            delay: 10000,
                        }),
                    ]}
                    className="w-3/5"
                >
                    <CarouselContent className="h-fit flex justify-center items-center">
                        {results.length > 0 && results.map((result, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1">
                                    <Card className="bg-dark h-fit text-white">
                                        <CardContent className="flex flex-col gap-2 pt-4">
                                            <p><strong>Student:</strong> {result.student?.name || "Unknown"}</p>
                                            <p><strong>Subject:</strong> {result.subject}</p>
                                            <p><strong>Teacher:</strong> {result.teacherName}</p>
                                            <p><strong>Max Marks:</strong> {result.maxMarks}</p>
                                            <p><strong>Obtained Marks:</strong> {result.obtMarks}</p>
                                            <p><strong>Date:</strong> {new Date(result.createdAt).toLocaleString()}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}

                        {results.length <= 0 && (
                            <h1 className='text-white text-center'>
                                No Results Found For You !!
                            </h1>
                        )}

                    </CarouselContent>
                    <CarouselPrevious className="bg-transparent text-white" />
                    <CarouselNext className="bg-transparent text-white" />
                </Carousel>
            </div>
            <Button
                onClick={() => navigate('/dashboard')}
                className="bg-green text-white w-fit m-auto mt-5 "
            > Go Back </Button>
        </div>
    );
}

export default ResultPage;
