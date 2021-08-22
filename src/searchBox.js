import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import React from "react";
import {markers_map, zoom_to_marker, animate_marker} from "./index";
import PropTypes from "prop-types";
import {withStyles, makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles(theme => ({
    inputRoot: {
        color: "black",
        fontFamily: "Roboto Mono",
        backgroundColor: "#f2f2f2",
        "& .MuiOutlinedInput-notchedOutline": {
            borderWidth: "2px",
            borderColor: "blue"
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderWidth: "2px",
            borderColor: "blue"
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: "2px",
            borderColor: "blue"
        }
    }
}));


// TODO: update to use async searchbox later
export default function SearchBox(props) {
    const classes = useStyles();
    
    return (
        <Autocomplete
            id="grouped-demo"
            options={props.features}
            classes={classes}
            // groupBy={(option) => option.firstLetter}
            onChange={(event, value) => console.log(value)}
            onHighlightChange={(event, value) => {
                event && animate_marker(markers_map.get(value));
                event && zoom_to_marker(markers_map.get(value));
            }}
            getOptionLabel={(feature) => feature.getProperty('description')}
            style={{width: 300}}
            renderInput={(params) => <TextField {...params} label="Search on the map..." variant="outlined"/>}
        />
    );
}