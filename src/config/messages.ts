/**
 * Copys centralizados de autenticación (Login/Register) y mensajes
 * genéricos de UI. Ningún componente debe tener un string de validación o
 * error hardcodeado — todo pasa por aquí, para que un cambio de tono o de
 * redacción se haga en un solo lugar.
 */

export const authMessages = {
  login: {
    title: "Bienvenido de nuevo",
    subtitle: "Ingresa con tu cuenta para ver tus cuentas claras.",
    submit: "Iniciar sesión",
    submitLoading: "Ingresando...",
    switchPrompt: "¿No tienes cuenta?",
    switchAction: "Crear una cuenta",
  },
  register: {
    title: "Crea tu cuenta",
    subtitle: "Tu dinero, más claro. Empieza en menos de un minuto.",
    submit: "Crear cuenta",
    submitLoading: "Creando cuenta...",
    switchPrompt: "¿Ya tienes cuenta?",
    switchAction: "Iniciar sesión",
  },
  fields: {
    nombre: {
      label: "Nombre",
      placeholder: "Anderson",
      description: "Se usa como nombre de tu primer titular.",
    },
    email: {
      label: "Correo",
      placeholder: "tu@correo.com",
    },
    password: {
      label: "Contraseña",
      placeholder: "••••••••",
      toggleShow: "Mostrar contraseña",
      toggleHide: "Ocultar contraseña",
    },
  },
  security: {
    title: "Tus datos, aislados por titular",
    description:
      "Cada titular ve solo su propia información financiera, protegida a nivel de base de datos (row-level security) desde el primer registro.",
  },
  notices: {
    checkEmail: "Cuenta creada. Revisa tu correo para confirmarla antes de iniciar sesión.",
  },
} as const;

export const validationMessages = {
  nombre: {
    required: "Ingresa tu nombre.",
    min: "El nombre debe tener al menos 2 caracteres.",
  },
  email: {
    required: "Ingresa tu correo.",
    invalid: "Ingresa un correo válido.",
  },
  password: {
    required: "Ingresa tu contraseña.",
    min: "La contraseña debe tener al menos 6 caracteres.",
  },
} as const;

export const genericMessages = {
  unexpectedError: "Ocurrió un error inesperado. Intenta de nuevo.",
} as const;
