import { create, test, enforce } from 'vest';

export const FormValidation = create((data = {}) => {
    test('nombre', 'El nombre es requerido', () => {
        enforce(data.nombre).isNotEmpty().isNotBlank();
    });

    test('nombre', 'No debe contener espacios', () => {
        enforce(data.nombre.trim()).equals(data.nombre, 'No debe contener espacios');
    });

    test('nombre', 'No debe contener números', () => {
        enforce(data.nombre).matches(/^[A-Za-z]+$/, 'No debe contener números');
    });

    test('nombre', 'Minimo 3 caracteres', () => {
        enforce(data.nombre).longerThanOrEquals(3, 'Minimo 3 caracteres');
    });


    test('apellido', 'El apellido es requerido', () => {
        enforce(data.apellido).isNotEmpty().isNotBlank();
    });

    test('apellido', 'No debe contener espacios', () => {
        enforce(data.apellido.trim()).equals(data.apellido, 'No debe contener espacios');
    });

    test('apellido', 'No debe contener números', () => {
        enforce(data.apellido).matches(/^[A-Za-z]+$/, 'No debe contener números');
    });

    test('apellido', 'Minimo 3 caracteres', () => {
        enforce(data.apellido).longerThanOrEquals(3, 'Minimo 3 caracteres');
    });


    //Email
    test('email', 'El correo electrónico es requerido', () => {
        enforce(data.email).isNotEmpty().isNotBlank();
    });
    
    test('email', 'Formato de correo electrónico inválido', () => {
        enforce(data.email).matches(/^\S+@\S+\.\S+$/, 'Formato de correo electrónico inválido');
    });


    //Telefono
    test('telefono', 'El telefono es requerido', () => {
        enforce(data.telefono).isNotEmpty().isNotBlank();
    });

    test('telefono', 'No debe contener letras', () => {
        enforce(data.telefono).matches(/^[0-9]+$/, 'No debe contener letras');
    });

    test('telefono', 'Minimo 9 caracteres', () => {
        enforce(data.telefono).longerThanOrEquals(9, 'Minimo 9 caracteres');
    });

    test('telefono', 'Máximo 9 caracteres', () => {
        enforce(data.telefono).shorterThanOrEquals(9, 'Máximo 9 caractres');
    });

    //Fecha
    test('fechaNacimiento', 'Formato YYYY-MM-DD', () => {
        enforce(data.fechaNacimiento).matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD');
    });

     //Sexo
    test('genero', 'Válido: Hombre / Mujer', () => {
        const generoInput = data.genero.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase());
        enforce(generoInput).matches(/^(Hombre|Mujer)$/, 'Válido: Hombre / Mujer');
    });
    


    // test('contrasena', 'La contraseña es requerida', () => {
    //     enforce(data.contrasena).isNotEmpty();
    // });

    // test('contrasena', 'No puede tener espacios en blanco', () => {
    //     enforce(data.contrasena).isNotBlank();
    // });

    // test('contrasena', 'Debe tener al menos 8 caracteres', () => {
    //     enforce(data.contrasena).longerThanOrEquals(8, 'Debe tener al menos 8 caracteres');
    // });
});
