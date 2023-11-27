import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';

class Product extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      noPages: 0,
      curPage: 1,
      itemSelected: null
    };
  }
  render() {
    const prods = this.state.products.map((item, index) => {
      return (
        <tr key={item._id} className="datatable" onClick={() => this.trItemClick(item)}>
          <td>{item._id}</td>
          <td>{item.name}</td>
          <td>{item.price}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.category.name}</td>
          <td><img src={"data:image/jpg;base64," + item.image} width="100px" height="100px" alt="" /></td>
        </tr>
      );
    });
    const pagination = Array.from({ length: this.state.noPages }, (_, index) => {
      if ((index + 1) === this.state.curPage) {
        return (
          <li className="page-item active" key={index}>
            <a className="page-link" href="#">{index + 1}</a>
          </li>
        );
      } else {
        return (
          <li className="page-item" key={index}>
            <a className="page-link link" href="#" onClick={() => this.lnkPageClick(index + 1)}>{index + 1}</a>
          </li>
        );
      }
    });
    return (
      <div className='container-fluid' style={{marginTop: '2%'}}>
        <div className='row'>
          <div className="col-sm-8">
            <h2 className="text-center">Danh sách sản phẩm</h2>
            <table className='table table-striped table-hover'>
              <tbody>
                <tr>
                  <th>ID</th>
                  <th>Tên SP</th>
                  <th>Đơn giá</th>
                  <th>Ngày tạo</th>
                  <th>Phân loại</th>
                  <th>Ảnh SP</th>
                </tr>
                {prods}
              </tbody>
            </table>
            <nav aria-label="Page navigation">
              <ul className="pagination">
                <li className="page-item">
                  <a className="page-link" href="#" aria-label="Previous" onClick={() => this.lnkPageClick(this.state.curPage-1)}>
                    <span aria-hidden="true">&laquo;</span>
                    <span className="sr-only">Previous</span>
                  </a>
                </li>
                {pagination}
                <li className="page-item">
                  <a className="page-link" href="#" aria-label="Next" onClick={() => this.lnkPageClick(this.state.curPage+1)}>
                    <span aria-hidden="true">&raquo;</span>
                    <span className="sr-only">Next</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className='col-sm-4'>
            <ProductDetail item={this.state.itemSelected} curPage={this.state.curPage} updateProducts={this.updateProducts} />  
            </div>
          </div>
          
      </div>
    );
  }
  updateProducts = (products, noPages) => { // arrow-function
    this.setState({ products: products, noPages: noPages });
  }
  componentDidMount() {
    this.apiGetProducts(this.state.curPage);
  }
  // event-handlers
  lnkPageClick(index) {
    this.apiGetProducts(index);
  }
  trItemClick(item) {
    this.setState({ itemSelected: item });
  }
  // apis
  apiGetProducts(page) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/products?page=' + page, config).then((res) => {
      const result = res.data;
      this.setState({ products: result.products, noPages: result.noPages, curPage: result.curPage });
    });
  }
}
export default Product;