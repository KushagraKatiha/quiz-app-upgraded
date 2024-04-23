import React, { useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { useMediaQuery } from '@custom-react-hooks/all';
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

function DeleteQuestionPage({ className }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className = {className} >Delete Questions</Button>
          </DialogTrigger>
          <DialogContent className="md:w-screen bg-dark text-white">
            <DialogHeader>
              <DialogTitle className="text-center text-blue">Delete Questions</DialogTitle>
            </DialogHeader>
            <QuestionFrom open={open} setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="bg-transparent">Delete Questions</Button>
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
  

  const errorToast = (message) => toast.error(message);
  const successToast = (message) => toast.success(message);

  const handleDeleteQuestion = async (e) => {
    e.preventDefault();
    console.log("subjectValue: ", subjectValue);
    try {
        console.log("subjectValue: ", subjectValue);
        await axios.delete('/api/test/delete', { data:{
            subject:subjectValue
        }
        }, {withCredentials: true})
        .then((response) => {
            console.log(response.data);
            successToast((!response.data.deleteCount) ? '0 questions deleted successfully' : response.data.deleteCount + ' questions deleted successfully');
        })
        .catch((error) => {
            console.log(error);
            errorToast(error.response.data.message);
        }
        );
    } catch (error) {
        errorToast('Failed to delete question');
        console.error(error);
    }
  };

  const deleteAllQuestions = async (e) => {
    e.preventDefault();
    try {
        await axios.delete('/api/test/delete-all', {
            subjectValue: ''
        }, {withCredentials: true})
        .then((response) => {
            console.log(response.data);
            successToast((!response.data.deleteCount) ? '0 questions deleted successfully' : response.data.deleteCount + ' questions deleted successfully');
        })
        .catch((error) => {
            console.log(error);
            errorToast(error.response.data.message);
        }
        );
    } catch (error) {
        errorToast('Failed to delete question');
        console.error(error);
    }
    };

  return (
    <form className={cn("grid items-start gap-4", className)}>
      <div className={`w-fit`}>
        <Label htmlFor="subject">Enter Subject</Label>
        <Input
          value={subjectValue}
          onChange={(e) => setSubjectValue(e.target.value)}
          type="text"
          id="subject"
          name="subject"
          className="bg-dark text-white"
        />
        <p className="text-left text-white text-xs">Choose subject from <b>General Knowledge, English, Social Science, Science</b> only.</p>
      </div>
      <div className="flex justify-between">
        <Button onClick={handleDeleteQuestion} variant="outline" className="bg-transparent hover:bg-black hover:text-white">Delete Question(s)</Button>
        <Button onClick={deleteAllQuestions} variant="destructive" className="w-20 text-xs">Delete All</Button>
      </div>
    </form>
  );
}

export default DeleteQuestionPage;
