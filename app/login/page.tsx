import Link from "next/link";
import { LoginForm } from "../../components/auth/login-form";

export const metadata = {
  title: "Log in | RecipeShare",
  description: "Log in to your RecipeShare account",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-12">
      <div className="w-full space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-zinc-900">Welcome back</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Log in to your RecipeShare account
          </p>
        </div>

        <LoginForm />

        <div className="text-center text-sm text-zinc-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-orange-600 hover:text-orange-700"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

