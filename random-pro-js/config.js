// Configuración global del "editor"
export const AppConfig = {
  theme: "auto", // "light", "dark", "auto" (por ahora lo dejamos disponible)
  effects: {
    tilt: true,
    parallaxMouse: true,
    parallaxScroll: true,
    neonLights: true,
    glassDynamic: true
  }
};

// Función para que tu panel global pueda actualizar la configuración
export function updateConfig(newConfig) {
  Object.assign(AppConfig, {
    ...AppConfig,
    ...newConfig,
    effects: {
      ...AppConfig.effects,
      ...(newConfig.effects || {})
    }
  });

  // Avisar a todos los componentes interesados
  document.dispatchEvent(
    new CustomEvent("app-config-changed", { detail: AppConfig })
  );
}

// Ejemplo (puedes eliminar esto en producción):
// Descomenta para probar desactivar efectos a los 5 segundos
/*
setTimeout(() => {
  updateConfig({
    effects: {
      tilt: false,
      parallaxMouse: false,
      neonLights: false
    }
  });
}, 5000);
*/