import React, { useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { questionSchema } from "@/Schemas/questionSchema.js";
import { useMediaQuery } from '@custom-react-hooks/all';
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function AddQuestionPage({ className }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className = {className} >Set Quizes</Button>
          </DialogTrigger>
          <DialogContent className="md:w-screen bg-dark text-white">
            <DialogHeader>
              <DialogTitle className="text-center text-green">Add Question</DialogTitle>
            </DialogHeader>
            <QuestionFrom open={open} setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="bg-transparent">Set Test</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Edit profile</DrawerTitle>
              <DrawerDescription>
                Make changes to your profile here. Click save when you're done.
              </DrawerDescription>
            </DrawerHeader>
            <QuestionFrom className="px-4" open={open} setOpen={setOpen} />
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}

function QuestionFrom({ className, open, setOpen }) {
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [subjectValue, setSubjectValue] = useState('');
  const [formData, setFormData] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctOption: '',
    explanation: '',
  });
  const [errors, setErrors] = useState({});

  const errorToast = (message) => toast.error(message);
  const successToast = (message) => toast.success(message);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleOptionChange = (e) => {
    const index = parseInt(e.target.name.replace('option', '')) - 1;
    const newOptions = [...formData.options];
    newOptions[index] = e.target.value;
    setFormData({ ...formData, options: newOptions });
    setErrors({ ...errors.options, options: '' }); // Clear error for the options field
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      // Validate the form data against the schema
      // Assuming you have a questionSchema defined
      questionSchema.parse(formData);
      // If validation succeeds, hit the API endpoint
      const response = await axios.post('/api/test/create', {...formData, subject: subjectValue}, {
        withCredentials: true,
      });
      successToast(response.data.message);
      if (response.data.success) {
        setIsReadOnly(true);
        setFormData({
          questionText: '',
          options: ['', '', '', ''],
          correctOption: '',
          explanation: '',
        });
        // setSubjectValue(formData.subject);
      }
    } catch (error) {
      setIsReadOnly(false);
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          const path = err.path[0];
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
        errorToast("Please fill in all required fields correctly.");
      } else {
        console.error(error.response.data.message);
        errorToast(error.response.data.message);
      }
    }
  };

  const handleDone = () => {
    setOpen(false); // Close the dialog when "Done" is clicked
  };

  return (
    <form className={cn("grid items-start gap-4", className)}>
      <div className={`w-fit`}>
        <Label htmlFor="subject">Subject</Label>
        <Input
          disabled={isReadOnly}
          value={subjectValue}
          onChange={(e) => setSubjectValue(e.target.value)}
          type="text"
          id="subject"
          name="subject"
          className="bg-dark text-white"
        />
        {errors.subject && <div className="text-red">{errors.subject}</div>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="questionText">Question Text</Label>
        <Input
          value={formData.questionText}
          onChange={handleInputChange}
          type="text"
          id="questionText"
          name="questionText"
          className="bg-dark text-white"
        />
        {errors.questionText && <div className="text-red">{errors.questionText}</div>}
      </div>
      <div className="flex gap-4">
        {formData.options.map((option, index) => (
          <div key={index}>
            <Label htmlFor={`option${index + 1}`}>{`Option ${index + 1}`}</Label>
            <Input
              value={formData.options[index]}
              onChange={handleOptionChange}
              type="text"
              id={`option${index + 1}`}
              name={`option${index + 1}`}
              className="bg-dark text-white"
            />
            {errors.options && errors.options[index] && <div className="text-red">{errors.options[index]}</div>}
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <div>
          <Label htmlFor="explanation">Explanation</Label>
          <Input
            value={formData.explanation}
            onChange={handleInputChange}
            type="text"
            id="explanation"
            name="explanation"
            className="bg-dark text-white h-"
          />
          {errors.explanation && <div className="text-red">{errors.explanation}</div>}
        </div>
        <div>
          <Label htmlFor="correctOption">Correct Option</Label>
          <Input
            value={formData.correctOption}
            onChange={handleInputChange}
            type="text"
            id="correctOption"
            name="correctOption"
            className="bg-dark text-white"
          />
          {errors.correctOption && <div className="text-red">{errors.correctOption}</div>}
        </div>
      </div>
      <div className="flex justify-between">
        <Button onClick={handleAddQuestion} type="submit" className="bg-blue hover:bg-black hover:text-white">Add Question(s)</Button>
        <Button onClick={handleDone} type="button" className="bg-green hover:bg-black hover:text-white">Done</Button>
      </div>
    </form>
  );
}

export default AddQuestionPage;
