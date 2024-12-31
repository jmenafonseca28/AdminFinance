
import "./globals.css";
//import "bootstrap/dist/css/bootstrap.min.css";
import BootstrapClient from "./components/BootstrapClient";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Finanzas</title>
      </head>
      <body >

        {children}
      </body>

      <BootstrapClient />
    </html>
  );
}
