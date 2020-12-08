import React from 'react'
import { render } from 'react-dom'
import './style.css'

const Greeting = () => {
  return(
    <div>
      <h1>Hello from React</h1>
      <img src="forest.jpg"></img>
    </div>
  )
}

render(
  <Greeting />,
  document.getElementById('main')
)
