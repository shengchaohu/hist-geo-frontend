import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import React from "react";
import {markers, zoom_to_marker, animate_marker} from "./index";

// can update to use async searchbox later
export default function SearchBox(props) {
    return (
        <Autocomplete
            id="grouped-demo"
            options={props.features}
            // groupBy={(option) => option.firstLetter}
            onChange={(event, value) => console.log(value)}
            onHighlightChange={(event, value) => {
                // event && animate_marker(markers.get(value));
                event && zoom_to_marker(markers.get(value));
            }}
            getOptionLabel={(feature) => feature.getProperty('description')}
            style={{width: 300}}
            renderInput={(params) => <TextField {...params} label="With categories" variant="outlined"/>}
        />
    );
}