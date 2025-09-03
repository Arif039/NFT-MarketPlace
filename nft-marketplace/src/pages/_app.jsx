import "../app/globals.css";
import Layout from "@/components/Layout";

function MyApp ({Component, pageProps}) {
    <Layout>
        <Component {...pageProps}/>
    </Layout>
}

export default MyApp;