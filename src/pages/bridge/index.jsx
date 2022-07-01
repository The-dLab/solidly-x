import { useState, useEffect } from 'react'
import classes from './bridge.module.css'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { TextField } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons'
import AccordionPanel from './accordionPanel'
import choiceData from './choices.json'
import { fetcher } from '../../utils/utils'

const url =
  'https://tools.defieye.io/defiapi/api/v1/crosschain/estimateFee?token={token}&dstchain={dst}&srcchain={src}&amount={amount}'

function Bridge() {
  const [token, setToken] = useState('USDC')
  const [value, setValue] = useState(100)
  const [srcChain, setSrcChain] = useState('BSC')
  const [destChain, setDestChain] = useState('Fantom')
  const [data, setData] = useState([])
  const handleSrcChainChange = (event) => {
    setSrcChain(event.target.value)
  }

  const handleDestChainChange = (event) => {
    setDestChain(event.target.value)
    console.log('event')
  }

  useEffect(() => {
    fetchData()
  }, [token, value, srcChain, destChain])

  const handleValueChange = (v) => {
    setValue(v.target.value * 1)
  }

  const handleTokenChange = (v) => {
    setToken(v.target.value)
  }

  // https://tools.defieye.io/defiapi/api/v1/crosschain/estimateFee?token=USDC&dstchain=Polygon&srcchain=Optimism&amount=100

  const fetchData = async () => {
    const req = url
      .replace('{token}', token)
      .replace('{dst}', destChain)
      .replace('{src}', srcChain)
      .replace('{amount}', value)
    const fees = await fetcher(req)
    setData(fees)
  }

  const { srcchains, dstchains, tokens } = choiceData

  return (
    <div className={classes.ffContainer}>
      <div className={classes.assetsContainer}>
        <span className={classes.title}>ASSET</span>
        <div className={classes.assetsWrapper}>
          <Select
            variant="outlined"
            style={{ width: '40%', height: '55px' }}
            value={token}
            onChange={handleTokenChange}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            {tokens.map((item, index) => (
              <MenuItem value={item} key={'token' + index}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginLeft: '10px' }}>{item}</span>
                </div>
              </MenuItem>
            ))}
          </Select>
          <TextField
            autoFocus
            style={{ width: '43%', height: '55px' }}
            variant="outlined"
            value={value}
            onChange={handleValueChange}
          />
        </div>
        <div className={classes.switchTitleWrapper}>
          <span>FROM</span>
          <FontAwesomeIcon
            icon={faArrowRightArrowLeft}
            style={{
              marginRight: '8px',
            }}
          />
          <span>TO</span>
        </div>
        <div className={classes.switchWrapper}>
          <Select
            variant="outlined"
            style={{ width: '40%', height: '55px' }}
            value={srcChain}
            onChange={handleSrcChainChange}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            {srcchains.map((item, index) => (
              <MenuItem value={item} key={'src' + index}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginLeft: '10px' }}>{item}</span>
                </div>
              </MenuItem>
            ))}
          </Select>
          <Select
            variant="outlined"
            style={{ width: '43%', height: '55px' }}
            value={destChain}
            onChange={handleDestChainChange}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            {dstchains.map((item, index) => (
              <MenuItem value={item} key={'dest' + index}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginLeft: '10px' }}>{item}</span>
                </div>
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className={classes.panelWrapper}>
          <AccordionPanel data={data} />
        </div>
      </div>
    </div>
  )
}

export default Bridge
