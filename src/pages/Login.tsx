
import AuthForm from "@/components/auth/AuthForm";
import { Logo } from "@/components/shared/Logo";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-docubox-gray-light">
      <AuthForm />
      <div className="mt-8">
        <Logo />
      </div>
    </div>
  );
}
