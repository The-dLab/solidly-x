import Head from 'next/head'
import classes from './layout.module.css'
import Header from '../header'
import SnackbarController from '../snackbar'
import Footer from '../footer'
import AsideMenu from '../asideMenu'

export default function Layout({ children, configure, backClicked, changeTheme, title }) {
  return (
    <div className={classes.container}>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <link rel="preload" href="/fonts/Inter/Inter-Regular.ttf" as="font" crossOrigin="" />
        <link rel="preload" href="/fonts/Inter/Inter-Bold.ttf" as="font" crossOrigin="" />
        <meta
          name="description"
          content="Solidly allows low cost, near 0 slippage trades on uncorrelated or tightly correlated assets built on Fantom."
        />
        <meta name="og:title" content="Solidly-X" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className={classes.content}>
        {!configure && <Header backClicked={backClicked} changeTheme={changeTheme} title={title} />}
        <SnackbarController />
        {/* //sidebar */}
        <div className={classes.mainBody}>
          <div className={classes.aside}>
            <AsideMenu />
          </div>
          <main style={{ flex: 1, maxHeight: '90vh', overflowY: 'scroll' }}>{children}</main>
        </div>
        <Footer />
      </div>
    </div>
  )
}
