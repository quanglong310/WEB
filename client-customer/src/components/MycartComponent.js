import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import axios from 'axios';
import withRouter from '../utils/withRouter';
import Modal from './ModalComponent';
class Mycart extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      modalText: ''
    };
  }
  handleCloseModal = () => {
    this.setState({ showModal: false, modalText: '' });
  }
  render() {
    const mycart = this.context.mycart.map((item, index) => {
      return (
        <tr key={item.product._id} className="datatable">
          <td>{index + 1}</td>
          <td>{item.product.name}</td>
          <td>{item.product.category.name}</td>
          <td><img src={"data:image/jpg;base64," + item.product.image} width="70px" height="70px" alt="" /></td>
          <td>{item.product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          <td>{item.quantity}</td>
          <td>{(item.product.price * item.quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          <td><button className="btn btn-outline-danger" onClick={() => this.lnkRemoveClick(item.product._id)}><i class="fas fa-trash-alt"></i></button></td>
        </tr>
      );
    });
    return (
      <div className="container">
        {this.state.showModal &&
          <Modal modalText={this.state.modalText} onClose={this.handleCloseModal} />
          }
        <h2 className="text-center">Giỏ hàng của bạn</h2>
        <table className="table table-striped table-hover">
          <tbody>
            <tr style={{textAlign: 'center'}}>
              <th>STT</th>
              <th>Tên SP</th>
              <th>Phân loại</th>
              <th>Ảnh SP</th>
              <th>Đơn giá (VNĐ)</th>
              <th>Số lượng</th>
              <th>Tổng (VNĐ)</th>
              <th>Hành động</th>
            </tr>
            {mycart}
            <tr>
              <td colSpan="5"></td>
              <td>Tổng cộng: </td>
              <td style={{color: 'red'}}>{CartUtil.getTotal(this.context.mycart).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VNĐ</td>
              <td><button data-toggle="modal" data-target="#myModal" className="btn btn-success" onClick={() => this.lnkCheckoutClick()}>Thanh toán</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  // event-handlers
  lnkRemoveClick(id) {
    const mycart = this.context.mycart;
    const index = mycart.findIndex(x => x.product._id === id);
    if (index !== -1) { // found, remove item
      mycart.splice(index, 1);
      this.context.setMycart(mycart);
    }
  }
  // event-handlers
  lnkCheckoutClick() {
      if (this.context.mycart.length > 0) {
        const total = CartUtil.getTotal(this.context.mycart);
        const items = this.context.mycart;
        const customer = this.context.customer;
        if (customer) {
          this.apiCheckout(total, items, customer);
        } else {
          this.props.navigate('/login');
        }
      } else {
        this.setState({showModal: true, modalText: 'Giỏ hàng của bạn trống, hãy lựa chọn đồ thêm nhé!'})
      }
  }
  // apis
  apiCheckout(total, items, customer) {
    const body = { total: total, items: items, customer: customer };
    const config = { headers: { 'x-access-token': this.context.token } };
    this.setState({showModal: true})
    axios.post('/api/customer/checkout', body, config).then((res) => {
      const result = res.data;
      if (result) {
        this.setState({modalText: 'Thanh toán thành công! '})
        this.context.setMycart([]);
      } else {
        this.setState({modalText: 'Thanh toán thất bại, đã có lỗi xảy ra!'})
      }
    });
  }
}

export default withRouter(Mycart);