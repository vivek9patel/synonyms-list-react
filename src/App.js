import React, { Component } from 'react';
import './App.css';
import firebase from './Firebase';

export class App extends Component {

  constructor(props) {
    super(props);
    this.docRef = firebase.firestore().collection('words_list');
    this.unsubscribe = null;
    this.state = {
      words: [],
      addedWord: "",
      addedAuthor: "",
      addedSynonyms: ""
    };
  }

  updateCollection = (querySnapshot) => {
    const words = [];
    querySnapshot.forEach((doc) => {
      const { word, synonyms, author, time } = doc.data();
      words.push({
        key: doc.id,
        word, // DocumentSnapshot
        synonyms,
        time,
        author,
      });
    });
    this.setState({
      words
   });
  }

  componentDidMount() {
    this.unsubscribe = this.docRef.onSnapshot(this.updateCollection); // starts the stream from firebase database
  }

  generateSeachLink = (wordName) => {
    wordName = encodeURIComponent(wordName.trim())
    return `https://www.google.com/search?q=define%20${wordName}`
  }

  onSubmit = (e)=>{
    e.preventDefault();
    const { addedWord, addedAuthor, addedSynonyms } = this.state;

    let synonymsListArray = addedSynonyms.split(' ');

    this.docRef.add({
      word: addedWord,
      synonyms: synonymsListArray,
      author: addedAuthor,
      time: new Date()
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  }

  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  render() {

    const { addedWord, addedAuthor, addedSynonyms } = this.state;

    return (
      <div className="container">
        {/* Popup Modal */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label htmlFor="title">Word:</label>
                  <input type="text" className="form-control" name="addedWord" value={addedWord} onChange={this.onChange} placeholder="Type Word Name" />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Synonyms:</label>
                  <textarea className="form-control" name="addedSynonyms" value={addedSynonyms} onChange={this.onChange} placeholder="Add Synonyms seperated by space" cols="80" rows="3">{addedSynonyms}</textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="author">Author:</label>
                  <input type="text" className="form-control" name="addedAuthor" value={addedAuthor} onChange={this.onChange} placeholder="Enter Your Name" />
                </div>
                <button type="submit" className="btn btn-success">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
        {/* Word Table */}
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">
              Words List
            </h3>
          </div>
          <div className="panel-body">
            <h4>
            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
              Add Word
            </button>  
            </h4>
            <table className="table table-stripe">
              <thead>
                <tr>
                  <th>Word</th>
                  <th>Synonyms</th>
                  <th>Added By</th>
                </tr>
              </thead>
              <tbody>
                {this.state.words.map(word =>
                  <tr key={word.key}>
                    <td><a rel="noreferrer" href = {this.generateSeachLink(word.word)} target="_blank" title = {`More Info about '${word.word}'`}>{word.word}</a></td>
                    <td>{word.synonyms}</td>
                    <td>{word.author}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default App
