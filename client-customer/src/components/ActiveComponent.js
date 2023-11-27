  import axios from 'axios';
  import React, { Component } from 'react';
  import Modal from './ModalComponent';
  class Active extends Component {
    constructor(props) {
      super(props);
      this.state = {
        txtID: '',
        txtToken: '',
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
          <h2 className="text-center">Kích hoạt tài khoản</h2>
          <p>Vui lòng nhập ID và Mã kích hoạt đã được gửi qua email cho bạn</p>
          <form>
            <table className="align-center">
              <tbody>
                <tr>
                <td style={{padding: 10}}>ID </td>
                  <td><input className="form-control" type="text" value={this.state.txtID} onChange={(e) => { this.setState({ txtID: e.target.value }) }} /></td>
                </tr>
                <tr>
                  <td style={{padding: 10}}>Mã kích hoạt </td>
                  <td><input className="form-control" type="text" value={this.state.txtToken} onChange={(e) => { this.setState({ txtToken: e.target.value }) }} /></td>
                </tr>
                <tr>
                  <td></td>
                  <td><button className='btn btn-danger' type="submit" onClick={(e) => this.btnActiveClick(e)} data-toggle="modal" data-target="#myModal" >Kích hoạt ngay</button></td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      );
    }
    // event-handlers

  btnActiveClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const token = this.state.txtToken;
    if (id && token && id.length === 24) {
      this.apiActive(id, token);
    } else {
      this.setState({showModal: true, modalText : 'Vui lòng nhập đúng và đủ thông tin, ID gồm 24 ký tự'})
    }
  }
  // apis
  apiActive(id, token) {
    this.setState({showModal: true})
    const body = { id: id, token: token };
    axios.post('/api/customer/active', body).then((res) => {
      const result = res.data;
      if (result) {
        this.setState({modalText : 'Kích hoạt tài khoản thành công, đăng nhập để mua sắm ngay tại Quick Store!'})
      } else {
        this.setState({modalText : 'Kích hoạt tài khoản thất bại, vui lòng thử lại!'})
      }
    });
  }
  }
  export default Active;