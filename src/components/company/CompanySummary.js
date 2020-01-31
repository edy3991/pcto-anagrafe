import React, {Component} from "react";
import {withRouter} from "react-router-dom";

/**
 * A short table row describing certain company attributes.
 *
 * The attributes shown are chosen with the current search terms.
 *
 * @author Riccardo Sartori
 *
 * @param {{id:int, name:String, fields:{id:int, name:String, regex:String, value:String}[]}} props.data   A single company object.
 * @param {{id:int, value:String, field:{id:int, name:String, regex:String}}[]}               props.search The parameters in the search.
 */
class CompanySummary extends Component {
  handleClick = evt => {
    this.props.history.push("/company/" + this.props.data.id);
  }

  render() {
    const {data, search} = this.props;

    let uniqueFields = [];
    for (let i = 0; i < search.length; i++) {
      if(!uniqueFields.includes(search[i].field.id) && search[i].field.id !== 0) {
        uniqueFields.push(search[i].field.id);
      }
    }

    const information = uniqueFields.map(id => {
      let value = null;
      for (let i = 0; i < data.fields.length; i++) {
        if(data.fields[i].id === id) value=data.fields[i].value;
      }
      return <td key={id}>{value ? value : "N/A"}</td>;
    });

    return(
      <tr className="company-summary" onClick={this.handleClick}>
        <td><b>{data.name}</b></td>
        {information}
      </tr>
    );
  }
}

export default withRouter(CompanySummary);