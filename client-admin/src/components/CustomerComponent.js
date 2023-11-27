import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import Modal from './ModalComponent';
class Customer extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      orders: [],
      order: null,
      showModal: false,
      modalText: 'Đang xử lý...',
      isLoaded: false
    };
  }
  handleCloseModal = () => {
    this.setState({ showModal: false, modalText: 'Đang xử lý...' });
  }
  render() {
    const customers = this.state.customers.map((item) => {
      return (
        <tr key={item._id} onClick={() => this.trCustomerClick(item)}>
          <td>{item._id}</td>
          <td>{item.username}</td>
          <td>{item.password}</td>
          <td>{item.name}</td>
          <td>{item.phone}</td>
          <td>{item.email}</td>
          <td>{item.active}</td>
          <td>
            {item.active === 0 ?
              <button style={{width: '100%'}} data-toggle="modal" data-target="#myModal" className="btn btn-outline-success" onClick={() => {this.setState({showModal: true}); this.lnkEmailClick(item)}}><i class="fas fa-envelope-open-text"></i></button>
              :
              <button style={{width: '100%'}} data-toggle="modal" data-target="#myModal" className="btn btn-outline-danger" onClick={() => {this.setState({showModal: true}); this.lnkDeactiveClick(item)}}><i class="fas fa-user-slash"></i></button>}
          </td>
        </tr>
      );
    });
    const orders = this.state.orders.map((item, index) => {
      return (
        <tr key={item._id} className="datatable" onClick={() => this.trOrderClick(item)}>
          <td>{index+1}</td>
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
          <tr key={item.product._id} className="datatable">
            <td>{index + 1}</td>
            <td>{item.product._id}</td>
            <td>{item.product.name}</td>
            <td><img src={"data:image/jpg;base64," + item.product.image} width="70px" height="70px" alt="" /></td>
            <td>{item.product.price}</td>
            <td>{item.quantity}</td>
            <td>{item.product.price * item.quantity}</td>
          </tr>
        );
      });
    }
    return (
      <div>
        <div className="container" style={{marginTop: '2%'}}>
        {this.state.showModal &&
              <Modal modalText={this.state.modalText} onClose={this.handleCloseModal} />
            }
          <h2 className="text-center">Quản lý khách hàng</h2>
          <table className="table table-striped table-hover">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Username</th>
                <th>Mật khẩu</th>
                <th>Họ và tên</th>
                <th>SĐT</th>
                <th>Email</th>
                <th>Xác minh</th>
                <th>Hành động</th>
              </tr>
              {customers}
            </tbody>
          </table>
        </div>
        {this.state.orders.length > 0 ?
          <div className="container">
            <h2 className="text-center">Danh sách đơn hàng người dùng</h2>
            <table className='table table-striped'>
                <tbody>
                  <tr>
                    <th>STT</th>
                    <th>Thời gian</th>
                    <th>Tên KH</th>
                    <th>SĐT</th>
                    <th>Tổng tiền (VNĐ)</th>
                    <th>Tình trạng</th>
                  </tr>
                  {orders}
                </tbody>
              </table>
          </div>
          : <div />}
        {this.state.order ?
          <div className="align-center">
            <h2 className="text-center">ORDER DETAIL</h2>
            <table className="datatable" border="1">
              <tbody>
                <tr className="datatable">
                  <th>No.</th>
                  <th>Prod.ID</th>
                  <th>Prod.name</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                </tr>
                {items}
              </tbody>
            </table>
          </div>
          : <div />}
      </div>
    );
  }
  componentDidMount() {
    this.apiGetCustomers();
  }
  // event-handlers
  trCustomerClick(item) {
    this.setState({ orders: [], order: null });
    this.apiGetOrdersByCustID(item._id);
  }
  trOrderClick(item) {
    this.setState({ order: item });
  }
  // apis
  apiGetCustomers() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers', config).then((res) => {
      const result = res.data;
      this.setState({ customers: result });
    });
  }
  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders/customer/' + cid, config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    });
  }
  // event-handlers
  lnkDeactiveClick(item) {
    this.apiPutCustomerDeactive(item._id, item.token);
  }
  // apis
  apiPutCustomerDeactive(id, token) {
    const body = { token: token };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/customers/deactive/' + id, body, config).then((res) => {
      const result = res.data;
      if (result) {
        this.apiGetCustomers();
      } else {
        this.setState({modalText: 'Có lỗi xảy ra trên hệ thống, vui lòng thử lại sau!'})
      }
    });
  }
  // event-handlers
  lnkEmailClick(item) {
    this.apiGetCustomerSendmail(item._id);
  }
  // apis
  apiGetCustomerSendmail(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers/sendmail/' + id, config).then((res) => {
      const result = res.data;
      this.setState({isLoaded: false})
      this.setState({modalText: result.message})
    });
  }
}
export default Customer;