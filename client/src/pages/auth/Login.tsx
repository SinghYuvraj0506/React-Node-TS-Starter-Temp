import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginFormSchema } from "@/lib/schemas";
import { LoadingButton } from "@/components/global/Button";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { authActions } from "@/lib/features/authSlice";
import { useEffect } from "react";


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {toast} = useToast()
  const { loading, error } = useAppSelector((state) => state.auth);

    const { loginUser,clearError } = authActions;

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    dispatch(loginUser(values));
  }

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });

      dispatch(clearError());
    }
  }, [error, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white shadow rounded">
        <h1 className="text-xl font-bold mb-4 text-center">Login</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <LoadingButton type="submit" className="w-full" loading={loading} text="Login"/>
          </form>
        </Form>

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/auth/register")}
            className="text-blue-500 hover:underline"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
