import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "@/graphQL/graphql";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

type FormData = yup.InferType<typeof loginSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
  });

  const navigate = useNavigate();
  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  const onSubmit = async (formData: FormData) => {
    try {
      const { data } = await login({
        variables: {
          email: formData.email,
          password: formData.password,
        },
      });

      if (data?.login) {
        console.log("Login Data:", data);
        localStorage.setItem("access_token", data.login.accessToken);
        localStorage.setItem("refresh_token", data.login.refreshToken);

        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-96 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-5xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input placeholder="Email" {...register("email")} />
              <p className="text-red-500 text-sm">{errors.email?.message}</p>
            </div>

            <div>
              <Input
                placeholder="Password"
                type="password"
                {...register("password")}
              />
              <p className="text-red-500 text-sm">{errors.password?.message}</p>
            </div>

            <Button
              disabled={loading}
              type="submit"
              className="w-full bg-black text-white"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
