import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button'; // change to @/Components
import { Input } from '@/components/ui/input'; // change to @/Components
import { Label } from '@/components/ui/label'; // change to @/Components

function AttemptQuizPage() {
  const [subject, setSubject] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.post('/api/test/attempt-quiz', {
          subject,
          teacherName,
        }, { withCredentials: true });
        setQuestions(response.data.questions);
        setLoading(false);
      } catch (error) {
        setError(error.response.data.message);
        setLoading(false);
      }
    };

    fetchQuestions(); // Call fetchQuestions here

  }, [subject, teacherName]); // Include subject and teacherName in the dependency array

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Attempt Quiz Page</h1>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <Label htmlFor="subject">Subject</Label>
          <Input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="teacherName">Teacher Name</Label>
          <Input
            type="text"
            id="teacherName"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          />
        </div>
        {/* <Button
          onClick={fetchQuestions}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Start Quiz
        </Button> */}
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {questions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quiz Questions</h2>
          <ul className="space-y-4">
            {questions.map((question, index) => (
              <li key={index}>
                <p>{question.text}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AttemptQuizPage;
