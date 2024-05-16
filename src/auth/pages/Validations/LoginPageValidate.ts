import {create, test, enforce} from 'vest';

export const FormValidation = create((data = {}) => {

    test('username','El nombre es requerido', ()=>{
        enforce(data.username).isNotEmpty();
    });

    test('username','El nombre minimo 3 caracteres', ()=>{
        enforce(data.username).longerThanOrEquals(3);
    });

    test('password','La contraseña es requerido', ()=>{
        enforce(data.password).isNotEmpty();
    });

    test('password','La contraseña minimo 4 caracteres', ()=>{
        enforce(data.password).longerThanOrEquals(4);
    });

})