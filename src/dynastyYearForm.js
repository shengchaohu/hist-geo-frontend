import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {generate_map} from "./index";


const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        background: "rgb(232, 241, 250)",
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 100,
    },
    button: {
        '& > *': {
            margin: theme.spacing(1),
            marginRight: 'auto',
        },
    },
    text_field: {
        '& > *': {
            margin: theme.spacing(1),
            width: '10ch',
            marginLeft: 'auto',
        },
    },
});


class Dynasty extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
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
        const {classes} = this.props;
        return (
            <form className={classes.root} autoComplete="off">
                <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel>Dynasty</InputLabel>
                    <Select
                        name="dynasty_id"
                        type="number"
                        value={this.state.value}
                        onChange={this.handleInputChange}
                        defaultValue=""
                    >
                        <MenuItem value={14488}>Tang（唐）</MenuItem>
                        <MenuItem value={10989}>Song（宋）</MenuItem>
                        <MenuItem value={3797}>Liao（辽）</MenuItem>
                        <MenuItem value={2814}>Jin（金）</MenuItem>
                        <MenuItem value={16776}>Yuan（元）</MenuItem>
                        <MenuItem value={4329}>Ming（明）</MenuItem>
                        <MenuItem value={6756}>Qing（清）</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    name="year"
                    label="Year"
                    value={this.state.value}
                    onChange={this.handleInputChange}
                    variant="filled"
                    className={classes.text_field}
                >
                </TextField>
                <Button color="primary" onClick={this.handleSubmit} className={classes.button}>
                    Submit
                </Button>
            </form>
        );
    }
}

Dynasty.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dynasty);
