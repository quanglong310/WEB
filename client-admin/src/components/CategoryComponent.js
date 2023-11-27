import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CategoryDetail from './CategoryDetailComponent';

class Category extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null
    };
  }
  render() {
    const cates = this.state.categories.map((item) => {
      return (
        <tr key={item._id} onClick={() => this.trItemClick(item)}>
          <td>{item._id}</td>
          <td>{item.name}</td>
        </tr>
      );
    });
    return (
      <div class="container" style={{marginTop: '2%'}}>
        <div class="row">
          <div class="col-sm-6">
            <h2 className="text-center">Quản lý phân loại</h2>
            <table className="table table-striped table-hover">
              <tbody>
                <tr>
                  <th>ID</th>
                  <th>Phân loại</th>
                </tr>
                {cates}
              </tbody>
            </table>
          </div>
          <div class="col-sm-6">
          <CategoryDetail item={this.state.itemSelected} updateCategories={this.updateCategories} />
          </div>
        </div>
      </div>
    );
  }
  updateCategories = (categories) => { // arrow-function
    this.setState({ categories: categories });
  }

  componentDidMount() {
    this.apiGetCategories();
  }
  // event-handlers
  trItemClick(item) {
    this.setState({ itemSelected: item });
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
export default Category;