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

function UpdatePasswordPage() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-transparent">Update Password</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-dark text-white">
          <DialogHeader>
            <DialogTitle>Update Password</DialogTitle>
            <DialogDescription>
              Make changes to your password here. Click save when you're done.
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
        <Button variant="outline" className="bg-transparent">Update Password</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Update Password</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
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
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
// Handle name and email changes
  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  }
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    try {
      // Validate the form data
      if (newPassword !== confirmPassword) {
        errorTost("Passwords do not match");
        return;
      }
      // If validation succeeds, hit the API endpoint
      // and set the error messages to the response
      axios.put('/api/user/update-password', { currentPassword, newPassword, confirmPassword }, {
        withCredentials: true
      })
        .then((response) => {
          successTost(response.data.message);
        })
        .catch((error) => {
          console.error("Error", error.response);
          errorTost(error.response.data.message || "Error updating password");
        });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input 
         onChange={handleCurrentPasswordChange}
        type="password"
        id="currentPassword"
        value={currentPassword}
        className="bg-dark text-white"/>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input 
        type = "password"
        onChange={handleNewPasswordChange}
        id="newPassword"
        value={newPassword}
        className="bg-dark text-white"/>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input onChange={handleConfirmPasswordChange} type="password" 
        id="confirmPassword" 
        className="bg-dark text-white"/>
      </div>
      <Button onClick={handlePasswordChange} type="submit" className="bg-black">Update</Button>
    </form>
  );
}

export default UpdatePasswordPage;
