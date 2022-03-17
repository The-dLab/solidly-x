import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { Typography, Switch } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { withTheme, withStyles } from '@material-ui/core/styles'
import Image from 'next/image'
import SSWarning from '../ssWarning'

import classes from './navigation.module.css'

function SiteLogo() {
  return <Image src="/images/logo.png" alt="" width="230" height="50" />
}

const StyledSwitch = withStyles((theme) => ({
  root: {
    width: 58,
    height: 32,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(28px)',
      color: '#212529',
      '& + $track': {
        backgroundColor: '#ffffff',
        opacity: 1,
      },
    },
    '&$focusVisible $thumb': {
      color: '#ffffff',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 32 / 2,
    border: `1px solid #212529`,
    backgroundColor: '#212529',
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  )
})

function Navigation(props) {
  const router = useRouter()

  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('swap')

  function handleNavigate(route) {
    router.push(route)
  }

  const [warningOpen, setWarningOpen] = useState(false)

  useEffect(function () {
    const localStorageWarningAccepted = window.localStorage.getItem('fixed.forex-warning-accepted')
    setWarningOpen(localStorageWarningAccepted ? localStorageWarningAccepted !== 'accepted' : true)
  }, [])

  const openWarning = () => {
    setWarningOpen(true)
  }

  const closeWarning = () => {
    window.localStorage.setItem('fixed.forex-warning-accepted', 'accepted')
    setWarningOpen(false)
  }

  const onActiveClick = (event, val) => {
    if (val) {
      if (val.slice(0, 4) === 'http') return
      setActive(val)
      handleNavigate('/' + val)
    }
  }

  useEffect(() => {
    const activePath = router.asPath
    if (activePath.includes('swap')) {
      setActive('swap')
    }
    if (activePath.includes('liquidity')) {
      setActive('liquidity')
    }
    if (activePath.includes('vest')) {
      setActive('vest')
    }
    if (activePath.includes('vote')) {
      setActive('vote')
    }
    if (activePath.includes('bribe')) {
      setActive('bribe')
    }
    if (activePath.includes('rewards')) {
      setActive('rewards')
    }
    if (activePath.includes('dashboard')) {
      setActive('dashboard')
    }
    if (activePath.includes('whitelist')) {
      setActive('whitelist')
    }
  }, [])

  const renderNavs = () => {
    return (
      <ToggleButtonGroup value={active} exclusive onChange={onActiveClick} className={classes.navToggles}>
        {renderSubNav('Swap', 'swap')}
        {renderSubNav('Liquidity', 'liquidity')}
        {renderSubNav('Vest', 'vest')}
        {renderSubNav('Bribe', 'bribe')}
        {renderSubNav('Vote', 'vote')}
        {renderSubNav('Rewards', 'rewards')}
        {renderSubNav('Whitelist', 'whitelist')}
        {/* {renderSubNavWithIcon('/socials/telegram.svg', 'https://t.me/')}
        {renderSubNavWithIcon('/socials/twitter.svg', 'https://twitter.com/')} */}
      </ToggleButtonGroup>
    )
  }

  const renderSectionHeader = (title) => {
    return (
      <div className={classes.navigationOptionContainer}>
        <div className={classes.navigationOptionNotSelected}></div>
        <Typography variant="h2" className={classes.sectionText}>
          {title}
        </Typography>
      </div>
    )
  }

  const renderSubNav = (title, link) => {
    return (
      <ToggleButton value={link} className={classes.navButton} classes={{ selected: classes.testChange }}>
        <Typography variant="h2" className={classes.subtitleText}>
          {title}
        </Typography>
      </ToggleButton>
    )
  }

  const renderSubNavWithExternalLink = (title, link) => {
    return (
      <ToggleButton
        href={link}
        value={link}
        target="_blank"
        rel="noopener noreferrer"
        className={classes.navButton}
        classes={{ selected: classes.testChange }}
      >
        <Typography variant="h2" className={classes.subtitleText}>
          {title}
        </Typography>
      </ToggleButton>
    )
  }

  const renderSubNavWithIcon = (icon, link) => {
    return (
      <ToggleButton
        href={link}
        value={link}
        target="_blank"
        className={classes.navButton}
        style={{ display: 'flex', alignItems: 'center', lineHeight: '1' }}
        classes={{ selected: classes.testChange }}
      >
        <Typography variant="h2" className={classes.subtitleText} style={{ lineHeight: '1' }}>
          <Image width={'20px'} height={'20px'} src={icon} alt="deus" />
        </Typography>
      </ToggleButton>
    )
  }

  return (
    <div className={classes.navigationContainer}>
      {/* <div className={classes.navigationHeading}>
        <a onClick={() => router.push('/home')} className={classes.linkz}>
          <SiteLogo className={classes.appLogo} />
        </a>
      </div> */}

      <div className={classes.navigationContent}>{renderNavs()}</div>

      {warningOpen && <SSWarning close={closeWarning} />}
    </div>
  )
}

export default withTheme(Navigation)
