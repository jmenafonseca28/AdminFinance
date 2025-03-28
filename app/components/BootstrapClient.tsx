/* "use client";
import { useEffect } from "react";

// Hola, estoy practicando usar comando de git ocupo hacer un cambio tons aqui esta xd

export default function BootstrapClient() {
  useEffect(() => {
    // eslint-disable-next-line 
    import("bootstrap/dist/js/bootstrap.bundle.min.js" as any)
      .then(() => console.log("Bootstrap JS cargado"))
      .catch((err) => console.error("Error al cargar Bootstrap", err));
  }, []);

  return null;
} */

"use client";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    bootstrap: typeof import("bootstrap");
  }
}

export default function BootstrapClient() {
  const [isBootstrapLoaded, setIsBootstrapLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.bootstrap) {
      // eslint-disable-next-line
      import("bootstrap/dist/js/bootstrap.bundle.min.js" as any)
        .then((bootstrap) => {
          window.bootstrap = bootstrap;
          setIsBootstrapLoaded(true);
          console.log("Bootstrap JS cargado");
        })
        .catch((err) => {
          console.error("Error al cargar Bootstrap", err);
        });
    } else {
      setIsBootstrapLoaded(true);
    }
  }, []);

  if (!isBootstrapLoaded) {
    return <p>Cargando Bootstrap...</p>;
  }

  return null;
}
