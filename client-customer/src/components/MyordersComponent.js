import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Myorders extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }
  render() {
    if (this.context.token === '') return (<Navigate replace to='/login' />);
    const orders = this.state.orders.map((item, index) => {
      return (
        <tr key={item._id} onClick={() => this.trItemClick(item)}>
          <td>{index + 1}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.customer.name}</td>
          <td>{item.customer.phone}</td>
          <td>{item.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          <td>{item.status === "PENDING" ? <span style={{color: 'red', fontWeight: 'bold'}}>Chưa xử lý</span> : item.status === "APPROVED" ? <span className='text-success' style={{fontWeight: 'bold'}}>Chấp nhận</span> : <span className='text-dark' style={{ fontWeight: 'bold'}}>Từ chối</span>}</td>
        </tr>
      );
    });
    if (this.state.order) {
      var items = this.state.order.items.map((item, index) => {
        return (
          <tr key={item.product._id}>
            <td>{index + 1}</td>
            <td>{item.product.name}</td>
            <td><img src={"data:image/jpg;base64," + item.product.image} width="70px" height="70px" alt="" /></td>
            <td>{item.product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
            <td>{item.quantity}</td>
            <td>{(item.product.price * item.quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          </tr>
        );
      });
    }
    return (
      <div>
        <div className="container">
          <h2 className="text-center">Danh sách đơn hàng</h2>
          <div class="table-responsive-sm">
            <table className="table table-striped table-hover">
              <tbody>
                <tr>
                  <th>STT</th>
                  <th>Thời gian</th>
                  <th>Tên khách hàng</th>
                  <th>SĐT</th>
                  <th>Tổng tiền (VNĐ)</th>
                  <th>Trạng thái</th>
                </tr>
                {orders}
              </tbody>
            </table>
          </div>
        </div>
        {this.state.order ?
          <div className="container">
            <h2 className="text-center">Chi tiết đơn hàng</h2>
            <div class="table-responsive-sm">
              <table className='table table-striped'>
                <tbody>
                  <tr>
                    <th>STT</th>
                    <th>Tên sản phẩm</th>
                    <th>Ảnh</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Tổng tiền</th>
                  </tr>
                  {items}
                </tbody>
              </table>
            </div>
            <center><button onClick={() => this.trItemClick(undefined)} className='btn btn-outline-danger'>Đóng</button></center>
          </div>
          : <div />}
      </div>
    );
  }
  componentDidMount() {
    if (this.context.customer) {
      const cid = this.context.customer._id;
      this.apiGetOrdersByCustID(cid);
    }
  }
  // event-handlers
  trItemClick(item) {
    this.setState({ order: item });
  }
  // apis
  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/customer/orders/customer/' + cid, config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    });
  }
}
export default Myorders;