import { ReactNode } from 'react';
import { Footer } from "@/components/shared/Footer"
import { Header } from "@/components/shared/Header"

export const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <header>
                <Header/>
            </header>
            <main className='container'>
                {children}
            </main>
            <footer>
                <Footer/>
            </footer>
        </>
    )
}