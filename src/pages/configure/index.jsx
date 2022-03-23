import { withTheme } from '@material-ui/core/styles'
import classes from './configure.module.css'
import Image from 'next/image'

function Configure({ theme }) {
  return (
    <div className={classes.configureContainer}>
      <Image src="/images/logo.png" alt="" width="280" height="70" />
    </div>
  )
}

export default withTheme(Configure)
