import React, { useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";    // change to @/Components
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Input } from "@/components/ui/input";  // change to @/Components
import { Label } from "@/components/ui/label";  // change to @/Components
import { useParams, useNavigate } from "react-router-dom";

const errorTost = (message) => toast.error(message);
const successTost = (message) => toast.success(message);

function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { forgetPasswordToken } = useParams();
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            if (newPassword !== confirmPassword) {
                errorTost('Passwords do not match');
                return;
            }

            if (newPassword.length < 6) {
                errorTost('Password must be at least 6 characters long');
                return;
            }

            const response = await axios.put(`/api/user/reset-password/${forgetPasswordToken}`, {
                newPassword,
                confirmPassword
            });

            if (response.status === 200) {
                successTost('Password reset successfully');
                setNewPassword('');
                setConfirmPassword('');
                // Redirect to login page after successful password reset
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        } catch (err) {
            errorTost(err.response?.data?.message || 'An error occurred while resetting your password.');
            console.error(err);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark">
            <div className="w-full max-w-md p-8 bg-black rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold text-center mb-8 text-blue">Reset Password</h1>
                <form className="grid items-start gap-6" onSubmit={handleResetPassword}>
                    <div className="grid gap-2">
                        <Label htmlFor="newPassword" className="text-white">New Password</Label>
                        <Input 
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            id="newPassword"
                            placeholder="Enter new password"
                            className="bg-dark text-white"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                        <Input 
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            id="confirmPassword"
                            placeholder="Confirm new password"
                            className="bg-dark text-white"
                            required
                        />
                    </div>
                    <Button type="submit" className="bg-blue text-white hover:bg-blue/90">
                        Reset Password
                    </Button>
                </form>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
    );
}

export default ResetPassword;
