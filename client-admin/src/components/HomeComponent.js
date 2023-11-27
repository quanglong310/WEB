import React, { Component } from 'react';
import axios from 'axios';  
import CircleLoader from "react-spinners/CircleLoader";
import MyContext from '../contexts/MyContext';
class Home extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      isLoaded: false,
      acceptedOrders: 0,
      isLoadedAcceptedOrders: false,
      cancelledOrders: 0,
      isLoadedCancelledOrders: false,
      income: 0,
      isLoadedIncome: false,
      pendingOrders: 0,
      isLoadedPendingOrders: false
    };
  }


  render() {
    return (
      <div className="container">
        <h2 style={{marginTop: '2%'}} className="text-center">Chào mừng đến với trang quản trị, <b>{this.context.username}</b>!</h2>
        <center><img src={require('../images/logo.png')} width='20%' height='20%'/>
        <div>
          <h4>Tổng số đơn hàng:</h4>
          <h4>{this.state.isLoaded ? <font color="red">{Object.keys(this.state.orders).length}</font> : <CircleLoader color="#36d7b7" />}</h4>
          <hr></hr> 
            <div style={{display: 'flex', flexDirection: 'row'}}>

              <div style={{flex: 1}}>
                <h4>Đơn hàng chưa xử lý:</h4>
                <h4>{this.state.isLoadedPendingOrders ? <font color="red">{Object.keys(this.state.pendingOrders).length}</font> : <CircleLoader color="#36d7b7" />}</h4>
              </div>

              <div style={{flex: 1}}>
                <h4>Đơn hàng đã chấp nhận:</h4>
                <h4>{this.state.isLoadedAcceptedOrders ? <font color="red">{Object.keys(this.state.acceptedOrders).length}</font> : <CircleLoader color="#36d7b7" />}</h4>
              
              </div>

              <div style={{flex: 1}}>
                <h4>Đơn hàng đã từ chối: </h4>
                <h4>{this.state.isLoadedCancelledOrders ? <font color="red">{Object.keys(this.state.cancelledOrders).length}</font> : <CircleLoader color="#36d7b7" />}</h4>
              </div>
            </div>
            <hr></hr>
            <h4>Tổng doanh thu: </h4>
            <h4 style={{color: 'red'}}>{this.state.isLoadedIncome ? this.state.income.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")  : <CircleLoader color="#36d7b7" />}{this.state.isLoadedIncome ? ' VNĐ' : ''}</h4>
          </div>  
        </center>

        

      </div>
    );
  }

  componentDidMount() {
    this.apiGetOrders();
    this.apiGetAcceptedOrders();
    this.apiGetCancelledOrders();
    this.apiGetIncome();
    this.apiGetPendingOrders();
  }
  apiGetOrders() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders', config).then((res) => {
      const result = res.data;
      this.setState({ orders: result, isLoaded: true });
    });

  }
  apiGetAcceptedOrders() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders', config).then((res) => {
      const result = res.data;
      const approvedOrders = result.filter((order) => order.status === "APPROVED");
      this.setState({ acceptedOrders: approvedOrders, isLoadedAcceptedOrders: true });
    });
  }
  apiGetCancelledOrders() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders', config).then((res) => {
      const result = res.data;
      const cancelledOrders = result.filter((order) => order.status === "CANCELED");
      this.setState({ cancelledOrders: cancelledOrders, isLoadedCancelledOrders: true });
    });
  }
  apiGetPendingOrders() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders', config).then((res) => {
      const result = res.data;
      const pendingOrders = result.filter((order) => order.status === "PENDING");
      this.setState({ pendingOrders: pendingOrders, isLoadedPendingOrders: true });
    });
  }
  async apiGetIncome() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders', config).then((res) => {
      const result = res.data;
      const approvedOrders = result.filter((order) => order.status === "APPROVED");
      const approvedTotal = approvedOrders.reduce((total, order) => total + order.total, 0);
      if(!this.state.isLoadedIncome){
        this.setState({income: approvedTotal, isLoadedIncome: true})
      }
      
    });
  }
}
export default Home;