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

function SelectSubjectAndTeacher({ className }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className = {className} >Search</Button>
          </DialogTrigger>
          <DialogContent className="md:w-screen bg-dark text-white">
            <DialogHeader>
              <DialogTitle className="text-center text-green">Search Test</DialogTitle>
            </DialogHeader>
            <QuestionFrom open={open} setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="bg-transparent">Search</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Search Test</DrawerTitle>
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
  const [subjectValue, setSubjectValue] = useState('');
  const [teacherName, setTeacherName] = useState('');

  const errorToast = (message) => toast.error(message);
  const successToast = (message) => toast.success(message);

  return (
    <form className={cn("grid items-start gap-4", className)}>
      <div className={`w-fit`}>
        <Label htmlFor="subject">Subject</Label>
        <Input
          value={subjectValue}
          onChange={(e) => setSubjectValue(e.target.value)}
          type="text"
          id="subject"
          name="subject"
          className="bg-dark text-white"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="questionText">Question Text</Label>
        <Input
          type="text"
          id="questionText"
          name="questionText"
          className="bg-dark text-white"
        />
      </div>
      <div className="flex justify-between">
        <Button type="submit" className="bg-blue hover:bg-black hover:text-white">Go</Button>
      </div>
    </form>
  );
}

export default SelectSubjectAndTeacher;
