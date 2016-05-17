import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import IngredientsList from './components/IngredientsList';
import apiHelper from './utils/apiHelper';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foodName: 'banana',
      searchInput: '',
    }
    this.updateChart = this.updateChart.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.searchForFood(this.state.foodName);
  }
  render() {
    return (
      <div>
        <nav class="navbar navbar-light bg-faded">
          <h1 class="navbar-brand">Macro</h1>
        </nav>
        <div className="jumbotron">
          <div className="input-group">
            <input
              className="form-control"
              type="text"
              value={this.state.searchInput}
              onChange={this.handleChange}
              placeholder="Search food name..."/>
            <span className="input-group-btn">
              <button
                className="btn btn-primary"
                type="button"
                onClick={this.handleSearch}>
                  Search
              </button>
            </span>
          </div>
          <h3 className="text-center" >{this.state.foodName}</h3>
        </div>
      </div>
    )
  }
  searchForFood(foodName) {
    apiHelper.searchFood(foodName)
      .then(response => {
        return response.json();
      }).then(json => {
        return json.list.item[0].ndbno;
      }).then(apiHelper.getFoodInfo)
      .then(response => {
        return response.json();
      }).then(foodData => {
        this.setState({
          foodData: foodData,
        })
      }).catch(ex => {
        console.log('parsing failed', ex)
      });
  }
  componentDidUpdate() {
    this.updateChart();
  }
  handleChange(event) {
    this.setState({
      searchInput: event.target.value
    })
  }
  handleSearch(event) {
    event.preventDefault();
    console.log('perform search', this.state.searchInput);
    this.setState({
      foodName: this.state.searchInput,
    });
    this.searchForFood(this.state.searchInput);
  }
  formatFoodData() {
    const nutrients = this.state.foodData.report.food.nutrients;

    const carbs = nutrients.filter(nutrient => {
      return nutrient.name.indexOf('Carbohydrate') >= 0;
    })[0].value;
    const protein = nutrients.filter(nutrient => {
      return nutrient.name.indexOf('Protein') >= 0;
    })[0].value;
    const fats = nutrients.filter(nutrient => {
      return nutrient.name.indexOf('fat') >= 0;
    })[0].value;
    const calories = (carbs * 4) + (protein * 4) + (fats * 9);
    return {
      carbs: Math.floor(carbs*4 / calories * 100),
      protein: Math.floor(protein*4 / calories * 100),
      fats: Math.floor(fats*9 / calories * 100),
    }
  }
  updateChart() {
    const macrosPct = this.formatFoodData();

    var dataset = [
      { label: 'Carbohydrates', count: macrosPct.carbs },
      { label: 'Protein', count: macrosPct.protein },
      { label: 'Fat', count: macrosPct.fats },
    ];

    var width = 360;
    var height = 360;
    var radius = Math.min(width, height) / 2;

    var color = d3.scale.category20b();

    var s = d3.selectAll('svg');
    s = s.remove();
    var svg = d3.select('#chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');

    var donutWidth = 75;

    var arc = d3.svg.arc()
      .innerRadius(radius - donutWidth)
      .outerRadius(radius);

    var pie = d3.layout.pie()
      .value(function(d) { return d.count; })
      .sort(null);

    var path = svg.selectAll('path')
      .data(pie(dataset))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d, i) {
      return color(d.data.label);
    });

    var legendRectSize = 18;
    var legendSpacing = 4;

    var legend = svg.selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        var height = legendRectSize + legendSpacing;
        var offset =  height * color.domain().length / 2;
        var horz = -2 * legendRectSize;
        var vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
      });

    legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', color)
      .style('stroke', color);

    legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(function(d) { return d; });
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
