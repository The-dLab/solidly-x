import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import DialogTitle from '@material-ui/core//DialogTitle'

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props
  return (
    <DialogTitle
      style={{
        marginTop: '15px',
      }}
      {...other}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon
            style={{
              width: '36px',
              height: '36px',
            }}
          />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

BootstrapDialogTitle.defaultProps = {
  children: null,
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
}

export default BootstrapDialogTitle
