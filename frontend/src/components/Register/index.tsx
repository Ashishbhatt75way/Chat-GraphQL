import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@apollo/client";
import { SIGNUP_MUTATION } from "@/graphQL/graphql";
import { toast } from "sonner"; // Uncommented for toast notifications
import { useNavigate } from "react-router-dom";

// Define the validation schema using Yup
const signupSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// Infer the TypeScript type from the schema
type FormData = yup.InferType<typeof signupSchema>;

const SignUp = () => {
  // Use GraphQL Mutation
  const [signup, { loading }] = useMutation(SIGNUP_MUTATION);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await signup({
        variables: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      });

      if (response.data?.createUser) {
        toast.success("Signup successful! Please log in.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-96 mx-auto">
        <CardHeader>
          <CardTitle className="text-6xl text-center font-bold">
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input placeholder="Name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}

            <Input placeholder="Email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <Input
              placeholder="Password"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-black text-white"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
