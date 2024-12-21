import React from 'react'

export default function Navbar() {
    return (
        <>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
                <div className="container">
                    <span className="navbar-brand fw-bold">FinanzZZ</span>
                    <ul className="navbar-nav">
                        <li className="nav-item dropdown">
                            <button className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                Nombre de usuario
                            </button>
                            <ul className="dropdown-menu dropdown-menu-dark">
                                <li><button className="dropdown-item">Perfil</button></li>
                                <li><button className="dropdown-item">Cerrar sesión</button></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}