import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Órbita — Treino cognitivo',
  description: 'Plano progressivo de treino cognitivo em 26 semanas.',
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
