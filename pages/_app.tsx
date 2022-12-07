import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from './interface/hooks/useUser'
import { ColorModeProvider } from './interface/hooks/useColorMode';
import { TabBar } from './interface';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ColorModeProvider>
        <TabBar />
        <Component {...pageProps} />
      </ColorModeProvider>
    </UserProvider>
  );
}
