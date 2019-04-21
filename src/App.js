import React, { Component } from 'react';
import axios from 'axios'
import TooltipBuatanSendiri from './component/Tooltip'
import QueryString from 'query-string'
import {withRouter} from 'react-router-dom'


class App extends Component {
  state = {data : [] , pclass : [], dataPerPage : 10, searchName : '', fromAge : 0, toAge : 1000, filterPclass : 5}

  componentDidMount(){
    this.getData()
    this.getPclass()
    this.getDataUrl()
  }

  getData = () => {
    axios.get('http://localhost:4000/titanic1/allData')
    .then((res) => {
      this.setState({data : res.data})
    })
    .catch((err) => console.log(err))
  }

  getPclass = () => {
    axios.get('http://localhost:4000/titanic1/pclass')
    .then((res) => {
      this.setState({pclass : res.data})
    })
    .catch((err) => console.log(err))
  }
  
  renderJsx = () => {
    var arrSearchAndFilter = this.state.data.filter((val) => {
      return val.Name.toLowerCase().startsWith(this.state.searchName) 
            && (parseInt(val.Pclass) === parseInt(this.state.filterPclass) || this.state.filterPclass > 4) 
            && (val.Age >= this.state.fromAge && val.Age <= this.state.toAge)
    })

    var tenData = arrSearchAndFilter.slice(0,this.state.dataPerPage)

    var jsx = tenData.map((val,i) => {
      return(
        <tr>
          <td>{i+1}</td>
          <td>{val.PassengerId}</td>
          <td>{val.Survived}</td>
          <td>{val.Pclass}</td>
          <td>{val.Name}</td>
          <td>{val.Sex}</td>
          <td>{val.Age}</td>
          <td>{val.Age}</td>
        </tr>
      )
    })
    return jsx
  }

  renderPclass = () => {
    var pclass = this.state.pclass.map((val) => {
      return(
        <option value={val.Pclass}>{val.Pclass}</option>
      )
    })
    return pclass
  }

  onBtnSearchClick = () => {
    this.pushUrl()
    var arrSearchAndFilter = this.state.data.filter((val) => {
      return val.Name.toLowerCase().startsWith(this.state.searchName) 
            && (parseInt(val.Pclass) === parseInt(this.state.filterPclass) || this.state.filterPclass > 4) 
            && (val.Age >= this.state.fromAge && val.Age <= this.state.toAge)
    })
    this.setState({searchName : this.refs.inputName.value.toLowerCase(),
                  filterPclass : this.refs.dropdown.value, 
                  fromAge : this.refs.fromAge.value?this.refs.fromAge.value : 0, 
                  toAge : this.refs.toAge.value? this.refs.toAge.value : 1000,
                  dataFilter : arrSearchAndFilter
                })
  }

  //cara nyimpen link supaya pas di refresh gak ilang
  pushUrl = () => {
    var newLink = `/search`
    var params = []

    if(this.refs.inputName.value){
      params.push({
        params : 'name',
        value : this.refs.inputName.value
      })
    }
    if(this.refs.dropdown.value <= 3){
      params.push({
        params : 'pclass',
        value : this.refs.dropdown.value
      })
    }

    for(var i = 0 ; i < params.length; i ++){
      if(i === 0){
        newLink += '?' + params[i].params + '=' + params[i].value
      }else{
        newLink += '&' + params[i].params + '=' + params[i].value
      }
    }

    this.props.history.push(newLink)

  }

  getDataUrl = () => {
    if(this.props.location.search){
      var obj = QueryString.parse(this.props.location.search)
      if(obj.name){
        this.setState({searchName : obj.name})
      }
      if(obj.pclass){
        this.setState({filterPclass : obj.pclass})
      }
     } 
  }

  render() {
    return (
      <div className="container text-center">
        <h3>Titanic Dataset</h3>
        <div className="row mt-5">
          <div className='col-md-3'> 
            <input type='text' ref='inputName' placeholder='searchByName' className='form-control' /> 
          </div>
          <div className='col-md-3'>
            <select ref='dropdown' className='form-control'> 
              <option value={5}>All Class </option>
              {this.renderPclass()}
            </select>
          </div>
          <div className='col-md-1'>
              <input type='number' ref='fromAge' className='form-control' id="from"/>
            </div>
            <div className='col-md-1'>
                <input type='number' ref='toAge' className='form-control' id='to'/>
            </div>
            <div className='col-md-1'> 
              <input type='button' onClick={this.onBtnSearchClick} className='btn btn-info' value='search'/>
            </div>
            <div className='col-md-1'>
                <TooltipBuatanSendiri value='From Age' id='from' />
                <TooltipBuatanSendiri value='To Age' id='to' />
            </div>
        </div>
        <table className="table table-bordered mt-5">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">PassengerId</th>
              <th scope="col">Survived</th>
              <th scope="col">Pclass</th>
              <th scope="col">Name</th>
              <th scope="col">Sex</th>
              <th scope="col">Age</th>
              <th scope="col">Fare</th>
            </tr>
          </thead>
          <tbody>
            {this.renderJsx()}
          </tbody>
        </table>
        
        <div className='row justify-content-center'> 
              <p onClick={() => this.setState({dataPerPage : this.state.dataPerPage + 10})} style={{fontStyle:'italic', cursor : 'pointer'}}>View More</p>
        </div> 
      </div>
    );
  }
}

export default withRouter(App);
