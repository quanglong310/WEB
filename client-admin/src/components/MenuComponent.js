import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Link } from 'react-router-dom';
class Menu extends Component {
  static contextType = MyContext; // using this.context to access global state
  render() {
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
              <li class="nav-item">
                <Link className="nav-link" style={{textDecoration: 'none', color: 'white'}} to='/admin/home'>Trang chủ</Link>
              </li>
              <li class="nav-item">
                <Link className="nav-link" style={{textDecoration: 'none', color: 'white'}} to='/admin/category'>Quản lý phân loại</Link>
              </li>
              <li class="nav-item">
                <Link className="nav-link" style={{textDecoration: 'none', color: 'white'}} to='/admin/product'>Quản lý sản phẩm</Link>
              </li>
              <li class="nav-item">
                <Link className="nav-link" style={{textDecoration: 'none', color: 'white'}} to='/admin/order'>Quản lý đơn hàng</Link>
              </li>
              <li class="nav-item">
                <Link className="nav-link" style={{textDecoration: 'none', color: 'white'}} to='/admin/customer'>Quản lý khách hàng</Link>
              </li>
            </ul>
            <ul class="navbar-nav ml-auto">
                <li class="nav-item active text-light">
                  <Link className="nav-link" style={{textDecoration: 'none', color: 'white'}} to='/admin/home' onClick={() => this.lnkLogoutClick()}>Đăng xuất</Link>
                </li>
            </ul>
          </div>  
        </nav>
      </div>
    );
  }
  // event-handlers
  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setUsername('');
  }
}
export default Menu;