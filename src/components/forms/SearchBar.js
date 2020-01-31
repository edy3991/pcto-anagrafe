import React, {Component} from "react";
import SearchField from "./SearchField";
import {connect} from "react-redux";

/**
 * A list of SearchField.
 *
 * This component coordinates its children and sends all their data to their respective reducers.
 *
 * @author Riccardo Sartori
 * @see SearchField
 *
 * @param {{id:int, name:String, regex:String, value:String}[]}                 props.options A list of searchable fields.
 * @param {{id:int, value:String, field:{id:int, name:String, regex:String}}[]} props.search  The current search terms.
 */
class SearchBar extends Component {
  constructor(props) {
    super(props);

    const fields = this.props.search;
    let biggestId = 0;
    for (let i = 0; i < fields.length; i++) {
      if(fields[i].id > biggestId) biggestId = fields[i].id;
    };

    this.state = {
      fields,
      lastId: biggestId + 1,
    };
  }

  handleChange = evt => {
    let fields = [...this.state.fields];
    let changedField = null;
    for (let i = 0; i < fields.length; i++) {
      if(fields[i].id === evt.id) {
        fields[i] = {...evt.target.state};
        changedField = fields[i];
        break;
      }
    }

    this.setState({
      fields
    }, () => {
      this.notifyChange();
      this.props.updateSearchField(changedField);
    });
  }

  addSearchField = evt => {
    const {fields, lastId} = this.state;
    this.setState({
      fields: [
        ...fields,
        {
          id: lastId,
          value: "",
          field: this.props.options[0],
        },
      ],
      lastId: lastId+1,
    }, () => {
      this.notifyChange();

      const {fields} = this.state;
      this.props.addSearchField(fields[fields.length-1]);
    });
  }

  handleDelete = evt => {
    const {id} = evt.target.state;
    const {fields} = this.state;
    this.setState({
      fields: fields.filter(f => f.id !== id),
    }, () => {
      this.notifyChange();
      this.props.deleteSearchField(id);
    });
  }

  notifyChange = () => {
    if(this.props.onChange) {
      this.props.onChange({
        target: this,
      });
    }
  }

  render() {
    const {fields} = this.state;
    const sFields = fields.map(f => {
      return (
        <SearchField
          key={f.id}
          options={this.props.options}
          initState={f}
          onChange={this.handleChange}
          onDelete={this.handleDelete}
        />
      );
    })
    return (
      <form onSubmit={evt => evt.preventDefault()}>
        {sFields}
        <input className="btn" type="button" value="Cerca" onClick={this.addSearchField} />
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    options: state.structure.fields,
    search: state.search.search,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addSearchField: search => {
      dispatch({type: "ADD_SEARCH_FIELD", search});
    },
    deleteSearchField: id => {
      dispatch({type: "DELETE_SEARCH_FIELD", id});
    },
    updateSearchField: search => {
      dispatch({type: "UPDATE_SEARCH_FIELD", search});
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);