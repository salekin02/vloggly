
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Email from './form-items/email';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { forgotPassword } from '@/services';
import { toast } from 'sonner';
const ForgotPassword = () => {
    const [open, setOpen] = useState(false)
    const [email, setEmail] = useState("")
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await forgotPassword({
                email
            });

            if (response.success) {

                if (response.data?.isEmailVerified === false) {
                    toast.error("Please verify your email address");
                    router.push("/sign-up/verify-email");
                    return;
                }
                toast.success(response.message || "Password reset successful");
            } else {
                toast.error(response.message || "Invalid email");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (<Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="text-sm hover:text-brand text-neutral-600 cursor-pointer">
            Forgot Password?
        </DialogTrigger>
        <DialogContent className="sm:max-w-[412px] p-0 gap-0 rounded-[20px] [&>button]:hidden">
            <div className='p-4 pt-6'>
                <DialogHeader className="mb-4 px-5">
                    <DialogTitle className="text-center text-[#151515] text-base font-medium">Forgot Password</DialogTitle>
                    <DialogDescription className="text-center text-sm text-[#676767]">
                        Please enter your email address so we can send you a password reset link
                    </DialogDescription>
                </DialogHeader>
                <Email onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
            </div>
            <Separator className="mt-2" />
            <div className="flex gap-2 p-4">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-10 rounded-full bg-[#E6F1FD] border-transparent text-brand-500 hover:text-brand-500 hover:bg-[#E6F1FD] hover:border-brand-500 active:shadow-[0px_0px_0px_4px_rgba(0,115,230,0.20)]"
                    onClick={() => setOpen(false)}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button onClick={onSubmit} disabled={isLoading} type="submit" className="flex-1 h-10 rounded-full bg-brand hover:bg-brand-700 text-white font-medium active:bg-brand active:shadow-[0px_0px_0px_4px_rgba(0,115,230,0.20)]">
                    Reset Password
                </Button>
            </div>

        </DialogContent>
    </Dialog>


    );
};

export default ForgotPassword;