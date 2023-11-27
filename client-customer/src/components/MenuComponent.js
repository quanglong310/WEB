import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import withRouter from '../utils/withRouter';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtKeyword: ''
    };
  }
  render() {
    const cates = this.state.categories.map((item) => {
      return (
        <li key={item._id} className="nav-link"><Link style={{textDecoration: 'none', color: 'white'}} to={'/product/category/' + item._id}>{item.name}</Link></li>
      );
    });
    return (
      <div> 
        <nav class="navbar navbar-expand-md bg-dark navbar-dark">
          <a class="navbar-brand" href="#">
            <img style={{width: 50, height: 50}} src={require('../images/logo.png')} />
          </a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="collapsibleNavbar">
            <ul class="navbar-nav">
              <li class="nav-item active">
                <Link class="nav-link text-light" to="/">Trang chủ</Link>
              </li>
              {cates}
            </ul>
           
          </div>  
        </nav>
        
      </div>
    );
  }
  btnSearchClick(e) {
    e.preventDefault();
    this.props.navigate('/product/search/' + this.state.txtKeyword);
  }
  componentDidMount() {
    this.apiGetCategories();
  }
  // apis
  apiGetCategories() {
    axios.get('/api/customer/categories').then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }
}
export default withRouter(Menu);