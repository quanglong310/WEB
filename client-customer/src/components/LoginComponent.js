import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';
import Modal from './ModalComponent';
class Login extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      showModal: false,
      modalText: ''
    };
  }
  handleCloseModal = () => {
    this.setState({ showModal: false, modalText: '' });
  }
  render() {
    return (
      <div className="align-center border" style={{padding:50, marginTop: 50, borderRadius: 5}}>
        {this.state.showModal &&
            <Modal modalText={this.state.modalText} onClose={this.handleCloseModal} />
          }
        <h2 className="text-center">Đăng nhập</h2>
        <p>Đăng nhập ngay để trải nghiệm Quick Store</p>
        <form>
          <table className="align-center">
            <tbody>
              <tr>
                <td style={{padding: 10}}>Tài khoản </td>
                <td><input class="form-control" type="text" value={this.state.txtUsername} onChange={(e) => { this.setState({ txtUsername: e.target.value }) }} /></td>
              </tr>
              <tr>
                <td style={{padding: 10}}>Mật khẩu</td>
                <td><input class="form-control" type="password" value={this.state.txtPassword} onChange={(e) => { this.setState({ txtPassword: e.target.value }) }} /></td>
              </tr>
              <tr>
                <td></td>
                <td><input className='btn btn-success' type="submit" data-toggle="modal" data-target="#myModal" value="Đăng nhập" onClick={(e) => this.btnLoginClick(e)} /></td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }
  // event-handlers
  btnLoginClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    if (username && password) {
      const account = { username: username, password: password };
      this.apiLogin(account);
    } else {
      this.setState({showModal: true, modalText: 'Vui lòng nhập tài khoản và mật khẩu!'})
    }
  }
  // apis
  apiLogin(account) {
    axios.post('/api/customer/login', account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setCustomer(result.customer);
        this.props.navigate('/home');
      } else {
        this.setState({showModal: true})
        this.setState({modalText: result.message})
      }
    });
  }
}
export default withRouter(Login);