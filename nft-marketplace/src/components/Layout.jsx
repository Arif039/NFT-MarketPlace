import Header from "./Header";

export default function ({children}) {
    return (
        <div>
            <Header/>

            <main className="container mx-auto p-4"> {children} </main>
        </div>
    )
}