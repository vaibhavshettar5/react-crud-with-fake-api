import React, { Component } from "react";
import "./App.css";
import axios from 'axios';

axios.interceptors.response.use(null, error=>{
  const expectError = error.response && error.response.status >= 400 & error.response.status <500;

  if(!expectError){
    console.log("Loging the error", error);
    alert("Unexpected error");
  }
  return Promise.reject(error);
})


class App extends Component { 
  state = {
    posts: [],
    title: '',
    body: ''
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  async componentDidMount(){
   const promise = await axios.get('https://jsonplaceholder.typicode.com/posts');
   const {data : posts} = promise;//object destructuring
   this.setState({
     posts: posts
   })
  }

  handleAdd = async() => {
    console.log(this.state.title+" "+this.state.body);
    const obj ={ title: this.state.title, body: this.state.body };
    try{
      const {data: post} = await axios.post('https://jsonplaceholder.typicode.com/posts',obj);
      const posts = [post, ...this.state.posts];
      this.setState({
        posts
      })
    }
    catch(e){
      alert("Something went wrong "+e);
    }   
    
  };

  handleUpdate = async post => {
    post.title = "UPDATED";
    const {data} = await axios.put('https://jsonplaceholder.typicode.com/posts/' + post.id, post);
    const posts = [...this.state.posts];
    const index = posts.indexOf(post);
    posts[index] = {...data};
    this.setState({
      posts
    })
  };

  handleDelete = async post => {
    const originalPost = this.state.posts;
    const posts = this.state.posts.filter(p => p.id !== post.id);
    this.setState({
      posts
    })
    try{
      await axios.delete('https://jsonplaceholder.typicode.com/posts/' + post.id);
      //throw("error");
    }
    catch(ex){
      if(ex.response && ex.response.status === 404){
        alert("This post is already deleted");
      }
      this.setState({
        posts: originalPost
      })
   }
  
  };

  render() {
    return (
      <React.Fragment>
        <input type="text" name="title" placeholder="title" value={this.state.title} onChange={this.handleChange} />
        <input type="text" name="body" placeholder="body" value={this.state.body} onChange={this.handleChange} />
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
