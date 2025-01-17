import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import Layout from '../components/layout'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { useRouter } from 'next/router'

import darkTheme from '../theme/dark'

import Configure from './configure'

import stores from '../stores/index'

import { ACTIONS } from '../stores/constants'
import '../styles/global.css'

import * as ga from '../lib/ga'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

  const [themeConfig, setThemeConfig] = useState(darkTheme)
  const [stalbeSwapConfigured, setStableSwapConfigured] = useState(false)
  const [accountConfigured, setAccountConfigured] = useState(false)

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  // DONT UN-COMMENT THIS LOL
  const changeTheme = (dark) => {
    // setThemeConfig(dark ? darkTheme : lightTheme)
    // localStorage.setItem('yearn.finance-dark-mode', dark ? 'dark' : 'light')
  }

  const accountConfigureReturned = () => {
    setAccountConfigured(true)
  }

  const stalbeSwapConfigureReturned = () => {
    setStableSwapConfigured(true)
  }

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url)
    }
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on('routeChangeComplete', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  useEffect(function () {
    const localStorageDarkMode = window.localStorage.getItem('yearn.finance-dark-mode')
    changeTheme(localStorageDarkMode ? localStorageDarkMode === 'dark' : false)
  }, [])

  useEffect(function () {
    stores.emitter.on(ACTIONS.CONFIGURED_SS, stalbeSwapConfigureReturned)
    stores.emitter.on(ACTIONS.ACCOUNT_CONFIGURED, accountConfigureReturned)

    stores.dispatcher.dispatch({ type: ACTIONS.CONFIGURE })

    return () => {
      stores.emitter.removeListener(ACTIONS.CONFIGURED_SS, stalbeSwapConfigureReturned)
      stores.emitter.removeListener(ACTIONS.ACCOUNT_CONFIGURED, accountConfigureReturned)
    }
  }, [])

  const validateConfigured = () => {
    switch (router.pathname) {
      case '/':
        return accountConfigured
      default:
        return accountConfigured
    }
  }

  return (
    <React.Fragment>
      <Head>
        <title>Solidly-X</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      {/* <Script defer data-domain="solidly.vision" src="https://plausible.io/js/plausible.js"></Script> */}
      <ThemeProvider theme={themeConfig}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {validateConfigured() && (
          <Layout changeTheme={changeTheme}>
            <Component {...pageProps} changeTheme={changeTheme} />
          </Layout>
        )}
        {!validateConfigured() && <Configure {...pageProps} />}
      </ThemeProvider>
    </React.Fragment>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
}
