import { Typography, Button, Grid } from '@material-ui/core'

import classes from './home.module.css'
import Image from 'next/image'
import { useRouter } from 'next/router'

function SiteLogo(props) {
  const { className } = props
  return <Image src="/images/logo.png" alt="" width="280" height="70" />
}

function Home({ changeTheme }) {
  function handleNavigate(route) {
    router.push(route)
  }

  const router = useRouter()

  return (
    <div className={classes.ffContainer}>
      <div className={classes.contentContainerFull}>
        <Grid container spacing={2} className={classes.homeContentMain}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography variant="h1" className={classes.preTitle}>
              0.01% fee
            </Typography>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography variant="h1" className={classes.mainTitle}>
              Low cost stable coin swaps
            </Typography>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Grid container spacing={2}>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Button
                  className={classes.buttonInfo}
                  onClick={() => scrollTo({ top: 1000, left: 0, behavior: 'smooth' })}
                >
                  Learn More
                </Button>
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Button className={classes.buttonEnter} onClick={() => router.push('/swap')}>
                  Enter App
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default Home
