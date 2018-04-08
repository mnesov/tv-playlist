import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'

import 'semantic-ui-css/semantic.min.css'

const render = () => {
  const App = require('./App').App
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>
    , document.getElementById('app'))
}

render()
module.hot && module.hot.accept(render)
