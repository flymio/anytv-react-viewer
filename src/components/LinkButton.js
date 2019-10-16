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
    className,
    ...rest
  } = props

  let _className = "btn btn-info ";
  if (className){
    _className += className;
  }

  return (
    <button className={_className}
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