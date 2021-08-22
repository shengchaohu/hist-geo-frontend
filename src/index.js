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

import axios from 'axios';

import React from 'react';
import ReactDOM from 'react-dom';
import ButtonAppBar from "./appBar";


let map;
let markers_list = [];
let markers_map = new Map();
let all_features = [];
let mark_cluster;


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
    for (let [k, v] of markers_map) {
        // must do both to remove a marker
        v.setMap(null);
        map.data.remove(k)
    }
    markers_map = new Map();
    all_features = [];
    markers_list = [];
    mark_cluster && mark_cluster.clearMarkers();
}

function restore_map_options() {
    map.setOptions({
        zoom: 5,
        center: new google.maps.LatLng(34.5, 108.5),
        mapTypeId: "terrain",
    })
}

function generate_map(year, dynasty_id) {
    clear_markers();
    restore_map_options();
    
    axios.get(`http://73.36.166.39:18880/administrative-divisions/?year=${year}&dynasty_id=${dynasty_id}`)
        .then(function (response) {
            
            all_features = map.data.addGeoJson(response.data);
            map.data.setStyle({visible: false});
            
            // handle_marker_window(map);
            
            markers_list = all_features.map(feature => {
                let marker = new google.maps.Marker({
                    position: feature.getGeometry().get(0),
                    data: feature,
                    map: map,
                    title: feature.getProperty("description"),
                });
                markers_map.set(feature, marker);
                handle_marker_window(marker)
                return marker
            });
            
            // TODO: can add more interesting options like onmouseover
            mark_cluster = new MarkerClusterer(map, markers_list, {
                imagePath:
                    "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
                maxZoom: 9,
                minimumClusterSize: 3,
            });
            
            ReactDOM.render(
                <ButtonAppBar features={all_features}/>,
                document.getElementById('app_bar')
            );
        })
        .catch(function (error) {
            console.log(error);
        });
}

function zoom_to_marker(marker, zoom_level = 9) {
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

// still some logic error with mouse handling...maybe due to async
// function handle_marker_window(map) {
//     let info_window = new google.maps.InfoWindow();
//
//     // Set event listener for each feature.
//     // from https://stackoverflow.com/a/24052168
//     map.data.addListener('click', function (event) {
//         info_window.setContent(event.feature.getProperty('ch_name') + "<br>" + event.feature.getProperty('admin_type') + "<br>" + event.feature.getProperty('description'));
//         info_window.setPosition(event.latLng);
//         info_window.setOptions({pixelOffset: new google.maps.Size(0, -34)});
//         info_window.open(map);
//     });
// }

function handle_marker_window(marker) {
    let info_window = new google.maps.InfoWindow();
    
    // Set event listener for each feature.
    // from https://stackoverflow.com/a/24052168
    marker.addListener('mouseover', function () {
        let feature = marker.data;
        info_window.setContent(feature.getProperty('ch_name') + "<br>" + feature.getProperty('admin_type') + "<br>" + feature.getProperty('description'));
        info_window.setPosition(marker.position);
        info_window.setOptions({pixelOffset: new google.maps.Size(0, -34)});
        info_window.open(map);
    });
    
    marker.addListener('mouseout', function () {
        info_window.close();
    });
}

export {initMap};
export {generate_map};
export {zoom_to_marker, animate_marker};
export {markers_map};




