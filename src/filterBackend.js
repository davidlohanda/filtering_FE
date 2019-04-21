import React from 'react'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import QueryString from 'query-string'

class App2 extends React.Component{
    state = {data : [] , page : 1}

    componentDidMount(){
        this.getTenData()
        this.getDataUrl()
    }

    getTenData = () => {
        axios.get('http://localhost:4000/titanic2/tenData')
        .then((res) => {
            this.setState({data : res.data})
        })
        .catch((err) => console.log(err))
    }

    renderJsx = () => {
        var jsx = this.state.data.map((val,i) => {
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

    viewMoreHandler = () => {
        axios.get(`http://localhost:4000/titanic2/paging/${this.state.page}`)
        .then((res) => {
            this.setState({data : [...this.state.data , ...res.data] , page : this.state.page + 1})
        })
        .catch((err) => console.log(err))
    }

    filterBtn = () => {
        this.pushUrl()
        var name = this.refs.inputName.value
        var pclass = this.refs.dropdown.value
        axios.get('http://localhost:4000/titanic2/filter?name=' + name + '&pclass=' + pclass )
        .then((res) => this.setState({data : res.data}))
        .catch((err) => console.log(err))
    }

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
            if(params[i].value === ''){
                newLink += ''
            }else{
                newLink += '&' + params[i].params + '=' + params[i].value
            }
          }
        }
    
        this.props.history.push(newLink)
    
      }

      getDataUrl = () => {
        if(this.props.location.search){
            var obj = QueryString.parse(this.props.location.search)
            var pclass = obj.pclass?obj.pclass.toString() : null
            axios.get('http://localhost:4000/titanic2/filter?name=' + obj.name + '&pclass=' + pclass )
                .then((res) => this.setState({data : res.data}))
                .catch((err) => console.log(err))  
         } 
      }
    
    render(){
        return(
            <div className='container'>
            <h1 className="mb-5"> Filtering Backend</h1>
            <div className = 'row mb-3 mb-5'>
                <div className='col-md-3'>
                    <input className='form-control' type='text' placeholder='Search by Nama' ref='inputName' />
                </div>
                <div className='col-md-3'>
                    <select ref='dropdown' className='form-control'>
                        <option value=''>All Class</option>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                    </select>
                </div>
                <div className='col-md-1'>
                    <input type='button' onClick={this.filterBtn} className='btn btn-info' value='search' />
                </div>
            </div>
                <div>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <td>#</td>
                                <td>PassengerId</td>
                                <td>Survived</td>
                                <td>Pclass</td>
                                <td>Name</td>
                                <td>Sex</td>
                                <td>Age</td>
                                <td>Fare</td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderJsx()}
                        </tbody>
                    </table>
                    <div className='row justify-content-center'>
                            <p style={{cursor:'pointer'}} onClick={this.viewMoreHandler}> View More </p>
                    </div>
                </div>
            </div>
        )
    }
} 

export default withRouter(App2)