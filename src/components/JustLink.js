import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

const JustLink = (props) => {
  const {
    history,
    location,
    match,
    staticContext,
    router,
    to,
    onClick,
    ...rest
  } = props

  return (
    <a className="link-ajax"
      {...rest} // `children` is just another prop!
      onClick={(event) => {
        onClick && onClick(event)
        router.history.push(to)
      }}
    />
  )
}

JustLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default withRouter(JustLink)