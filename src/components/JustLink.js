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
    replaceClass,
    ...rest
  } = props

  let className = "link-ajax";
  if (replaceClass){
    className = replaceClass;
  }

  return (
    <a className={className}
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