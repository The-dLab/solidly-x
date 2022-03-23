import classes from './asideMenu.module.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRightArrowLeft,
  faRotate,
  faClockRotateLeft,
  faCheckToSlot,
  faBriefcase,
  faArrowsSpin,
  faList,
  faArrowsUpDown,
  faMoneyBill1,
  faTableList,
} from '@fortawesome/free-solid-svg-icons'

import { Typography } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'

function AsideMenu() {
  const router = useRouter()
  const [active, setActive] = useState('swap')

  function handleNavigate(route) {
    router.push(route)
  }

  // const [warningOpen, setWarningOpen] = useState(false)

  // useEffect(function () {
  //   const localStorageWarningAccepted = window.localStorage.getItem('fixed.forex-warning-accepted')
  //   setWarningOpen(localStorageWarningAccepted ? localStorageWarningAccepted !== 'accepted' : true)
  // }, [])

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
    if (activePath.includes('chainlist')) {
      setActive('chainlist')
    }
  }, [])

  const renderSubNav = (title, link, icon, disabled) => {
    return (
      <ToggleButton
        value={link}
        className={disabled ? classes.navButtonDisable : classes.navButton}
        classes={{ selected: classes.testChange }}
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          paddingLeft: '60px',
        }}
        disabled={disabled}
      >
        {icon ? (
          <FontAwesomeIcon
            icon={icon}
            style={{
              marginRight: '8px',
            }}
          />
        ) : null}
        <Typography variant="h2" className={classes.subtitleText}>
          {title}
        </Typography>
      </ToggleButton>
    )
  }

  const renderNavs = () => {
    return (
      <ToggleButtonGroup
        orientation="vertical"
        value={active}
        exclusive
        onChange={onActiveClick}
        className={classes.navToggles}
      >
        {renderSubNav('Swap', 'swap', faArrowRightArrowLeft)}
        {renderSubNav('Liquidity', 'liquidity', faRotate)}
        {renderSubNav('Vest', 'vest', faClockRotateLeft)}
        {renderSubNav('Bribe', 'bribe', faBriefcase)}
        {renderSubNav('Vote', 'vote', faCheckToSlot)}
        {renderSubNav('Rewards', 'rewards', faMoneyBill1)}
        {renderSubNav('Whitelist', 'whitelist', faTableList)}
      </ToggleButtonGroup>
    )
  }

  const renderTools = () => {
    return (
      <ToggleButtonGroup
        orientation="vertical"
        value={active}
        exclusive
        onChange={onActiveClick}
        className={classes.navToggles}
      >
        {renderSubNav('Bridge', 'bridge', faArrowsSpin, true)}
        {renderSubNav('Chainlist', 'chainlist', faList)}
        {renderSubNavWithExternalLink('Revoke/Approval', 'https://ftmscan.com/tokenapprovalchecker', faArrowsUpDown)}
      </ToggleButtonGroup>
    )
  }

  const renderSubNavWithExternalLink = (title, link, icon) => {
    return (
      <ToggleButton
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={classes.navButton}
        classes={{ selected: classes.testChange }}
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          paddingLeft: '60px',
        }}
      >
        {icon ? (
          <FontAwesomeIcon
            icon={icon}
            style={{
              marginRight: '8px',
            }}
          />
        ) : null}
        <Typography variant="h2" className={classes.subtitleText}>
          {title}
        </Typography>
      </ToggleButton>
    )
  }

  return (
    <div className={classes.asideWrapper}>
      <section className={classes.asideSection1}>
        <div className={classes.asideTitle}>
          <span>Solidly swap</span>
        </div>
        <div className={classes.asideContent}>{renderNavs()}</div>
      </section>
      <section className={classes.asideSection2}>
        <div className={classes.asideTitle}>
          <div>
            <span>Tools</span>
            <span style={{ marginLeft: '5px', fontSize: '18px', fontWeight: '400', color: '#6F6F6F' }}>
              Coming soon...
            </span>
          </div>
        </div>
        <div className={classes.asideContent}>{renderTools()}</div>
      </section>
    </div>
  )
}

export default AsideMenu
