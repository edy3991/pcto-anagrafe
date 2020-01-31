import React, {Component} from "react";

/**
 * A form to edit a company's attributes.
 *
 * @author Riccardo Sartori
 *
 * @param {{id:int, name:String, fields:{id:int, name:String, regex:String, value:String}[]}} props.company A list of companies.
 */
class CompanyEdit extends Component {
  constructor(props) {
    super(props);

    const {company} = this.props;
    this.state = {...company};
  }

  handleChangeField = evt => {
    let fields = [...this.state.fields];
    for (let i = 0; i < fields.length; i++) {
      if(fields[i].id === parseInt(evt.target.name)) {
        fields[i].value = evt.target.value;
      }
    }
    this.setState({
      fields
    });
  }

  handleChangeName = evt => {
    this.setState({
      name: evt.target.value
    });
  }

  handleSubmit = evt => {
    evt.preventDefault();
  }

  render() {
    const fields = this.state.fields.map(f => {
      return (
        <tr key={f.id}>
          <td><b>{f.name}</b></td>
          <td><input type="text" value={f.value} name={f.id} onChange={this.handleChangeField} /></td>
        </tr>
      );
    });

    return(
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.name} name="name" onChange={this.handleChangeName} />
          <table>
            <tbody>
              {fields}
            </tbody>
          </table>
          <input type="submit" value="Salva" />
        </form>
      </div>
    );
  }
}

export default CompanyEdit;
