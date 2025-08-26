'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function NotFoundPage() {

    const router = useRouter();
    const [count, setCount] = useState(0);
    const maxCount = 404;
    const animationSpeed = 2;

    // Efecto para la animación del contador
    useEffect(() => {
        //animacion del contador
        const interval = setInterval(() => {
            // Aumentar el contador
            setCount((prev) => {
                // Detener la animación si se alcanza el máximo
                if (prev + animationSpeed >= maxCount) {
                    // Reiniciar el contador
                    clearInterval(interval);
                    // Detener la animación
                    return maxCount;
                }
                // Continuar la animación
                return prev + animationSpeed;
            });
        }, 1);
        // Limpiar el intervalo al desmontar el componente
        return () => clearInterval(interval);
    }, []);

    // Volver a la página de inicio
    function backToHome() {
        router.push('/pages/home');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 text-white p-6">
            <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r  from-red-500 to-purple-600 animate-pulse">
                {count}
            </h1>

            <h2 className="mt-4 text-3xl font-bold">La pagina buscada no ha sido encontrada</h2>
            <p className="mt-2 text-gray-400 max-w-md  text-center">
                Lo sentimos, pero no hemos podido encontrar la página que estabas buscando.
            </p>

            <button onClick={backToHome} className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded">
                Volver a la página de inicio
            </button>
        </div>
    );

}


