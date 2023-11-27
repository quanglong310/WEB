import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Inform extends Component {

  static contextType = MyContext; // using this.context to access global state
  render() {
    return (
      <div className='container'>
      <div>
        <div>
        {this.context.token === '' ?
          <nav class="navbar navbar-expand-md navbar-light">
          <i class="fas fa-user" style={{marginRight: 50}}></i>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar1">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="collapsibleNavbar1">
            <ul class="navbar-nav">
              <li class="nav-item active">
                <Link class="nav-link" to='/login'>Đăng nhập</Link>
              </li>
              <li class="nav-item active">
                <Link class="nav-link" to='/signup'>Đăng ký</Link>
              </li>
              <li class="nav-item active">
                <Link class="nav-link" to='/active'>Kích hoạt tài khoản</Link>
              </li>
            </ul>
          </div>  
        </nav>
          :
          <nav class="navbar navbar-expand-md navbar-light">
          <i class="fas fa-user" style={{marginRight: 10}}></i><span className='text-info'>{this.context.customer.name} </span>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar1">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="collapsibleNavbar1">
            <ul class="navbar-nav">
              <li class="nav-item active">
                <Link class="nav-link" to='/myprofile'>Hồ sơ cá nhân</Link> 
              </li>
              <li class="nav-item active">
                <Link className="nav-link" to='/myorders'>Đơn đặt hàng</Link>
              </li>
              <li class="nav-item active">
                <Link class="nav-link" to='/home' onClick={() => this.lnkLogoutClick()}>Đăng xuất</Link> 
              </li>
            </ul>
            <ul class="navbar-nav ml-auto">
                <li class="nav-item active">
                <Link class="nav-link" to='/mycart'><i class="fas fa-shopping-cart"></i> {this.context.mycart.length}</Link>
                </li>
            </ul>
          </div>  
        </nav>

        }
      </div>



        <div className="float-clear" />
      </div>
      </div>
    );
  }
  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setCustomer(null);
    this.context.setMycart([]);
  }
}
export default Inform;