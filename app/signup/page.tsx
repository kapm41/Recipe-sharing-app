import Link from "next/link";
import { SignupForm } from "../../components/auth/signup-form";

export const metadata = {
  title: "Sign up | RecipeShare",
  description: "Create your RecipeShare account",
};

export default function SignupPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-12">
      <div className="w-full space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-zinc-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Join RecipeShare and start sharing your favorite recipes
          </p>
        </div>

        <SignupForm />

        <div className="text-center text-sm text-zinc-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-orange-600 hover:text-orange-700"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

