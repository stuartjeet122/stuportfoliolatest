// components/RequireAuth.js
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const RequireAuth = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redirect to home page if not authenticated
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>; // Or a custom loading spinner
  }

  // Render the children only if authenticated
  return session ? children : null;
};

export default RequireAuth;
