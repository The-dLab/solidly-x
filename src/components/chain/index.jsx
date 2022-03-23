import { useEffect, useMemo, useState } from 'react'
import { Typography, Paper, Button, Tooltip, withStyles } from '@material-ui/core'
import classes from './chain.module.css'
import { ACTIONS } from '../../stores/constants'
import stores, { useChain } from '../../stores/index.js'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import RPCList from '../RPCList'
import { addToNetwork, renderProviderText } from '../../utils/utils'
import Unlock from '../../components/unlock'
import Image from 'next/image'

const ExpandButton = withStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: '12px',
    marginBottom: '-24px',
  },
}))(Button)

export default function Chain({ chain }) {
  const [unlockOpen, setUnlockOpen] = useState(false)
  const [account, setAccount] = useState(stores.accountStore.getStore('account'))

  const onAddressClicked = () => {
    setUnlockOpen(true)
  }

  const closeUnlock = () => {
    setUnlockOpen(false)
  }

  useEffect(() => {
    const accountConfigure = () => {
      setAccount(stores.accountStore.getStore('account'))
      closeUnlock()
    }
    const connectWallet = () => {
      onAddressClicked()
    }

    stores.emitter.on(ACTIONS.ACCOUNT_CONFIGURED, accountConfigure)
    stores.emitter.on(ACTIONS.CONNECT_WALLET, connectWallet)
    return () => {
      stores.emitter.removeListener(ACTIONS.ACCOUNT_CONFIGURED, accountConfigure)
      stores.emitter.removeListener(ACTIONS.CONNECT_WALLET, connectWallet)
    }
  }, [])

  const icon = useMemo(() => {
    return chain.chainSlug ? `https://defillama.com/chain-icons/rsz_${chain.chainSlug}.jpg` : '/unknown-logo.png'
  }, [chain])

  const chainId = useChain((state) => state.id)
  const updateChain = useChain((state) => state.updateChain)

  const handleClick = () => {
    if (chain.chainId === chainId) {
      updateChain(null)
    } else {
      updateChain(chain.chainId)
    }
  }

  const showAddlInfo = chain.chainId === chainId

  if (!chain) {
    return <div></div>
  }

  const myLoader = ({ src }) => {
    return src
  }

  return (
    <>
      <Paper elevation={1} className={classes.chainContainer} key={chain.chainId}>
        <div className={classes.chainNameContainer}>
          <Image
            alt=""
            loader={myLoader}
            src={icon}
            onError={(e) => {
              e.target.onerror = null
              e.target.src = '/unknown-logo.png'
            }}
            width={28}
            height={28}
            className={classes.avatar}
          />

          <Tooltip title={chain.name}>
            <Typography variant="h3" className={classes.name} noWrap style={{ marginLeft: '24px' }}>
              <a href={chain.infoURL} target="_blank" rel="noreferrer">
                {chain.name}
              </a>
            </Typography>
          </Tooltip>
        </div>
        <div className={classes.chainInfoContainer}>
          <div className={classes.dataPoint}>
            <Typography variant="subtitle1" color="textSecondary" className={classes.dataPointHeader}>
              ChainID
            </Typography>
            <Typography variant="h5">{chain.chainId}</Typography>
          </div>
          <div className={classes.dataPoint}>
            <Typography variant="subtitle1" color="textSecondary" className={classes.dataPointHeader}>
              Currency
            </Typography>
            <Typography variant="h5">{chain.nativeCurrency ? chain.nativeCurrency.symbol : 'none'}</Typography>
          </div>
        </div>
        <div className={classes.addButton}>
          {account ? (
            <Button variant="outlined" color="primary" onClick={() => addToNetwork(account, chain)}>
              {renderProviderText(account)}
            </Button>
          ) : (
            <Button variant="outlined" color="primary" onClick={onAddressClicked}>
              Connect wallet
            </Button>
          )}
        </div>
        <ExpandButton onClick={handleClick}>
          <ExpandMoreIcon style={{ transform: showAddlInfo ? 'rotate(180deg)' : '', transition: 'all 0.2s ease' }} />
        </ExpandButton>
      </Paper>
      {showAddlInfo && <RPCList chain={chain} />}
      {unlockOpen && <Unlock modalOpen={unlockOpen} closeModal={closeUnlock} />}
    </>
  )
}
