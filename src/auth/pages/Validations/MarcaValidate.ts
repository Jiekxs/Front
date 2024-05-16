import { create, test, enforce } from 'vest';


export const FormValidation = create((data = {}) => {

     // Validaciones para el nombre
    test('nombreMarca', 'El nombre es requerido', () => {
        enforce(data.nombreMarca).isNotEmpty().isNotBlank();
    });

    test('nombreMarca', 'Minimo 3 caracteres', () => {
        enforce(data.nombreMarca).longerThanOrEquals(3, 'Minimo 3 caracteres');
    });

    
    // Validaciones para la descripcion
    test('descripcionMarca', 'La descripción es requerida', () => {
        enforce(data.descripcionMarca).isNotEmpty().isNotBlank();
    });

    test('descripcion', 'Minimo 3 caracteres', () => {
        enforce(data.descripcionMarca).longerThanOrEquals(3, 'Minimo 3 caracteres');
    });


});

