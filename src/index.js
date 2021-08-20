/*
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
import "./style.css";

import 'core-js/es/map';
import 'core-js/es/set';

import React from 'react';
import ReactDOM from 'react-dom';


let map;

const base_request_url = "http://73.36.166.39:18880/administrative-divisions/"

function initMap() {
  let infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5,
    center: new google.maps.LatLng(34.5, 108.5),
    mapTypeId: "terrain",
  });
}

function clear_map(){

}

function generate_map(year, dynasty_id) {
    let infowindow = new google.maps.InfoWindow();

    map.data.loadGeoJson(
      `http://73.36.166.39:18880/administrative-divisions/?year=${year}&dynasty_id=${dynasty_id}`
    );

    // render styling (color and so on)
    // map.data.setStyle(feature => {
    //   let letter = feature.getProperty('letter');
    //   let color = "gray";
    //   if (["G", "e"].includes(letter)) {
    //     color = "green";
    //   }
    //   return {
    //     fillColor: color,
    //     strokeWeight: 1
    //   }
    // });

    // Set event listener for each feature.
    // from https://stackoverflow.com/a/24052168
    map.data.addListener('click', function(event) {
    infowindow.setContent(event.feature.getProperty('ch_name')+"<br>"+event.feature.getProperty('admin_type')+"<br>"+event.feature.getProperty('description'));
    infowindow.setPosition(event.latLng);
    infowindow.setOptions({pixelOffset: new google.maps.Size(0,-34)});
    infowindow.open(map);
  });
}

class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    console.log(this.state)
    generate_map(this.state["year"], this.state["dynasty_id"])
    event.preventDefault();
  }

  handleInputChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Dynasty is:
          <select name="dynasty_id" value={this.state.value} onChange={this.handleInputChange}>
            <option disabled selected value> select a dynasty </option>
            <option value="14488">Tang（唐）</option>
            <option value="10989">Song（宋）</option>
            <option value="3797">Liao（辽）</option>
            <option value="2814">Jin（金）</option>
            <option value="16776">Yuan（元）</option>
            <option value="4329">Ming（明）</option>
            <option value="6756">Qing（清）</option>
          </select>
        </label>
        <br />
        <label>
          Year:
          <input name="year" type="number" value={this.state.value} onChange={this.handleInputChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

ReactDOM.render(
  <Reservation />,
  document.getElementById('search')
);

export {initMap};




