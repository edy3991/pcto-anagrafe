import React, {Component} from "react";

class CompanySummary extends Component {
  handleClick = evt => {
    // Show company details...
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
      return <td key={id}>{value}</td>;
    });

    return(
      <tr className="company-summary" onClick={this.handleClick}>
        <td><b>{data.name}</b></td>
        {information}
      </tr>
    );
  }
}

export default CompanySummary;
