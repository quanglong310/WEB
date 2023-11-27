import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';
import Modal from './ModalComponent';
class ProductDetail extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1,
      showModal: false,
      modalText: ''
    };
  }
  handleCloseModal = () => {
    this.setState({ showModal: false, modalText: '' });
  }
  render() {
    const prod = this.state.product;
    if (prod != null) {
      return (
        <div className="container align-center border border-info" style={{borderRadius: 50, width: '50%'}}>
          {this.state.showModal &&
          <Modal modalText={this.state.modalText} onClose={this.handleCloseModal} />
          }
          <h2 className="text-center">{prod.name}</h2>
            <center><img src={"data:image/jpg;base64," + prod.image} width='50%' height='50%' style={{borderRadius: 20}}/></center>
            <p className='text-center'>#{prod.category.name}</p>
          <form className='align-center'>
            <h4 className='text-center text-danger'>{prod.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VNĐ</h4>
            <i>Số lượng:</i>
            <div class="input-group mb-3">
              <input type="number" className='form-control' min="1" max="99" value={this.state.txtQuantity} onChange={(e) => { this.setState({ txtQuantity: e.target.value }) }} />
           
              <div class="input-group-append">
                <button data-toggle="modal" data-target="#myModal" className='btn btn-outline-danger' type="submit" onClick={(e) => this.btnAdd2CartClick(e)} ><i class="fas fa-cart-plus"></i></button>
              </div>
            </div>
          </form>
        </div>
      );
    }
    return (<div />);
  }

  // event-handlers
  btnAdd2CartClick(e) {
    e.preventDefault();
    const product = this.state.product;
    const quantity = parseInt(this.state.txtQuantity);
    if (quantity) {
      this.setState({showModal: true})
      if(this.context.token === '') {
        this.setState({ modalText: 'Vui lòng đăng nhập' })
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
      }
      
    } 
    
    
    
    else {
      this.setState({showModal: true, modalText: 'Vui lòng nhập số lượng!' })
    }
  }
  componentDidMount() {
    const params = this.props.params;
    this.apiGetProduct(params.id);
  }
  // apis
  apiGetProduct(id) {
    axios.get('/api/customer/products/' + id).then((res) => {
      const result = res.data;
      this.setState({ product: result });
    });
  }
}
export default withRouter(ProductDetail);