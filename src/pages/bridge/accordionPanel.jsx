import { makeStyles, withStyles } from '@material-ui/core/styles'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import MuiAccordion from '@material-ui/core/Accordion'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Children } from 'react'
import basicinfo from './basicinfo.json'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  // heading: {
  //   fontSize: theme.typography.pxToRem(15),
  //   fontWeight: theme.typography.fontWeightRegular,
  // },
  a: {
    '&:hover': {
      // color: '#f9f9f9',
      color: '#9f9f9f',
    },
  },
  content: {
    width: '100%',
    display: 'flex',
    // justifyContent: ' space-between',
  },
  detailWrapper: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  detailContent: {
    fontSize: '16px',
    color: '#9f9f9f',
  },
}))

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(23, 180, 73, .425)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion)

function AccordionPanel(props) {
  const { data } = props
  const classes = useStyles()
  return (
    <div>
      {data
        ? Children.toArray(
            data.map((item, index) => (
              <Accordion key={item.bridge + '-' + index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  <div className={classes.content}>
                    <span style={{ width: '40%' }}>
                      <a target="_blank" href={basicinfo[item.bridge].url} rel="noreferrer" className={classes.a}>
                        {basicinfo[item.bridge].display_name}
                      </a>
                    </span>

                    <span style={{ width: '30%' }}>10~30min</span>
                    <span style={{ flex: '1' }}>
                      {item.received} {item.dsttoken}
                    </span>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <div className={classes.detailWrapper}>
                    <div className={classes.detailContent}>FEE</div>
                    {item.fee_info.length > 0 ? (
                      item.fee_info.map((info, idx) => (
                        <div className={classes.detailContent} key={info + index + idx}>
                          {info[0]}:{info[1]}
                        </div>
                      ))
                    ) : (
                      <div className={classes.detailContent}>bridge liquidity not enough</div>
                    )}
                  </div>
                </AccordionDetails>
              </Accordion>
            ))
          )
        : null}
    </div>
  )
}

export default AccordionPanel
