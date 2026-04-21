import "./globals.css";

export const metadata = {
  title: "Extractor de Transcripciones | YouTube",
  description: "Extrae transcripciones completas de videos de YouTube usando Apify.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
