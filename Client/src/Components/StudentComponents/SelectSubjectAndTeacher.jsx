import React, { useEffect, useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';
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
            <Button variant="outline" className = {className} >Attempt Test</Button>
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
            <Button variant="outline" className="bg-transparent">Attempt Test</Button>
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
  const [subjectValue, setSubjectValue] = useState("-");
  const [teacherName, setTeacherName] = useState("-");
  const [allSubjects, setAllSubjects] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [subRes, teachRes] = await Promise.all([
        axios.get("/api/test/all-subjects"),
        axios.get("/api/test/all-teachers"),
      ]);
      setAllSubjects(subRes.data.data);
      setAllTeachers(teachRes.data.data);
      setFilteredSubjects(subRes.data.data);
      setFilteredTeachers(teachRes.data.data);
    } catch (err) {
      console.error("Error fetching initial data:", err);
    }
  };

  const handleSubjectChange = async (e) => {
    const selected = e.target.value;
    setSubjectValue(selected);
    if (selected !== "-") {
      try {
        const res = await axios.get(`/api/test/teachers/subject/${selected}`);
        setFilteredTeachers(res.data.data);
      } catch (err) {
        console.error("Error fetching teachers by subject:", err);
      }
    } else {
      resetFilters();
    }
  };

  const handleTeacherChange = async (e) => {
    const selected = e.target.value;
    setTeacherName(selected);
    if (selected !== "-") {
      try {
        const res = await axios.get(`/api/test/subjects/teacher/${selected}`);
        setFilteredSubjects(res.data.data);
      } catch (err) {
        console.error("Error fetching subjects by teacher:", err);
      }
    } else {
      resetFilters();
    }
  };

  const resetFilters = () => {
    setSubjectValue("-");
    setTeacherName("-");
    setFilteredSubjects(allSubjects);
    setFilteredTeachers(allTeachers);
  };

  const handleGo = (e) => {
    e.preventDefault();
    if (subjectValue === "-" || teacherName === "-") {
      toast.error("Please select both subject and teacher.");
    } else {
      setOpen(false);
      navigate(`/take-test/${subjectValue}/${teacherName}`);
    }
  };

  return (
    <form className={cn("grid items-center grid-cols-2 gap-4", className)}>
      <div className="w-fit">
        <Label htmlFor="subject">Subject</Label>
        <select
          value={subjectValue}
          onChange={handleSubjectChange}
          className="bg-dark text-white ml-2"
        >
          <option value="-">Select</option>
          {filteredSubjects.map((sub, idx) => (
            <option key={idx} value={sub}>{sub}</option>
          ))}
        </select>
      </div>

      <div className="w-fit">
        <Label htmlFor="teacher">Teacher</Label>
        <select
          value={teacherName}
          onChange={handleTeacherChange}
          className="bg-dark text-white ml-2"
        >
          <option value="-">Select</option>
          {filteredTeachers.map((teacher, idx) => (
            <option key={idx} value={teacher}>{teacher}</option>
          ))}
        </select>
      </div>

      <div className="col-span-2 flex justify-between">
        <Button type="submit" onClick={handleGo} className="bg-blue hover:bg-black hover:text-white">
          Go
        </Button>
        <Button type="button" onClick={resetFilters} className="bg-red hover:bg-black hover:text-white">
          Reset
        </Button>
      </div>
    </form>
  );
}


export default SelectSubjectAndTeacher;
