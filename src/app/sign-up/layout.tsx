
import Template from "@/components/share/authentication/template";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up | Vloggly",
};
const SignUpLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Template>
                <Suspense>
                    <div className="min-h-[598px] sm:min-h-auto relative -top-22 sm:top-0">
                        {children}
                    </div>
                </Suspense>
            </Template>
        </div>
    );
};

export default SignUpLayout;