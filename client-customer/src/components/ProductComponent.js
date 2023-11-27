import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import Modal from './ModalComponent';
import MyContext from '../contexts/MyContext';
class Product extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      isLoaded: false,
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
    const prods = this.state.products.map((item) => {
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
      <div>
        {this.state.showModal &&
          <Modal modalText={this.state.modalText} onClose={this.handleCloseModal} />
          }
      
      <div className="text-center">
        <h2 className="text-center">Danh sách sản phẩm</h2>
        {prods}
        {this.state.isLoaded && Object.keys(prods).length < 1 ? 
          <p>Sản phẩm đã hết hàng</p> : <p></p>
        }
      </div>
      </div>
    );
  }
  componentDidMount() { // first: /product/...
    const params = this.props.params;
    if (params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }
  componentDidUpdate(prevProps) { // changed: /product/...
    const params = this.props.params;
    if (params.cid && params.cid !== prevProps.params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword && params.keyword !== prevProps.params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }
  // apis
  apiGetProductsByCatID(cid) {
    axios.get('/api/customer/products/category/' + cid).then((res) => {
      const result = res.data;
      this.setState({ products: result, isLoaded: true });
      
    });
  }
  apiGetProductsByKeyword(keyword) {
    axios.get('/api/customer/products/search/' + keyword).then((res) => {
      const result = res.data;
      this.setState({ products: result, isLoaded: true });
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
export default withRouter(Product);