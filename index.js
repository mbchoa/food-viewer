import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import IngredientsList from './components/IngredientsList';

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div>Testing</div>
        <IngredientsList />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
