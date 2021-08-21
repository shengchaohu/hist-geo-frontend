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
let markers = new Map();


function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 5,
        center: new google.maps.LatLng(34.5, 108.5),
        mapTypeId: "terrain",
    });
    
    // default rendering
    generate_map(1368, 4329)
}

function clear_markers() {

}

function generate_map(year, dynasty_id) {
    map.data.loadGeoJson(`http://73.36.166.39:18880/administrative-divisions/?year=${year}&dynasty_id=${dynasty_id}`, null, features => {
        features.map(feature => {
            feature.toGeoJson((feature_geo_json) => {
                let coordinates = feature_geo_json.geometry.coordinates
                let my_LatLng = new google.maps.LatLng(coordinates[1], coordinates[0])
                let marker = new google.maps.Marker({
                    position: my_LatLng,
                    map: map,
                    title: feature_geo_json.properties.description
                });
                markers.set(feature, marker)
            })
        });
    });
    
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
    
    handle_marker_window(map)
    
    // render search bar after each time's map loading/generation
    ReactDOM.render(
        <FilterableProductTable items={map.data}/>,
        document.getElementById('container')
    );
}

// still some logic error with mouse handling...
function handle_marker_window(map) {
    let info_window = new google.maps.InfoWindow();
    
    // Set event listener for each feature.
    // from https://stackoverflow.com/a/24052168
    map.data.addListener('mouseover', function (event) {
        info_window.setContent(event.feature.getProperty('ch_name') + "<br>" + event.feature.getProperty('admin_type') + "<br>" + event.feature.getProperty('description'));
        info_window.setPosition(event.latLng);
        info_window.setOptions({pixelOffset: new google.maps.Size(0, -34)});
        info_window.open(map);
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
                        <option disabled selected value> select a dynasty</option>
                        <option value="14488">Tang（唐）</option>
                        <option value="10989">Song（宋）</option>
                        <option value="3797">Liao（辽）</option>
                        <option value="2814">Jin（金）</option>
                        <option value="16776">Yuan（元）</option>
                        <option value="4329">Ming（明）</option>
                        <option value="6756">Qing（清）</option>
                    </select>
                </label>
                <br/>
                <label>
                    Year:
                    <input name="year" type="number" value={this.state.value} onChange={this.handleInputChange}/>
                </label>
                <input type="submit" value="Submit"/>
            </form>
        );
    }
}

ReactDOM.render(
    <Reservation/>,
    document.getElementById('year_dynasty')
);


// class ProductCategoryRow extends React.Component {
//   render() {
//     const category = this.props.category;
//     return (
//       <tr>
//         <th colSpan="2">
//           {category}
//         </th>
//       </tr>
//     );
//   }
// }

// function animate_marker(event){
//     console.log(event)
//     // let marker = markers.get(item)
//     // marker.setAnimation(google.maps.Animation.BOUNCE);
//   // if (item.getAnimation() != google.maps.Animation.BOUNCE) {
//   //   item.setAnimation(google.maps.Animation.BOUNCE);
//   // } else {
//   //   item.setAnimation(null);
//   // }
// }
//
// function hightlight_row(){
//     // TODO
// }


function zoom_to_marker(marker, zoom_level = 6) {
    map.setCenter(marker.getPosition())
    map.setZoom(zoom_level);
}

function animate_marker(marker, animation = google.maps.Animation.BOUNCE) {
    if (marker.getAnimation() !== google.maps.Animation.BOUNCE) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    } else {
        marker.setAnimation(null);
    }
}


class ProductRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: this.props.item, red: false};
        
        this.handleMarkerHover = this.handleMarkerHover.bind(this);
        this.handleMarkerSelection = this.handleMarkerSelection.bind(this);
        this.toggleRowColor = this.toggleRowColor.bind(this)
    }
    
    toggleRowColor() {
        this.setState({red: !this.state.red});
    }
    
    handleMarkerSelection(event) {
        //
    }
    
    handleMarkerHover(event) {
        let marker = markers.get(this.state.value);
        animate_marker(marker)
        zoom_to_marker(marker);
        this.toggleRowColor();
    }
    
    render() {
        const item = this.props.item;
        const ch_name = item.getProperty('ch_name');
        const description = item.getProperty('description');
        
        return (
            <tr onClick={this.handleMarkerSelection} onMouseEnter={this.handleMarkerHover}
                onMouseLeave={this.handleMarkerHover} style={{background: this.state.red ? "red" : ""}}>
                <td>{ch_name}</td>
                <td>{description}</td>
            </tr>
        );
    }
}

class ProductTable extends React.Component {
    render() {
        const filterText = this.props.filterText;
        const inStockOnly = this.props.inStockOnly;
        
        const rows = [];
        // let lastCategory = null;
        
        this.props.items.forEach((item) => {
            // TODO: should allow more flexible search (pingying and simple/traditional Chinese).
            //  currently only traditional Chinese supported
            if (item.getProperty('ch_name').indexOf(filterText) === -1) {
                // no matched
                return;
            }
            if (inStockOnly && !item.stocked) {
                return;
            }
            // TODO: in the future as we have different types of data to search, can add category in geojson format
            // if (product.category !== lastCategory) {
            //   rows.push(
            //     <ProductCategoryRow
            //       category={product.category}
            //       key={product.category} />
            //   );
            // }
            rows.push(
                <ProductRow
                    item={item}
                    key={item.getProperty('id')}
                />
            );
            // lastCategory = product.category;
        });
        
        return (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
}

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
        this.handleInStockChange = this.handleInStockChange.bind(this);
    }
    
    handleFilterTextChange(e) {
        this.props.onFilterTextChange(e.target.value);
    }
    
    handleInStockChange(e) {
        this.props.onInStockChange(e.target.checked);
    }
    
    render() {
        return (
            <form>
                <input
                    type="text"
                    placeholder="Search..."
                    value={this.props.filterText}
                    onChange={this.handleFilterTextChange}
                />
                <p>
                    <input
                        type="checkbox"
                        checked={this.props.inStockOnly}
                        onChange={this.handleInStockChange}
                    />
                    {' '}
                    Function to be added
                </p>
            </form>
        );
    }
}

class FilterableProductTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterText: '',
            inStockOnly: false,
            selectedItem: ''
        };
        
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
        this.handleInStockChange = this.handleInStockChange.bind(this);
    }
    
    handleFilterTextChange(filterText) {
        this.setState({
            filterText: filterText
        });
    }
    
    handleInStockChange(inStockOnly) {
        this.setState({
            inStockOnly: inStockOnly
        })
    }
    
    render() {
        return (
            <div>
                <SearchBar
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                    onFilterTextChange={this.handleFilterTextChange}
                    onInStockChange={this.handleInStockChange}
                />
                <ProductTable
                    items={this.props.items}
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                />
            </div>
        );
    }
}

export {initMap};




