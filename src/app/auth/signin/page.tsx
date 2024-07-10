"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface IFormInputs {
  email: string;
  password: string;
  remember: boolean;
}

const SignIn: React.FC = () => {
  const { register, formState: { errors }, handleSubmit, reset } = useForm<
    IFormInputs
  >();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem("token")) {
      router.push("/movies-list");
    }
  }, []);

  const onSubmit: SubmitHandler<IFormInputs> = async data => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/login`,
        {
          email: data.email,
          password: data.password
        },
        {
          headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': origin || '*',
            'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );

      if (response.data.statusCode === 200) {
        localStorage.setItem("token", response.data.token);
        new Promise<void>((resolve) => {
          resolve();
        }).then(() => {
          router.push("/movies-list");
          reset();
        });
      } else {
        setErrorMessage("Form submission failed. " + response.data.message);
      }
    } catch (error:any) {
      const errorMessage = error?.response?.data?.message ?? 'something went wrong';
      if(errorMessage == 'Invalid password') {
        setErrorPassword(errorMessage);
        setErrorMessage('');
      } else {
        setErrorMessage(errorMessage);
        setErrorPassword('');
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:min-w-[300px] w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <input
            id="email"
            placeholder="Email"
            className="bg-[#224957] rounded-[10px] px-4 py-2.5 text-sm text-white font-normal w-full mb-1"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "Invalid email address"
              }
              
            })}
          />
          {errors.email &&
            <p className="text-xs text-red-600 font-medium">
              {errors.email.message}
            </p>}
            {errorMessage &&
               <p className="text-xs text-red-600 font-medium mt-2">
            {errorMessage}
          </p>}
        </div>

        <div className="mb-6">
          <input
            id="password"
             placeholder="Password"
            className="bg-[#224957] rounded-[10px] px-4 py-2.5 text-sm text-white font-normal w-full mb-1"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long"
              }
            })}
          />
          <>
          {errors.password &&
            <p className="text-xs text-red-600 font-medium">
              {errors.password.message}
            </p>}

            {errorPassword &&
               <p className="text-xs text-red-600 font-medium mt-2">
            {errorPassword}
          </p>}
            
          </>
        </div>

        <div className="flex justify-center items-center mb-6">
          <input
            type="checkbox"
            id="remember"
            className="w-[18px] h-[17px] text-blue-600 bg-[#224957] border-[#224957] rounded-[5px] focus:ring-blue-500 me-2"
            {...register("remember")}
          />
          <label htmlFor="remember" className="text-sm font-normal text-white">
            Remember me
          </label>
        </div>
        <button
          type="submit"
          className="bg-[#2BD17E] rounded-[15px] py-[15px] px-7 text-base font-bold leading-6 text-white w-full cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? <span className="loader" /> : "Submit"}
        </button>
        {/* <input type="submit" className="bg-[#2BD17E] rounded-[15px] py-[15px] px-7 text-base font-bold leading-6 text-white w-full cursor-pointer" /> */}
      </form>
      
    </div>
  );
};

export default SignIn;
