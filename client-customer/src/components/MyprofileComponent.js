import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import Modal from './ModalComponent';
class Myprofile extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      txtName: '',
      txtPhone: '',
      txtEmail: '',
      showModal: false,
      modalText: ''
    };
  }
  handleCloseModal = () => {
    this.setState({ showModal: false, modalText: '' });
  }
  render() {
    if (this.context.token === '') return (<Navigate replace to='/login' />);
    return (
      <div className="align-center border" style={{padding:50, marginTop: 50, borderRadius: 5}}>
        {this.state.showModal &&
          <Modal modalText={this.state.modalText} onClose={this.handleCloseModal} />
          }
        <h2 className="text-center">Hồ sơ cá nhân</h2>
        <form>
          <table className="align-center">
            <tbody>
              <tr>
                <td style={{padding: 10}}>Tên tài khoản</td>
                <td><input disabled className="form-control" type="text" value={this.state.txtUsername} onChange={(e) => { this.setState({ txtUsername: e.target.value }) }} /></td>
              </tr>
              <tr>
                <td style={{padding: 10}}>Mật khẩu</td>
                <td><input className="form-control" type="password" value={this.state.txtPassword} onChange={(e) => { this.setState({ txtPassword: e.target.value }) }} /></td>
              </tr>
              <tr>
                <td style={{padding: 10}}>Họ và tên</td>
                <td><input className="form-control" type="text" value={this.state.txtName} onChange={(e) => { this.setState({ txtName: e.target.value }) }} /></td>
              </tr>
              <tr>
                <td style={{padding: 10}}>Số điện thoại</td>
                <td><input className="form-control" type="tel" value={this.state.txtPhone} onChange={(e) => { this.setState({ txtPhone: e.target.value }) }} /></td>
              </tr>
              <tr>
                <td style={{padding: 10}}>Email</td>
                <td><input disabled className="form-control" type="email" value={this.state.txtEmail} onChange={(e) => { this.setState({ txtEmail: e.target.value }) }} /></td>
              </tr>
              <tr>
                <td></td>
                <td><button className='btn btn-info' type="submit" data-toggle="modal" data-target="#myModal" onClick={(e) => {this.btnUpdateClick(e); this.setState({showModal: true})}} >Lưu thông tin</button></td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }
  componentDidMount() {
    if (this.context.customer) {
      this.setState({
        txtUsername: this.context.customer.username,
        txtPassword: this.context.customer.password,
        txtName: this.context.customer.name,
        txtPhone: this.context.customer.phone,
        txtEmail: this.context.customer.email
      });
    }
  }
  // event-handlers
  btnUpdateClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    const name = this.state.txtName;
    const phone = this.state.txtPhone;
    const email = this.state.txtEmail;
    if (username && password && name && phone && email) {
      const customer = { username: username, password: password, name: name, phone: phone, email: email };
      this.apiPutCustomer(this.context.customer._id, customer);
    } else {
      this.setState({ modalText: 'Vui lòng nhập đầy đủ các trường thông tin: Tên tài khoản, mật khẩu, SĐT, email!'})
    }
  }
  // apis
  apiPutCustomer(id, customer) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/customer/customers/' + id, customer, config).then((res) => {
      const result = res.data;
      if (result) {
        this.setState({modalText: 'Cập nhật thông tin thành công!'})
        this.context.setCustomer(result);
      } else {
        this.setState({modalText: 'Có lỗi đã xảy ra, vui lòng thử lại!'})
      }
    });
  }
}
export default Myprofile;