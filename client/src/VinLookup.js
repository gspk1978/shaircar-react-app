import React, {Component} from 'react';
import './App.css';

class VinLookup extends Component {

constructor(props){
super(props);
this.state = {
    vinnumber:'',
    vinvalidity:'',
    make:'',
    manufacturer:'',
    modelyear:'',
    series:'',
    errorMessage:''
}
}

validateInputs(inputData) {
    let errorMsg = "";
    if(!inputData.vinnumber) {
        errorMsg +="VIN field cannot be empty. Please enter and resubmit";
      }
    if(errorMsg.length==0)
    {
        return true;
    }
    else
    {
        alert(errorMsg);
        return false;
    }
}

captureVin = (event) => {
    this.setState({vinnumber:event.target.value});
}

getVinDetails = (event) => {
    
    if(this.validateInputs(this.state)) {
        fetch('http://localhost:8080/getVinDetails/'+this.state.vinnumber)
        .then(res => res.json())
        .then(data => {
            this.setState({
                vinvalidity:data.vinvaliditystatus,
                make:data.vehiclemake,
                manufacturer:data.vehiclemanufacturer,
                modelyear:data.vehiclemodelyear,
                series:data.vehicleseries
            });
            console.log("Data "+data);
        })
    }
}

render(){
    return (
        <div className="App">
        <form name="searchvin">
        <h1>VIN Search</h1>
        <p>Enter VIN Number:</p>
        <input type="text" name="vinnumber" onChange={this.captureVin}/>
        {this.state.errorMsg}
        <br/>
        <button
          type="button"
          onClick={this.getVinDetails}
        >Get Vin Details</button>
        <p> Vin Validity: {this.state.vinvalidity}</p>
        <p> Vehicle Make: {this.state.make}</p>
        <p> Vehicle Manufacturer: {this.state.manufacturer}</p>
        <p> Vehicle Model Year: {this.state.modelyear}</p>
        <p> Vehicle Series: {this.state.series}</p>
        </form>
        </div>
    );
}
}

export default VinLookup;