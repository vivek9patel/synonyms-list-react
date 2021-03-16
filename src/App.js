import React, { Component } from 'react';
import './App.css';
import firebase from './Firebase';
import $ from "jquery";

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
    this.unsubscribe = this.docRef.orderBy('word','asc').onSnapshot(this.updateCollection); // starts the stream from firebase database
  }

  generateSeachLink = (wordName) => {
    wordName = encodeURIComponent(wordName.trim())
    return `https://www.google.com/search?q=define%20${wordName}`
  }

  printSynonyms = (synonymsListArray) => {
    let strJsx = []
    for(let i = 0;i<synonymsListArray.length;i++){
      let synonym = synonymsListArray[i];
      if(synonym.includes(" ")){
        strJsx.push(<b key={i}>"{synonym}"</b>)
      }
      else strJsx.push(<span style={{color: "green"}} key={i}>{synonym}</span>)
      if(i !== synonymsListArray.length - 1) strJsx.push(", ")
    }
    return strJsx;
  }

  convertToArray = (synonymsString) => {
    let currentStr = "", stringArray = []
    let descStarted = false;
    for(let i = 0;i<synonymsString.length;i++){
      if((synonymsString[i] === " " || synonymsString[i] === ",") && descStarted === false){
        if(currentStr.length !== 0){
          stringArray.push(currentStr)
          currentStr = ""
        }
      }
      else if(synonymsString[i] === "\""){
        if(descStarted === false){
          descStarted = true;
        }
        else{
          descStarted = false;
          if(currentStr.length !== 0){
            stringArray.push(currentStr)
            currentStr = ""
          }
        }
      }
      else{
        currentStr += synonymsString[i]
      }
    }
      if(currentStr.length !== 0){
        stringArray.push(currentStr)
        currentStr = ""
      }
    return stringArray;
  }

  onSubmit = (e)=>{
    e.preventDefault();
    const { addedWord, addedAuthor, addedSynonyms } = this.state;

    let synonymsListArray = this.convertToArray(addedSynonyms);

    this.docRef.add({
      word: addedWord,
      synonyms: synonymsListArray,
      author: addedAuthor,
      time: new Date()
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
    // close modal
    $('#exampleModal').modal('toggle');
  }

  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  render() {

    const { addedWord, addedAuthor, addedSynonyms } = this.state;

    return (
      <div className="container mt-4">
        {/* Popup Modal */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Add Word to List</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label htmlFor="title">Word:</label>
                  <input type="text" className="form-control" name="addedWord" value={addedWord} onChange={this.onChange} placeholder="Type Word Name" required/>
                </div>
                <div className="form-group">
                  <label htmlFor="description">Synonyms:</label>
                  <textarea className="form-control" name="addedSynonyms" value={addedSynonyms} onChange={this.onChange} placeholder="Add 'Synonyms' seperated by space and 'Description' between comma" cols="80" rows="3" required>{addedSynonyms}</textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="author">Author:</label>
                  <input type="text" className="form-control" name="addedAuthor" value={addedAuthor} onChange={this.onChange} placeholder="Enter Your Name" required/>
                </div>
                <button type="submit" className="btn btn-success">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
        {/* Word Table */}
        <div className="panel panel-default">
          <div className="panel-heading d-flex justify-content-between">
            <h3 className="panel-title">
              Words List
            </h3>
            <h4>
              <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                Add Word
              </button>  
            </h4>
          </div>
          <div className="panel-body">
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
                    <td>{this.printSynonyms(word.synonyms)}</td>
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
