import { create, test, enforce } from 'vest';


export const FormValidation = create((data = {}) => {

     // Validaciones para el nombre
    test('nombre', 'El nombre es requerido', () => {
        enforce(data.nombre).isNotEmpty().isNotBlank();
    });

    test('nombre', 'Minimo 3 caracteres', () => {
        enforce(data.nombre).longerThanOrEquals(3, 'Minimo 3 caracteres');
    });

    
    // Validaciones para la descripcion
    test('descripcion', 'La descripción es requerida', () => {
        enforce(data.descripcion).isNotEmpty().isNotBlank();
    });

    test('descripcion', 'Minimo 3 caracteres', () => {
        enforce(data.descripcion).longerThanOrEquals(3, 'Minimo 3 caracteres');
    });

    test('precio', 'Error en el formato', () => {
        enforce(data.precio).matches(/^\d+(\.\d{1,2})?$/);
    });

    test('idModelo', 'Por favor selecciona un modelo', () => {
        enforce(data.idModelo).isNull;
    });

    test('stock', 'Solo numeros', () => {
        enforce(data.stock).matches(/^[0-9]+$/);
    });
});

