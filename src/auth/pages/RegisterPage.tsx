import { useState } from 'react';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useForm, Controller } from 'react-hook-form';
import { vestResolver } from '@hookform/resolvers/vest';
import { FormValidation } from './Validations/RegisterPageValidate';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [error, setError] = useState<string | Error | null>(null);
    const [registered, setRegistered] = useState<boolean>(false);
    const navigate = useNavigate(); // Obtiene la función navigate

    const { handleSubmit, formState, control } = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
        resolver: vestResolver(FormValidation)
    });

    const handleRegister = async (data: any) => {
        try {
            console.log('Datos de registro:', data);
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log('Registro exitoso');
                setRegistered(true);
                navigate('/'); // Redirige al usuario a la página de inicio
            } else {
                const responseData = await response.json();
                setError(responseData.message || 'Error al registrar');
                console.log('Error al registrar');
            }
        } catch (error) {
            console.error('Error al registrar:', error);
            setError('Error al registrar');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '90vh' }}>
            <h1 style={{ marginBottom: '20px' }}>REGISTRO</h1>
            {registered && <h3>Registro exitoso</h3>}
            <form onSubmit={handleSubmit(handleRegister)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Controller
                    name="nombre"
                    defaultValue=""
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="name-input"
                            label="Nombre"
                            variant="outlined"
                            style={{ marginBottom: '10px', width: '300px' }}
                            error={formState.errors?.nombre ? true : false}
                            helperText={(formState.errors?.nombre?.message as string) ?? ''}
                            size="small"
                        />
                    )}
                />
                <Controller
                    name="apellido"
                    defaultValue=""
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="surname-input"
                            label="Apellidos"
                            variant="outlined"
                            style={{ marginBottom: '10px', width: '300px' }}
                            error={formState.errors?.apellido ? true : false}
                            helperText={(formState.errors?.apellido?.message as string) ?? ''}
                            size="small"
                        />
                    )}
                />
                <Controller
                    name="email"
                    defaultValue=""
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="email-input"
                            label="Email"
                            variant="outlined"
                            style={{ marginBottom: '10px', width: '300px' }}
                            error={formState.errors?.email ? true : false}
                            helperText={(formState.errors?.email?.message as string) ?? ''}
                            size="small"
                        />
                    )}
                />
                <Controller
                    name="contrasena"
                    defaultValue=""
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="password-input"
                            label="Password"
                            variant="outlined"
                            style={{ marginBottom: '10px', width: '300px' }}
                            type="password"
                            error={formState.errors?.contrasena ? true : false}
                            helperText={(formState.errors?.contrasena?.message as string) ?? ''}
                            size="small"
                        />
                    )}
                />
                {error && <p style={{ color: 'red', marginBottom: '10px' }}></p>}
                <Button variant="contained" type="submit" style={{ width: '150px', marginBottom: '10px' }}>
                    Registrarse
                </Button>
            </form>
            <Link to="/" style={{ marginBottom: '10px' }}>
                <Button variant="contained" style={{ width: '200px' }}>Volver al inicio de sesión</Button>
            </Link>
        </div>
    );
};

export default RegisterPage;
