import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLoggedUserName, logout } from '../services/UserProfilesService';

export default function Navbar() {
    const [userName, setUserName] = useState("");
    const router = useRouter();

    useEffect(() => {
        getUser();
    }, []);

    async function getUser() {
        const name = await getLoggedUserName();

        if (name) {
            setUserName(name);
        }
    }

    async function logoutF() {
        const error = await logout();

        if (error) {
            console.error(error);
            return;
        }

        router.push('/pages/login');
    }

    return (
        <>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
                <div className="container">
                    <span className="navbar-brand fw-bold">FinanzZZ</span>
                    <ul className="navbar-nav">
                        <li className="nav-item dropdown">
                            <button className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                {userName}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-dark">
                                <li><button className="dropdown-item">Perfil</button></li>
                                <li><button className="dropdown-item" onClick={logoutF}>Cerrar sesión</button></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}