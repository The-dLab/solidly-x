import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import classes from './header.module.css'

import {
  Typography,
  Button,
  SvgIcon,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import { withStyles, withTheme } from '@material-ui/core/styles'
import ListIcon from '@material-ui/icons/List'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined'
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined'

import Unlock from '../unlock'
import TransactionQueue from '../transactionQueue'

import { ACTIONS } from '../../stores/constants'

import stores from '../../stores'
import { formatAddress } from '../../utils'

import Image from 'next/image'

function SiteLogo() {
  return <Image src="/images/logo.png" alt="" width="280" height="70" />
}

const { CONNECT_WALLET, ACCOUNT_CONFIGURED, ACCOUNT_CHANGED, FIXED_FOREX_CLAIM_VECLAIM } = ACTIONS

function WrongNetworkIcon(props) {
  const { className } = props
  return (
    <SvgIcon viewBox="0 0 64 64" strokeWidth="1" className={className}>
      <g strokeWidth="2" transform="translate(0, 0)">
        <path
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="square"
          strokeMiterlimit="10"
          d="M33.994,42.339 C36.327,43.161,38,45.385,38,48c0,3.314-2.686,6-6,6c-2.615,0-4.839-1.673-5.661-4.006"
          strokeLinejoin="miter"
        ></path>{' '}
        <path
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="square"
          strokeMiterlimit="10"
          d="M47.556,32.444 C43.575,28.462,38.075,26,32,26c-6.075,0-11.575,2.462-15.556,6.444"
          strokeLinejoin="miter"
        ></path>{' '}
        <path
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="square"
          strokeMiterlimit="10"
          d="M59.224,21.276 C52.256,14.309,42.632,10,32,10c-10.631,0-20.256,4.309-27.224,11.276"
          strokeLinejoin="miter"
        ></path>{' '}
        <line
          data-color="color-2"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="square"
          strokeMiterlimit="10"
          x1="10"
          y1="54"
          x2="58"
          y2="6"
          strokeLinejoin="miter"
        ></line>
      </g>
    </SvgIcon>
  )
}

const StyledMenu = withStyles({
  paper: {
    border: '1px solid rgba(126,153,176,0.2)',
    marginTop: '10px',
    minWidth: '230px',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: 'none',
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: '#FFF',
      },
    },
  },
}))(MenuItem)

const StyledBadge = withStyles((theme) => ({
  badge: {
    background: '#06D3D7',
    color: '#000',
  },
}))(Badge)

function Header(props) {
  const accountStore = stores.accountStore.getStore('account')
  const router = useRouter()

  const [account, setAccount] = useState(accountStore)
  const [darkMode, setDarkMode] = useState(props.theme.palette.type === 'dark' ? true : false)
  const [unlockOpen, setUnlockOpen] = useState(false)
  const [chainInvalid, setChainInvalid] = useState(false)
  const [loading, setLoading] = useState(false)
  const [transactionQueueLength, setTransactionQueueLength] = useState(0)

  useEffect(() => {
    const accountConfigure = () => {
      const accountStore = stores.accountStore.getStore('account')
      setAccount(accountStore)
      closeUnlock()
    }
    const connectWallet = () => {
      onAddressClicked()
    }
    const accountChanged = () => {
      const invalid = stores.accountStore.getStore('chainInvalid')
      setChainInvalid(invalid)
    }

    const invalid = stores.accountStore.getStore('chainInvalid')
    setChainInvalid(invalid)

    stores.emitter.on(ACCOUNT_CONFIGURED, accountConfigure)
    stores.emitter.on(CONNECT_WALLET, connectWallet)
    stores.emitter.on(ACCOUNT_CHANGED, accountChanged)
    return () => {
      stores.emitter.removeListener(ACCOUNT_CONFIGURED, accountConfigure)
      stores.emitter.removeListener(CONNECT_WALLET, connectWallet)
      stores.emitter.removeListener(ACCOUNT_CHANGED, accountChanged)
    }
  }, [])

  const handleToggleChange = (event, val) => {
    setDarkMode(val)
    props.changeTheme(val)
  }

  const onAddressClicked = () => {
    setUnlockOpen(true)
  }

  const closeUnlock = () => {
    setUnlockOpen(false)
  }

  useEffect(function () {
    const localStorageDarkMode = window.localStorage.getItem('yearn.finance-dark-mode')
    setDarkMode(localStorageDarkMode ? localStorageDarkMode === 'dark' : false)
  }, [])

  const navigate = (url) => {
    router.push(url)
  }

  const callClaim = () => {
    setLoading(true)
    stores.dispatcher.dispatch({ type: FIXED_FOREX_CLAIM_VECLAIM, content: {} })
  }

  const switchChain = async () => {
    let hexChain = '0x' + Number(process.env.NEXT_PUBLIC_CHAINID).toString(16)
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChain }],
      })
    } catch (switchError) {
      console.log('switch error', switchError)
    }
  }

  const setQueueLength = (length) => {
    setTransactionQueueLength(length)
  }

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <div className={classes.headerContainer}>
        <div className={classes.logoContainer}>
          <a onClick={() => router.push('/swap')}>
            <SiteLogo />
          </a>
        </div>

        <div style={{ width: '260px', display: 'flex', justifyContent: 'flex-end' }}>
          {process.env.NEXT_PUBLIC_CHAINID == '4002' && (
            <div className={classes.testnetDisclaimer}>
              <Typography className={classes.testnetDisclaimerText}>Testnet</Typography>
            </div>
          )}

          {transactionQueueLength > 0 && (
            <IconButton
              className={classes.accountButton}
              variant="contained"
              color={props.theme.palette.type === 'dark' ? 'primary' : 'secondary'}
              onClick={() => {
                stores.emitter.emit(ACTIONS.TX_OPEN)
              }}
            >
              <StyledBadge badgeContent={transactionQueueLength} color="secondary" overlap="circular">
                <ListIcon className={classes.iconColor} />
              </StyledBadge>
            </IconButton>
          )}

          {account && account.address ? (
            <div>
              <Button
                disableElevation
                className={classes.accountButton}
                variant="contained"
                color={props.theme.palette.type === 'dark' ? 'primary' : 'secondary'}
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                {account && account.address && <div className={`${classes.accountIcon} ${classes.metamask}`}></div>}
                <Typography className={classes.headBtnTxt}>
                  {account && account.address ? formatAddress(account.address) : 'Connect Wallet'}
                </Typography>
                <ArrowDropDownIcon className={classes.ddIcon} />
              </Button>

              <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className={classes.userMenu}
              >
                <StyledMenuItem className={classes.hidden} onClick={() => router.push('/dashboard')}>
                  <ListItemIcon className={classes.userMenuIcon}>
                    <DashboardOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText className={classes.userMenuText} primary="Dashboard" />
                </StyledMenuItem>
                <StyledMenuItem onClick={onAddressClicked}>
                  <ListItemIcon className={classes.userMenuIcon}>
                    <AccountBalanceWalletOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText className={classes.userMenuText} primary="Switch Wallet Provider" />
                </StyledMenuItem>
              </StyledMenu>
            </div>
          ) : (
            <Button
              disableElevation
              className={classes.accountButton}
              variant="contained"
              color={props.theme.palette.type === 'dark' ? 'primary' : 'secondary'}
              onClick={onAddressClicked}
            >
              {account && account.address && <div className={`${classes.accountIcon} ${classes.metamask}`}></div>}
              <Typography className={classes.headBtnTxt}>
                {account && account.address ? formatAddress(account.address) : 'Connect Wallet'}
              </Typography>
            </Button>
          )}
        </div>
        {unlockOpen && <Unlock modalOpen={unlockOpen} closeModal={closeUnlock} />}
        <TransactionQueue setQueueLength={setQueueLength} />
      </div>
      {chainInvalid ? (
        <div className={classes.chainInvalidError}>
          <div className={classes.ErrorContent}>
            <WrongNetworkIcon className={classes.networkIcon} />
            <Typography className={classes.ErrorTxt}>
              The chain you are connected to is not supported. Please check that your wallet is connected to Fantom
              Mainnet.
            </Typography>
            <Button
              className={classes.switchNetworkBtn}
              variant="contained"
              color="primary"
              onClick={() => switchChain()}
            >
              <span
                style={{
                  color: '#fff',
                }}
              >
                Switch to {process.env.NEXT_PUBLIC_CHAINID == '4002' ? 'Fantom Testnet' : 'Fantom Mainnet'}
              </span>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default withTheme(Header)
