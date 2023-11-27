import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class CategoryDetail extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtName: ''
    };
  }
  render() {
    return (
      <div>
        <h2 className="text-center">Thêm/ Sửa phân loại</h2>
        <hr></hr>
        <form>
          <center>
          <table>
            <tbody>
              <tr>
                <td style={{padding: 10}}>ID: </td>
                <td><input className='form-control' type="text" value={this.state.txtID} onChange={(e) => { this.setState({ txtID: e.target.value }) }} readOnly={true} /></td>
              </tr>
              <tr>
                <td style={{padding: 10}}>Tên phân loại: </td>
                <td><input className='form-control' type="text" value={this.state.txtName} onChange={(e) => { this.setState({ txtName: e.target.value }) }} /></td>
              </tr>
              <tr>
              </tr>
            </tbody>
          </table>
          <hr></hr>
          <div style={{display:'flex', flexDirection: 'row'}}>
            <div style={{flex: 1}}>
              <input style={{width: '90%'}} className='btn btn-success' type="submit" value="Thêm" onClick={(e) => this.btnAddClick(e)} />
            </div>
            <div style={{flex: 1}}>
              <input style={{width: '90%', marginLeft: '2%', marginRight: '2%'}} className='btn btn-info' type="submit" value="Cập nhật" onClick={(e) => this.btnUpdateClick(e)} /> 
            </div>
            <div style={{flex: 1}}>
              <input style={{width: '90%'}} className='btn btn-danger' type="submit" value="Xoá" onClick={(e) => this.btnDeleteClick(e)} />
            </div>
          </div>
          </center>
        </form>
      </div>
    );
  }

  // event-handlers
  btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    if (id && name) {
      const cate = { name: name };
      this.apiPutCategory(id, cate);
    } else {
      alert('Please input id and name');
    }
  }
  // apis
  apiPutCategory(id, cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/categories/' + id, cate, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY!');
        this.apiGetCategories();
      } else {
        alert('SORRY BABY!');
      }
    });
  }

  // event-handlers
  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;
    if (name) {
      const cate = { name: name };
      this.apiPostCategory(cate);
    } else {
      alert('Vui lòng nhập tên phân loại');
    }
  }
  // event-handlers
  btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm('Bạn chắc chắc muốn xoá phân loại này chứ?')) {
      const id = this.state.txtID;
      if (id) {
        this.apiDeleteCategory(id);
      } else {
        alert('Vui lòng chọn phân loại để xoá');
      }
    }
  }
  // apis
  apiDeleteCategory(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/categories/' + id, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Xoá phân loại thành công!');
        this.apiGetCategories();
      } else {
        alert('Lỗi!');
      }
    });
  }
  // apis
  apiPostCategory(cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/categories', cate, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY!');
        this.apiGetCategories();
      } else {
        alert('SORRY BABY!');
      }
    });
  }
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.props.updateCategories(result);
    });
  }
  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({ txtID: this.props.item._id, txtName: this.props.item.name });
    }
  }


  
}
export default CategoryDetail;