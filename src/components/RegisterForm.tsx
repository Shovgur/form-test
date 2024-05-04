import { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';
import DatePicker from 'react-datepicker';
import { zodResolver } from '@hookform/resolvers/zod';
import 'react-datepicker/dist/react-datepicker.css';

// Define the form schema using zod
const formSchema = z.object({
  username: z.string().min(1, 'Username is required').min(4, 'Username should be more than 3 symbols'),
  dateOfBirth: z.date()
  .or(z.undefined()) // Allow undefined to initially have no value
  .superRefine((date, ctx) => {
    if (date === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Date of birth is required",
      });
    } else if (date > new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Date of birth cannot be in the future",
      });
    }
  }),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least 1 number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least 1 special symbol character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], // This ensures the error is shown under the confirmPassword field
});

type FormData = z.infer<typeof formSchema>;

export const RegistrationForm = () => {
  const [visibilityPwd, setVisibilityPwd] = useState(false);
  const [visibilityConfirm, setVisibilityConfirm] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const { control, register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateOfBirth: undefined,
    }
  });

  const onSubmit: SubmitHandler<FormData> = (data, event) => {
    event?.preventDefault();
    if (confirm) {
      alert(JSON.stringify(data));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-[375px] ml-auto mr-auto px-4 pt-[44px] pb-[64px]">
      <div className="text-[28px] text-start font-semibold leading-[33px] mb-4">Let’s get you started</div>
      <div className="text-[16px] text-start font-normal leading-[24px] mb-6">
        <span>Already have account? </span>
        <a className="text-[#0070F3] font-medium" href="/login">Login</a>
      </div>
      <div className="space-y-6">
        <div>
          <label htmlFor="username" className="leading-[24px] block text-[16px] font-normal text-start mb-2">Username</label>
          <input
            id="username"
            type="text"
            {...register('username')}
            className="input border-[1px] border-solid border-[#C2C3C4] rounded-[8px] h-[48px] w-full px-4 placeholder-[#7A7D80] placeholder:font-medium"
            placeholder="Enter username"
          />
          <p className="text-[14px] font-normal leading-[20px] text-[#A52A2A] text-start mt-2">{errors.username?.message}</p>
        </div>

        <div className="[&>.react-datepicker-wrapper]:w-full">
          <label htmlFor="dateOfBirth" className="leading-[24px] block text-[16px] font-normal text-start mb-2">Date of Birth</label>
          <Controller
            name="dateOfBirth"
            control={control}
            rules={{ required: 'Date of birth is required' }}
            render={({ field }) => (
              <DatePicker
                placeholderText="DD / MM / YYYY"
                onChange={(date) => field.onChange(date)}
                selected={field.value}
                dateFormat="dd/MM/yyyy"
                className="input border-[1px] border-solid border-[#C2C3C4] rounded-[8px] h-[48px] w-full px-4 placeholder-[#7A7D80] placeholder:font-medium"
              />
            )}
          />
          <p className="text-[14px] font-normal leading-[20px] text-[#A52A2A] text-start mt-2">{errors.dateOfBirth?.message}</p>
        </div>

        <div>
          <label htmlFor="email" className="leading-[24px] block text-[16px] font-normal text-start mb-2">Email Address</label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="input border-[1px] border-solid border-[#C2C3C4] rounded-[8px] h-[48px] w-full px-4 placeholder-[#7A7D80] placeholder:font-medium"
            placeholder="Enter email address"
          />
          <p className="text-[14px] font-normal leading-[20px] text-[#A52A2A] text-start mt-2">{errors.email?.message}</p>
        </div>

        <div>
          <label htmlFor="password" className="leading-[24px] block text-[16px] font-normal text-start mb-2">Password</label>
          <div className="relative">
            <input
              id="password"
              type={!visibilityPwd ? "password" : "text"}
              {...register('password')}
              className="input border-[1px] border-solid border-[#C2C3C4] rounded-[8px] h-[48px] w-full px-4 placeholder-[#7A7D80] placeholder:font-medium"
              placeholder="Enter password"
            />
            <img
              className="absolute top-[13px] right-[13px] cursor-pointer"
              alt="eye-icon"
              src="/eye.svg"
              onClick={() => setVisibilityPwd(prev => !prev)}
            />
          </div>
          <p className="text-[14px] font-normal leading-[20px] text-[#393D41] text-start mt-2">
            Password should contain at least 8 characters, 1 special symbol character, 1 number, 1 uppercase letter
          </p>
          <p className="text-[14px] font-normal leading-[20px] text-[#A52A2A] text-start mt-2">{errors.password?.message}</p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="leading-[24px] block text-[16px] font-normal text-start mb-2">Confirm Password</label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={!visibilityConfirm ? "password" : "text"}
              {...register('confirmPassword')}
              className="input border-[1px] border-solid border-[#C2C3C4] rounded-[8px] h-[48px] w-full px-4 placeholder-[#7A7D80] placeholder:font-medium"
              placeholder="Confirm password"
            />
            <img
              className="absolute top-[13px] right-[13px] cursor-pointer"
              alt="eye-icon"
              src="/eye.svg"
              onClick={() => setVisibilityConfirm(prev => !prev)}
            />
          </div>
          <p className="text-[14px] font-normal leading-[20px] text-[#A52A2A] text-start mt-2">{errors.confirmPassword?.message}</p>
        </div>

        <div className="flex items-center cursor-pointer" onClick={() => setConfirm(prev => !prev)}>
          <div className="border-solid border-[1px] border-[#C2C3C4] rounded-[4px] w-[24px] h-[24px] shrink-0 flex justify-center items-center">
            {confirm ?
              <div className="bg-[#549FF7] border-solid rounded-[4px] w-[16px] h-[16px]"></div>
            : ""}
          </div>
          <div className="ml-[16px] text-start text-[16px] font-normal leading-[24px]">
            I agree to the <a className="text-[#0070F3] underline" href="/toc">Terms and Conditions</a> and <a className="text-[#0070F3] underline" href="/privacy-policy">Privacy Policy</a> of this app.
          </div>
        </div>
      </div>

      <button type="submit" className="bg-[#549FF7] h-[48px] w-full rounded-[8px] text-white text-[16px] font-medium mt-[90px]">
        Create Account
      </button>
    </form>
  );
}