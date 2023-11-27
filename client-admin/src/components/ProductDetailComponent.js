import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import Modal from './ModalComponent';
class ProductDetail extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: '',
      txtName: '',
      txtPrice: 0,
      cmbCategory: '',
      imgProduct: '',
      showModal: false,
      modalText: ''
    };
  }
  handleCloseModal = () => {
    this.setState({ showModal: false, modalText: '' });
  }
  render() {
    const cates = this.state.categories.map((cate) => {
      if (this.props.item != null) {
        return (<option key={cate._id} value={cate._id} selected={cate._id === this.props.item.category._id}>{cate.name}</option>);
      } else {
        return (<option key={cate._id} value={cate._id}>{cate.name}</option>);
      }
    });
    return (
      <div>
        {this.state.showModal &&
          <Modal modalText={this.state.modalText} onClose={this.handleCloseModal} />
        }
        <h2 className="text-center">Thêm/ Sửa sản phẩm</h2>
        <form>
          <table>
            <tbody>
              <tr>
                <td></td>
                <td><input className='form-control' type="hidden" value={this.state.txtID} onChange={(e) => { this.setState({ txtID: e.target.value }) }} readOnly={true} /></td>
              </tr>
              <tr>
                <td style={{padding: 10}}>Tên SP</td>
                <td><input className='form-control' type="text" value={this.state.txtName} onChange={(e) => { this.setState({ txtName: e.target.value }) }} /></td>
              </tr>
              <tr>
                <td style={{padding: 10}}>Đơn giá</td>
                <td><input className='form-control' type="text" value={this.state.txtPrice} onChange={(e) => { this.setState({ txtPrice: e.target.value }) }} /></td>
              </tr>
              <tr>
                <td style={{padding: 10}}>Ảnh SP</td>
                <td><input className='form-control' type="file" name="fileImage" accept="image/jpeg, image/png, image/gif" onChange={(e) => this.previewImage(e)} /></td>
              </tr>
              <tr>
                <td style={{padding: 10}}>Phân loại</td>
                <td><select className="form-control" onChange={(e) => { this.setState({ cmbCategory: e.target.value }) }}>{cates}</select></td>
              </tr>
            </tbody>
          </table>
          <hr></hr>
          <div style={{display:'flex', flexDirection: 'row'}}>
            <div style={{flex: 1}}>
              <button style={{width: '90%'}}  className='btn btn-success' type="submit" data-toggle="modal" data-target="#myModal" onClick={(e) => this.btnAddClick(e)} >Thêm</button>
            </div>
            <div style={{flex: 1}}>
              <button style={{width: '90%', marginLeft: '2%', marginRight: '2%'}} data-toggle="modal" data-target="#myModal" className='btn btn-info' type="submit" onClick={(e) => this.btnUpdateClick(e)} >Cập nhật</button> 
            </div>
            <div style={{flex: 1}}>
              <button style={{width: '90%'}} className='btn btn-danger' type="submit" data-toggle="modal" data-target="#myModal" onClick={(e) => this.btnDeleteClick(e)} >Xoá</button>
            </div>
          </div>          
        </form>
        <hr></hr>
        <center><img src={this.state.imgProduct} width="50%" height="auto" alt="" /></center>
      </div>
    );
  }
  
  btnDeleteClick(e) {
    e.preventDefault();
    this.setState({showModal : true});

      const id = this.state.txtID;
      if (id) {
        this.apiDeleteProduct(id);
        this.setState({imgProduct : ''})
      } else {
        this.setState({modalText: 'Vui lòng chọn sản phẩm để xoá!'})
      }
    
  }
  // apis
  apiDeleteProduct(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/products/' + id, config).then((res) => {
      const result = res.data;
      if (result) {
        this.setState({modalText: 'Xoá sản phẩm thành công!'})
        this.apiGetProducts();
      } else {
        this.setState({modalText: 'Có lỗi trong quá trình xoá sản phẩm, vui lòng thử lại!'})
      }
    });
  }

  
  btnUpdateClick(e) {
    e.preventDefault();
    this.setState({showModal : true});
    const id = this.state.txtID;
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, ''); // remove "data:image/...;base64,"
    if (id && name && price && category && image) {
      const prod = { name: name, price: price, category: category, image: image };
      this.apiPutProduct(id, prod);
    } else {
      this.setState({modalText: 'Vui lòng cung cấp tên sản phẩm, đơn giá, phân loại và ảnh của sản phẩm!'})
    }
  }
  // apis
  apiPutProduct(id, prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/products/' + id, prod, config).then((res) => {
      const result = res.data;
      if (result) {
        this.setState({modalText: 'Đã cập nhật thông tin sản phẩm thành công!'})
        this.apiGetProducts();
      } else {
        this.setState({modalText: 'Có lỗi xảy ra trong quá trình cập nhật thông tin sản phẩm, vui lòng thử lại!'})
      }
    });
  }
  // event-handlers
  btnAddClick(e) {
    e.preventDefault();
    this.setState({showModal : true});
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, ''); // remove "data:image/...;base64,"
    if (name && price && category && image) {
      const prod = { name: name, price: price, category: category, image: image };
      this.apiPostProduct(prod);
    } else {
      this.setState({modalText: 'Vui lòng cung cấp tên sản phẩm, đơn giá, phân loại và ảnh của sản phẩm!'})
    }
  }
  // apis
  apiPostProduct(prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/products', prod, config).then((res) => {
      const result = res.data;  
      if (result) {
        this.setState({modalText: 'Thêm sản phẩm thành công!'})
        this.apiGetProducts();
      } else {
        this.setState({modalText: 'Có lỗi xảy ra, vui lòng thử lại!'})
      }
    });
  }
  apiGetProducts() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/products?page=' + this.props.curPage, config).then((res) => {
      const result = res.data;
      this.props.updateProducts(result.products, result.noPages);
      if (result.products.length !== 0) {
        this.props.updateProducts(result.products, result.noPages);
      } else {
        axios.get('/api/admin/products?page=' + (this.props.curPage - 1), config).then((res) => {
          const result = res.data;
          this.props.updateProducts(result.products, result.noPages);
        });
      }
    });
  }
  componentDidMount() {
    this.apiGetCategories();
  }
  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name,
        txtPrice: this.props.item.price,
        cmbCategory: this.props.item.category._id,
        imgProduct: 'data:image/jpg;base64,' + this.props.item.image
      });
    }
  }
  // event-handlers
  previewImage(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setState({ imgProduct: evt.target.result });
      }
      reader.readAsDataURL(file);
    }
  }
  // apis
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }
}
export default ProductDetail;