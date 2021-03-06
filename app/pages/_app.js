import "../styles/globals.css";
import { ThemeProvider, CSSReset, ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { Fonts } from "../theme/fonts";
import DataProvider from "../components/providers/DataProvider";
import CustomLayout from "../components/CustomLayout";
import "antd/dist/antd.css"
import Prism from 'prismjs'
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/plugins/unescaped-markup/prism-unescaped-markup.min.js";


function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <CSSReset />
      <DataProvider>
        <CustomLayout>
          <Component {...pageProps} />
        </CustomLayout>
      </DataProvider>
    </ChakraProvider>
  );
}

export default MyApp;
