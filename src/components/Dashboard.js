import React, { Component } from 'react'
import { dataRef } from '../config/constants.js';
import DisplayWorldWind from './DisplayWorldWind.js';
import CurrentFieldDisplay from './CurrentFieldDisplay.js';
import FieldsContainer from './FieldsContainer.js';
import Weather from './Weather.js';
import '../styles/Dashboard.css';
import {Row, Col} from 'react-bootstrap';

export default class Dashboard extends Component {
    constructor(){
        super();
        this.state = Object.assign({
            items: [],
            fieldSnapshot: {},
            highlightedField: null,
            dataDisplayed: false
        });
        this.changeSelection = this.changeSelection.bind(this);
        this.handleCloseClick = this.handleCloseClick.bind(this);
        this.updateData = this.updateData.bind(this);
    }

    componentWillMount(){
        let that = this;
        dataRef.once('value').then(
            (snapshot) => 
                    that.setState({
                        fieldSnapshot: snapshot,
                        }) 
        );
    }

    updateData(){
        let that = this;
        dataRef.once('value').then(
            (snapshot) => 
                    that.setState({
                        fieldSnapshot: snapshot,
                        }) 
        );
    }
    
    changeSelection(fieldId){
        this.setState({
            highlightedField: fieldId
        });
    }

    handleCloseClick(e){
        this.setState({
            highlightedField: null,
            dataDisplayed:false
        });
    }
  
    render () {
        let currentFieldPanel = this.state.highlightedField ? 
                               <div id="right-panel"> 
                                    <CurrentFieldDisplay updateData={this.updateData} close={this.handleCloseClick} fieldSnapshot={this.state.fieldSnapshot} highlightedField={this.state.highlightedField}/> 
                                </div>
                                : null;
        return (
            <div id="dashboard">
                <div id="left-panel">
                    <a href="/newfield" className="btn btn-success create">+ Create new field</a>
                    <FieldsContainer fieldSnapshot={this.state.fieldSnapshot} updateSelection={this.changeSelection.bind(this)} selectedField={this.state.highlightedField} />
                    <Weather></Weather>
                </div>
                <div id="globe-holder">
                     <DisplayWorldWind fieldSnapshot={this.state.fieldSnapshot} updateSelection={this.changeSelection.bind(this)} highlightedField={this.state.highlightedField}></DisplayWorldWind>
                </div>
                {currentFieldPanel}
            </div>   
        )
    }
}