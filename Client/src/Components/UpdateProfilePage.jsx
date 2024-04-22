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

const errorTost = (message) => toast.error(message);
const successTost = (message) => toast.success(message);

function UpdateProfilePage() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-transparent">Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-dark text-white">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <DetailsForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="bg-transparent">Edit Profile</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <DetailsForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function DetailsForm({ className }) {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
// Handle name and email changes
  const handleNameChange = (e) => {
    setUserName(e.target.value);
    console.log(email);
  }
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    console.log(userName);
  }

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the form data to the server
      const response = await axios.put('/api/user/update', {
        name: userName,
        email: email
      });
      successTost(response.data.message);
      console.log(response.data);
    } catch (error) {
      errorTost(error.response.data.message || "An error occurred while updating the profile.");
      console.error(error);
  }
}

  const [formData, setFormData] = useState(new FormData());
  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    const newFormData = new FormData();
    newFormData.append(field, file);
    setFormData(newFormData);
    console.log(newFormData);
  }

  const handleImageUpload = async () => {
    try {
      // Send the image data to the server
      const response = await axios.put('/api/user/add-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      successTost(response.data.message);
      console.log(response.data);
    } catch (error) {
      errorTost(error.response.data.message || "An error occurred while uploading the image(s).");
      console.error(error);
    }
  }

  return (
    <form className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input 
         onChange={handleEmailChange}
        type="email"
        id="email"
        value={email}
        className="bg-dark text-white"/>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="username">Name</Label>
        <Input 
        onChange={handleNameChange}
        id="username"
        value={userName}
        className="bg-dark text-white"/>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="profileImg">Avatar</Label>
        <Input onChange={(e) => handleImageChange(e, 'profileImg')} type="file" accept='image/*' id="profileImg" className="bg-blue text-white"/>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="coverImg">Cover Image</Label>
        <Input onChange={(e) => handleImageChange(e, 'coverImg')} type="file" accept='image/*' id="coverImg" className="bg-blue text-white"/>
      </div>
      <Button onClick={handleImageUpload} type="button" className="bg-black">Upload Image(s)</Button>
      <Button onClick={handleDetailsSubmit} type="submit" className="bg-black">Save changes</Button>
    </form>
  );
}

export default UpdateProfilePage;
