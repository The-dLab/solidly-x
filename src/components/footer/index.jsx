import { useState } from 'react'
import classes from './footer.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faTelegram, faTwitter, faMedium } from '@fortawesome/free-brands-svg-icons'
import DonateDialog from '../donateDialog/DonateDialog'
import Link from '@material-ui/core/Link'
import Image from 'next/image'

function Footer() {
  const [showDonate, setShowDonate] = useState(false)
  return (
    <div className={classes.footerContainer}>
      <div className={classes.footerMain}>
        <div className={classes.footerLeft}>
          <Image alt="" src="/images/box_logo.png" width="140" height="140" className={classes.boxLogoImg} />
          <span className={classes.footerTitle}>dLab</span>
        </div>
        <div className={classes.footerRight}>
          <div className={classes.aboutTitle}>About us</div>
          <div className={classes.aboutContent}>
            <Link
              underline="none"
              onClick={() => setShowDonate(true)}
              style={{ textDecoration: 'none', color: '#fff', cursor: 'pointer' }}
            >
              <FontAwesomeIcon
                icon={faHeart}
                style={{
                  color: 'red',
                  marginRight: '8px',
                }}
              />
              Donate
            </Link>
            <Link
              target="_blank"
              rel="noreferrer"
              underline="none"
              href="https://twitter.com/labfordup"
              style={{ textDecoration: 'none', color: '#fff' }}
            >
              <FontAwesomeIcon
                icon={faTwitter}
                style={{
                  marginRight: '8px',
                }}
              />
              Twitter
            </Link>
            <Link
              target="_blank"
              rel="noreferrer"
              underline="none"
              href="https://t.me/dupforX"
              style={{ textDecoration: 'none', color: '#fff' }}
            >
              <FontAwesomeIcon
                icon={faTelegram}
                style={{
                  marginRight: '8px',
                }}
              />
              Telegram
            </Link>
            <Link
              target="_blank"
              rel="noreferrer"
              underline="none"
              href="https://medium.com/@Tim4l1f3"
              style={{ textDecoration: 'none', color: '#fff' }}
            >
              <FontAwesomeIcon
                icon={faMedium}
                style={{
                  marginRight: '8px',
                }}
              />
              Medium
            </Link>
          </div>
        </div>
      </div>
      <div className={classes.footerBottom}>Developed by dLab ©Copyright 2022 </div>
      <DonateDialog open={showDonate} onClose={() => setShowDonate(false)} />
    </div>
  )
}

export default Footer
