import React, { useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { useMediaQuery } from '@custom-react-hooks/all';
import { Button } from "@/Components/ui/button";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

const errorTost = (message) => toast.error(message);
const successTost = (message) => toast.success(message);

function ForgetPasswordPage() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="bg-transparent hover:bg-transparent font-light text-white hover:text-blue">Forget Password</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-dark text-white">
          <DialogHeader>
            <DialogTitle>Forget Password</DialogTitle>
            <DialogDescription>
                Enter your registered email address to receive a password reset link.
            </DialogDescription>
          </DialogHeader>
          <PasswordFrom />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="bg-transparent">Forget Password</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Forget Password</DrawerTitle>
          <DrawerDescription>
            Enter your registered email address to receive a password reset link.
          </DrawerDescription>
        </DrawerHeader>
        <PasswordFrom className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function PasswordFrom({ className }) {
    const [email, setEmail] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);

    const errorTost = (message) => toast.error(message);
    const successTost = (message) => toast.success(message);
// Handle name and email changes
const handleForgetPassword = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('/api/user/forget-password', {
            email: email,
        });

        if (response.status === 200) {
            setIsEmailSent(true);
            successTost('Password reset link sent successfully. Please check your email.');
        }
    } catch (err) {
        errorTost(err.response.data.message || 'An error occurred while processing your request.');
        console.error(err);
    }
}

  return (
    <>
        <h1 className={`text-4xl font-bold text-center mb-4 text-blue`}>The Quiz App</h1>
    {
        isEmailSent ? (
            <div className="text-center">
                    <p className={`text-green`}>
                        Email sent successfully! Please check your inbox to reset the password.
                    </p>
                </div>
        ) : (
            <form className={cn("grid items-start gap-4", className)}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="currentPassword"
              className="bg-dark text-white"/>
            </div>
            <Button onClick={handleForgetPassword} type="submit" className="bg-blue">Send Email</Button>
          </form>
        )}
   
    </>
  );
}

export default ForgetPasswordPage;
