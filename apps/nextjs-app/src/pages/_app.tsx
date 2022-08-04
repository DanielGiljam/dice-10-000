import { AppProps } from 'next/app';
import Head from 'next/head';

import './styles.css';

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>Dice 10 000</title>
    </Head>
    <Component {...pageProps} />
  </>
);

export default App;
