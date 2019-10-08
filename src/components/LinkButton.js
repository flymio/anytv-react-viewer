import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

const LinkButton = (props) => {
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

  console.log(props);

  return (
    <button class="btn btn-info"
      {...rest} // `children` is just another prop!
      onClick={(event) => {
        onClick && onClick(event)
        router.history.push(to)
      }}
    />
  )
}

LinkButton.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default withRouter(LinkButton)