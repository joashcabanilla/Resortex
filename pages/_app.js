import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Resortex</title>
        <link rel="icon" href="/logo/resortex_01.png" />
      </Head>
      <Component {...pageProps} />
    </>

  )
}

export default MyApp
