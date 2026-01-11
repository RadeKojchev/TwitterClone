import type { Metadata } from "next";
import Sidebar from '../src/components/Sidebar';
import { ThemeProvider } from '../src/components/ThemeProvider'; 
import "./globals.css";

export const metadata: Metadata = {
  title: "Twitter Clone",
  description: "Next.js + NestJS project",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--background)]">
        <ThemeProvider>
          {/* Главниот контејнер */}
          <div className="flex justify-center min-h-screen">
            {/* Го зголемуваме вкупниот max-w за да собере 800px feed + 350px search */}
            <div className="flex w-full max-w-[1400px]">
              
              {/* Sidebar - фиксиран лево (256px) */}
              <aside className="w-64 fixed h-screen border-r border-[var(--border)]">
                <Sidebar />
              </aside>

              {/* Main Feed - Се шири до 800px */}
              <main className="flex-1 ml-64 border-r border-[var(--border)] min-h-screen max-w-[800px]">
                {children}
              </main>

              {/* Десен дел - Празен контејнер кој служи само за баланс на просторот */}
              <aside className="hidden lg:block w-[350px] ml-8">
                {/* Содржината за Search ќе ја ставиме директно во page.tsx за полесна логика */}
              </aside>
              
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}