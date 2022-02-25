import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import '../styles/globals.css'
import '../styles/home.css'
import Head from 'next/head'
import { Provider } from 'react-redux'
import store from '../redux/configureStore'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <Head>
          <title>Resortex</title>
          <link rel="icon" href="/logo/resortex_01.png" />
        </Head>
        <Component {...pageProps} />
      </Provider>
    </>
  )
}

export default MyApp
