import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLoggedUserName, logout } from '../services/UserProfilesService';
import DropDownButton from './DropDownButton';

export default function Navbar() {
    const [userName, setUserName] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

    async function goToProfile() {
        router.push('/pages/profile');
    }

    async function goToHome() {
        router.push('/pages/home');
    }
    
    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md mb-4 text-gray-900 dark:text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-800 dark:text-white cursor-pointer" onClick={goToHome}>FinanzZZ</span>
                    </div>
                    <DropDownButton text={userName} body={<>
                        <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
                            onClick={() => { goToProfile() }}>
                            Perfil
                        </button>
                        <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
                            onClick={() => {
                                logoutF();
                            }}>
                            Cerrar sesión
                        </button>
                    </>} />

                </div>
            </div>
        </nav>
    )
}