import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Root = async () => {
  const accessToken = (await cookies()).get("accessToken");
  const refreshToken = (await cookies()).get("refreshToken");

  if (!accessToken || !refreshToken) {
    redirect("/sign-in");
  }

  redirect("/home");
};

export default Root;
