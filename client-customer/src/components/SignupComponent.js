import axios from 'axios';
import React, { Component } from 'react';
import Modal from './ModalComponent';
class Signup extends Component {
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
    return (
      <div className="align-center border border" style={{padding:50, marginTop: 50, borderRadius: 5}}>
        {this.state.showModal &&
          <Modal modalText={this.state.modalText} onClose={this.handleCloseModal} />
          }
        <h2 className="text-center">Đăng ký tài khoản</h2>
        <p>Bạn chưa có tài khoản? Hãy nhập ngay thông tin dưới đây để đăng ký trải nghiệm Quick Store</p>
        <form>
          <table className="align-center">
            <tbody>
              <tr>
                <td style={{padding: 10}}>Tên tài khoản</td>
                <td><input class="form-control"  type="text" value={this.state.txtUsername} onChange={(e) => { this.setState({ txtUsername: e.target.value }) }} /></td>
              </tr>
              <tr>
                <td style={{padding: 10}}>Mật khẩu</td>
                <td><input class="form-control"  type="password" value={this.state.txtPassword} onChange={(e) => { this.setState({ txtPassword: e.target.value }) }} /></td>
              </tr>
              <tr>
                <td style={{padding: 10}}>Họ và tên</td>
                <td><input class="form-control"  type="text" value={this.state.txtName} onChange={(e) => { this.setState({ txtName: e.target.value }) }} /></td>
              </tr>
              <tr>
                <td style={{padding: 10}}>Số điện thoại</td>
                <td><input class="form-control"  type="tel" value={this.state.txtPhone} onChange={(e) => { this.setState({ txtPhone: e.target.value }) }} /></td>
              </tr>
              <tr>
                <td style={{padding: 10}}>Email</td>
                <td><input class="form-control"  type="email" value={this.state.txtEmail} onChange={(e) => { this.setState({ txtEmail: e.target.value }) }} /></td>
              </tr>
              <tr>
                <td></td>
                <td><input className='btn btn-danger' data-toggle="modal" data-target="#myModal" type="submit" value="Đăng ký ngay" onClick={(e) => {this.btnSignupClick(e); this.setState({showModal: true})} }/></td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }
  // event-handlers
  btnSignupClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    const name = this.state.txtName;
    const phone = this.state.txtPhone;
    const email = this.state.txtEmail;
    if (username && password && name && phone && email) {
      const account = { username: username, password: password, name: name, phone: phone, email: email };
      this.apiSignup(account);
    } else {
      this.setState({modalText: 'Vui lòng nhập đầy đủ các trường thông tin: Tên tài khoản, mật khẩu, SĐT, email!'})
    }
  }
  // apis
  apiSignup(account) {
    axios.post('/api/customer/signup', account).then((res) => {
      const result = res.data;
      this.setState({modalText: result.message})
    });
  }
}
export default Signup;