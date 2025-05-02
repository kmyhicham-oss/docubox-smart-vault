
import AuthForm from "@/components/auth/AuthForm";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-docubox-gray-light">
      <AuthForm />
      <div className="mt-8 text-sm text-gray-500">
        <p className="italic font-medium">K.MyHicham</p>
      </div>
    </div>
  );
}
