// pages/register.tsx
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import { RegisterData, registerUser } from '@/app/services/auth.service';

const Register: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>();
    const [message, setMessage] = useState<string>('');

    const onSubmit: SubmitHandler<RegisterData> = async (data) => {
        try {
            await registerUser(data);
            setMessage('Registration successful');
        } catch (error) {
            setMessage('Registration failed');
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register('username', { required: true })} placeholder="Username" />
                {errors.username && <p>Username is required</p>}

                <input {...register('email', { required: true })} placeholder="Email" />
                {errors.email && <p>Email is required</p>}

                <input {...register('password', { required: true })} type="password" placeholder="Password" />
                {errors.password && <p>Password is required</p>}

                <button type="submit">Register</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default Register;