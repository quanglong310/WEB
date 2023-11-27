import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import Modal from './ModalComponent';
class Home extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: [],
      product: null,
      addedCart: false,
      showModal: false,
      modalText: ''
    };
  }
  handleCloseModal = () => {
    this.setState({ showModal: false, modalText: '' });
  }
  render() {
    const newprods = this.state.newprods.map((item) => {
      return (
        <div key={item._id} className="inline card m_auto">
          <figure>
            <Link to={'/product/' + item._id}><img src={"data:image/jpg;base64," + item.image} width="300px" height="300px" alt="" /></Link>
            {/* href thêm chữ "/#" để không xảy ra lỗi  */}
            <figcaption className="text-center font-weight-bold">{item.name}</figcaption>
            <figcaption className="text-center text-danger font-weight-bold">{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VNĐ</figcaption>
          </figure>
          <Link to={'/product/' + item._id}><center><button className='btn btn-info'>Xem sản phẩm</button><button style={{marginLeft: '5%'}} data-toggle="modal" data-target="#myModal" className='btn btn-outline-danger' type="submit" onClick={(e) => {this.btnAdd2CartClick(e, item._id); this.setState({showModal: true})}} ><i class="fas fa-cart-plus"></i></button><br /><br /></center></Link>
        </div>
      );
    });
    const hotprods = this.state.hotprods.map((item) => {
      
      return (
        <div key={item._id} className="inline card m_auto">
          <figure>
            <Link to={'/product/' + item._id}><img src={"data:image/jpg;base64," + item.image} width="300px" height="300px" alt="" /></Link>
            {/* href thêm chữ "/#" để không xảy ra lỗi  */}
            <figcaption className="text-center font-weight-bold">{item.name}</figcaption>
            <figcaption className="text-center text-danger font-weight-bold">{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VNĐ</figcaption>
          </figure>
          <Link to={'/product/' + item._id}><center><button className='btn btn-info'>Xem sản phẩm</button><button style={{marginLeft: '5%'}} data-toggle="modal" data-target="#myModal" className='btn btn-outline-danger' type="submit" onClick={(e) => {this.btnAdd2CartClick(e, item._id); this.setState({showModal: true})}} ><i class="fas fa-cart-plus"></i></button><br /><br /></center></Link>
        </div>
      );
    });
    return (
      <div class="container">
        <div>
          <h2 className='text-center'>Chào mừng bạn đến với cửa hàng mỹ phẩm Pure Nature</h2>
          <center><img style={{width: 140, height: 140}} src={require('../../src/images/logo.png')}/></center><hr></hr>
          
          
          {this.state.showModal &&
          <Modal modalText={this.state.modalText} onClose={this.handleCloseModal} />
          }
          
          <h4 className="text-left">Sản phẩm mới nhất</h4>
          <center>
          {newprods}
          </center>
        </div>
        {this.state.hotprods.length > 0 ?
          <div><hr></hr>
            <h4 className="text-left">Sản phẩm Hot</h4>
            <center>{hotprods}</center>
            
          </div>
          : <div />}
      </div>
    );
  }
  componentDidMount() {
    const params = this.props.params;
    this.apiGetNewProducts();
    this.apiGetHotProducts();
  }
  // apis
  apiGetNewProducts() {
    axios.get('/api/customer/products/new').then((res) => {
      const result = res.data;
      this.setState({ newprods: result });
    });
  }
  apiGetHotProducts() {
    axios.get('/api/customer/products/hot').then((res) => {
      const result = res.data;
      this.setState({ hotprods: result });
    });
  }

  // event-handlers
  async btnAdd2CartClick(e, id) {
    e.preventDefault();
    const res = await axios.get('/api/customer/products/' + id);
    const product = res.data;
    const quantity = 1;
    if (quantity) {
      if(this.context.token === '') {
        this.setState({modalText : 'Vui lòng đăng nhập để thực hiện chức năng này.'})
      } 
      else {
        const mycart = this.context.mycart;
        const index = mycart.findIndex(x => x.product._id === product._id); // check if the _id exists in mycart
        if (index === -1) { // not found, push newItem
          const newItem = { product: product, quantity: quantity };
          mycart.push(newItem);
        } else { // increasing the quantity
          mycart[index].quantity += quantity;
        }
        this.context.setMycart(mycart);
        this.setState({ modalText: 'Thêm vào giỏ hàng thành công.' })
        this.setState({addedCart: true})
      }
      
    } 
    
  }


}
export default Home;