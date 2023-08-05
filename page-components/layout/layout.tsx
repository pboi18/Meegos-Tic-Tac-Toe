import Head from "next/head";
import { GlobalStyle } from "@/styled/theme";
import { Wrapper } from "./layout.styled";


interface LayoutChildren {
  children: React.ReactNode
}


const Layout = ({ children } : LayoutChildren) =>{

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="description" content="Meegos With Friends"/>
        <meta name="keywords" content="Meegos game, tic tac toe" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <title>Tic Tac Toe</title>
      </Head>
      <GlobalStyle />
      <Wrapper>
        { children }
      </Wrapper>
    </>
  );
}


export default Layout;