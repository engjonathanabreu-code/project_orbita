import type { Metadata } from 'next';
import './globals.css';
import './device.css';

export const metadata: Metadata = {
  title: 'Órbita — Treino cognitivo',
  description: 'Temporada cognitiva progressiva de 26 semanas, com sessões de 20 minutos.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
