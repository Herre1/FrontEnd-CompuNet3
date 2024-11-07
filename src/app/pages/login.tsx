// pages/login.tsx
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { LoginData, loginUser } from '@/app/services/auth.service';

const Login: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginData>();
    const [message, setMessage] = useState<string>('');
    const router = useRouter();

    const onSubmit: SubmitHandler<LoginData> = async (data) => {
        try {
            const response = await loginUser(data);
            setMessage('Login successful');
            localStorage.setItem('token', response.data.token);
            router.push('/'); 
        } catch (error) {
            setMessage('Login failed');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register('email', { required: true })} placeholder="Email" />
                {errors.email && <p>Email is required</p>}

                <input {...register('password', { required: true })} type="password" placeholder="Password" />
                {errors.password && <p>Password is required</p>}

                <button type="submit">Login</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default Login;