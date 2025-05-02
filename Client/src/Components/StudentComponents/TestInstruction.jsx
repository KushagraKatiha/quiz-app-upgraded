// TestInstruction.js

import React, { useState } from "react";
import { useMediaQuery } from '@custom-react-hooks/all';
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/Components/ui/drawer";

function TestInstruction({ onStartTest }) {
    const [open, setOpen] = useState(true);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const handleOKClick = () => {
        setOpen(false);
        onStartTest(); // Call the function to start the timer
    };

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="bg-dark text-white hover:bg-dark hover:text-green">Test Instructions</Button>
                </DialogTrigger>
                <DialogContent className="w-[800px] bg-dark text-white"> {/* Adjust maxWidth here */}
                    <DialogHeader>
                        <DialogTitle>Test Instructions</DialogTitle>
                        <DialogDescription>
                            Read The Instructions Carefully Before Attempting The Test
                        </DialogDescription>
                    </DialogHeader>
                    <DetailsForm onOKClick={handleOKClick} />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" className="bg-transparent">Test Instruction</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Test Instructions</DrawerTitle>
                    <DrawerDescription>
                        Read The Instructions Carefully Before Attempting The Test
                    </DrawerDescription>
                </DrawerHeader>
                <DetailsForm className="px-4" onOKClick={handleOKClick} />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Start Test</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

function DetailsForm({ className, onOKClick }) {
    
    return (
        <div>
            <p>
                Each question has only one correct answer.
            </p>
            <hr />
            <br />
            <p>
                You will be awarded 3 marks for each correct answer.
            </p>
            <hr />
            <br />
            <p>
                There is a penalty of 1 mark for each wrong answer.
            </p>
            <hr />
            <br />
            <p>
                There is no negative marking for unattempted questions.
            </p>
            <hr />
            <br />
            <p>
                Time is according to 30 seconds per question.
            </p>
            <hr />
            <br />
            <p>
                You can submit the test before the time runs out.
            </p>
            <hr />
            <br />
            <p><strong>
                Don't refresh the page or go back, otherwise, the test will be submitted automatically.
            </strong></p>
            <br />
            <p>
                <b>Click Ok To Start The Test !!</b>
            </p>
            <Button className='bg-green text-white' onClick={(e)=>{
                e.preventDefault();
                onOKClick(); // Call the onOKClick function passed from the parent component
            }}> OK </Button>
        </div>
    );
}

export default TestInstruction;
