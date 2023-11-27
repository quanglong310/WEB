import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Order extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }
  render() {
    const orders = this.state.orders.map((item, index) => {
      return (
        <tr key={item._id} onClick={() => this.trItemClick(item)}>
          <td>{index+1}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.customer.name}</td>
          <td>{item.customer.phone}</td>
          <td>{item.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          <td>{item.status === "PENDING" ? <span style={{color: 'red', fontWeight: 'bold'}}>Chưa xử lý</span> : item.status === "APPROVED" ? <span className='text-success' style={{fontWeight: 'bold'}}>Chấp nhận</span> : <span className='text-dark' style={{ fontWeight: 'bold'}}>Từ chối</span>}</td>
          <td>
            {item.status === 'PENDING' ?
              <div><span className="btn btn-outline-success" onClick={() => this.lnkApproveClick(item._id)}><i class="fas fa-check-circle"></i></span><span style={{marginLeft: 2}} className="btn btn-outline-danger" onClick={() => this.lnkCancelClick(item._id)}><i class="fas fa-times"></i> </span></div>
              : <div />}
          </td>
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
        <div className="container" style={{marginTop: '2%'}}>
          <h2 className="text-center">Danh sách đơn hàng</h2>
          <div class="table-responsive-sm">
          <table className="table table-striped table-hover">
            <tbody>
              <tr>
                <th>STT</th>
                <th>Thời gian</th>
                <th>Tên KH</th>
                <th>SĐT</th>
                <th>Tổng tiền (VNĐ)</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
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
            <table className="table table-striped table-hover">
              <tbody>
                <tr>
                  <th>STT</th>
                  <th>Tên SP</th>
                  <th>Ảnh SP</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Tổng</th>
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
    this.apiGetOrders();
  }
  // event-handlers
  trItemClick(item) {
    this.setState({ order: item });
  }
  // event-handlers
  lnkApproveClick(id) {
    this.apiPutOrderStatus(id, 'APPROVED');
  }
  lnkCancelClick(id) {
    this.apiPutOrderStatus(id, 'CANCELED');
  }
  // apis
  apiPutOrderStatus(id, status) {
    const body = { status: status };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/orders/status/' + id, body, config).then((res) => {
      const result = res.data;
      if (result) {
        this.apiGetOrders();
      } else {
        alert('SORRY BABY!');
      }
    });
  }
  // apis
  apiGetOrders() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders', config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    });
  }
}
export default Order;