import { Button } from "@/components/ui/button";
import { FingerPrintIcon, GoogleIcon, NewTwitterIcon } from "hugeicons-react";

const LoginOptions = ({ legendText = "OR", extra = <></> }) => {
    return (
        <div>
            <div className="my-6 flex items-center gap-2">
                <div className="h-px flex-1 bg-[#dcdcdc]"></div>
                <span className="text-sm text-gray-500">{legendText} {extra}</span>
                <div className="h-px flex-1 bg-[#dcdcdc]"></div>
            </div>

            <div className="space-y-4">
                <Button
                    type="button"
                    variant="outline"
                    className="flex h-10 font-medium gap-1.5 w-full items-center justify-center rounded-full border border-[#dcdcdc] bg-white text-neutral-900 hover:bg-gray-50"
                >
                    <NewTwitterIcon className="h-5 w-5" />
                    Sign In With X
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className="flex h-10 font-medium gap-1.5 w-full items-center justify-center rounded-full border border-[#dcdcdc] bg-white text-neutral-900 hover:bg-gray-50"
                >
                    <GoogleIcon className="h-5 w-5" />
                    Sign In With Google
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className="flex h-10 font-medium gap-1.5 w-full items-center justify-center rounded-full border border-[#dcdcdc] bg-white text-neutral-900 hover:bg-gray-50"
                >
                    <FingerPrintIcon className="h-5 w-5" />
                    Password Less Sign In
                </Button>
            </div>
        </div>
    );
};

export default LoginOptions;