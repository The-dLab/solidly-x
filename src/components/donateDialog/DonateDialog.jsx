import { useState } from 'react'
import PropTypes from 'prop-types'
/* eslint-disable */
import { ethers } from 'ethers'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import BootstrapDialogTitle from './BootstrapDialogTitle'
import Image from 'next/image'

const DEV_WALLET = '0xF28Ef4580f514Eca5c1B75d0Db9b0cB6d62d83ef'

const abi = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',

  // Authenticated Functions
  'function transfer(address to, uint amount) returns (bool)',

  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)',
]

const TOKEN = [
  '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
  '',
  '0x049d68029688eAbF473097a2fC38ef61633A3C7A',
  '0x321162Cd933E2Be498Cd2267a90534A804051b11',
  '0x74b23882a30290451A17c44f4F05243b6b58C76d',
]

const decimals = [6, 18, 6, 8, 18]

function requestAccount() {
  window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0xfa',
        chainName: 'Fantom Opera',
        rpcUrls: ['https://rpc.ftm.tools/'],
        blockExplorerUrls: ['https://ftmscan.com/'],
        nativeCurrency: {
          name: 'Fantom',
          symbol: 'FTM',
          decimals: 18,
        },
      },
    ],
  })
}

function transfer(signer, to, value) {
  signer
    .sendTransaction({
      to,
      value: ethers.utils.parseEther(`${value}`),
    })
    .then(() => {})
    .catch(() => {})
}

function transferErc20(signer, to, value, addr, decimal) {
  const erc20 = new ethers.Contract(addr, abi, signer)
  erc20
    .transfer(to, ethers.utils.parseUnits(`${value}`, decimal))
    .then(() => {})
    .catch(() => {})
}

function DonateDialog(props) {
  const { onClose, open } = props
  const [tokenIndex, setTokenIndex] = useState(0)
  const [value, setValue] = useState(1)

  const handleClose = () => {
    onClose()
  }

  const handleChange = (event) => {
    setTokenIndex(event.target.value * 1)
  }

  const handleValueChange = (v) => {
    setValue(v.target.value * 1)
  }

  const handleDonate = async () => {
    if (!window.ethereum) {
      return
    }
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    requestAccount()
    if (accounts.length > 0) {
      // const account = accounts[0];
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      if (tokenIndex === 1) {
        transfer(signer, DEV_WALLET, value)
      } else {
        transferErc20(signer, DEV_WALLET, value, TOKEN[tokenIndex], decimals[tokenIndex])
      }
    }
  }

  return (
    <Dialog onClose={handleClose} open={open} maxWidth={false}>
      <BootstrapDialogTitle onClose={handleClose}>
        <Box display="flex" justifyContent="center">
          <span
            style={{
              color: '#17B449',
              fontSize: '1.7rem',
              fontWeight: 'bold',
            }}
          >
            Donate
          </span>
        </Box>
      </BootstrapDialogTitle>
      <DialogContent>
        <div
          style={{
            display: 'flex',
            width: '90%',
            margin: 'auto',
          }}
        >
          <div>
            <Image width="300" height="300" src="/images/success.png" alt="" />
          </div>
          <Box
            sx={{
              width: '45rem',
              ml: '3rem',
              mt: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
            }}
          >
            <Typography
              style={{ display: 'inline-block', fontSize: '1.4rem', fontWeight: 'bold' }}
              gutterBottom
              component="div"
            >
              If you are willing to help the Solidly-X developers and become a donor, we appreciate it and will continue
              to update and maintain Solidly-X .
            </Typography>
            <Box display="flex" mt={2} alignItems="center">
              <Select
                variant="outlined"
                style={{ width: '13rem', height: '45px' }}
                value={tokenIndex}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value={0}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: '35px', height: '35px' }} src="/images/usdc.png" alt="" />
                    <span style={{ marginLeft: '10px' }}>USDC</span>
                  </div>
                </MenuItem>
                <MenuItem value={1}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: '35px', height: '35px' }} src="/images/ftm.png" alt="" />
                    <span style={{ marginLeft: '10px' }}>FTM</span>
                  </div>
                </MenuItem>
                <MenuItem value={2}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: '35px', height: '35px' }} src="/images/fusdt.png" alt="" />
                    <span style={{ marginLeft: '10px' }}>fUSDT</span>
                  </div>
                </MenuItem>
                <MenuItem value={3}>
                  {' '}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: '35px', height: '35px' }} src="/images/wbtc.png" alt="" />
                    <span style={{ marginLeft: '10px' }}>wBTC</span>
                  </div>
                </MenuItem>
                <MenuItem value={4}>
                  {' '}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: '35px', height: '35px' }} src="/images/eth.png" alt="" />
                    <span style={{ marginLeft: '10px' }}>wETH</span>
                  </div>
                </MenuItem>
              </Select>
              <Box sx={{ width: '15rem', ml: 2 }} display="flex">
                <TextField
                  variant="outlined"
                  inputProps={{
                    min: 0,
                    max: 100000000,
                    style: {
                      height: '12px',
                    },
                  }}
                  fullWidth
                  type="number"
                  defaultValue={1}
                  onChange={handleValueChange}
                />
              </Box>
            </Box>
          </Box>
        </div>
        <Box display="flex" justifyContent="center" mt="2rem" mb="2rem">
          <Button
            variant="contained"
            color="primary"
            onClick={handleDonate}
            style={{
              maxWidth: '200px',
              minWidth: '200px',
              height: '50px',
              fontSize: '20px',
            }}
          >
            <span
              style={{
                color: '#fff',
                fontWeight: 'bold',
              }}
            >
              Donate
            </span>
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

DonateDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
}

export default DonateDialog
