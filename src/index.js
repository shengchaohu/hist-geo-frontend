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
import ButtonAppBar from "./appBar";


let map;
let markers = new Map();
let all_features = [];


function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 5,
        center: new google.maps.LatLng(34.5, 108.5),
        mapTypeId: "terrain",
    });
    
    // default rendering
    // generate_map(1368, 4329)
    
    ReactDOM.render(
        <ButtonAppBar features={all_features}/>,
        document.getElementById('app_bar')
    );
}

function clear_markers() {
    for (let [k, v] of markers) {
        // must do both to remove a marker
        v.setMap(null);
        map.data.remove(k)
    }
    markers = new Map();
}

function generate_map(year, dynasty_id) {
    clear_markers()
    
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
                markers.set(feature, marker);
                all_features.push(feature);
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
}

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

export {initMap};
export {generate_map};
export {zoom_to_marker, animate_marker};
export {markers};




