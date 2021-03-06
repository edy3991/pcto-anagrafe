import React, {Component, Fragment} from "react";
// Custom Components
import GenericModifier from "../forms/inline/GenericModifier";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTrashAlt, faPlus} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

/**
 * A class that represents a list of allowed values.
 *
 * @author Riccardo Sartori
 *
 * @param {Field}    props.field     The field to represent.
 * @param {function} props.onChange  A handler for when the field is changed.
 */
class StructureEnumField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      field: {...this.props.field},
      newValue: "",
      modifying: null,
    };
  }

  regexToArray(regex) {
    const splitItems = regex.substring(1, regex.length-1).split(/([^\\])\|/);
    const ret = [];
    for (let i = 1; i < splitItems.length; i+=2) {
      ret.push(splitItems[i-1] + splitItems[i]);
    }
    const lastItem = splitItems[splitItems.length-1];
    if(lastItem.length === 0) {
      return [];
    }
    ret.push(lastItem);
    return ret;
  }

  notifyChange = () => {
    if(this.props.onChange) {
      const {field, newValue} = this.state;
      this.props.onChange({
        field,
        value: newValue,
      });
    }
  }

  finishHandler = (evt) => {
    const {field, modifying} = this.state;
    let options = this.regexToArray(field.regex);
    options[modifying] = evt.value;
    const newRegex = "(" + options.join("|") + ")";
    this.setState({
      field: {
        ...this.props.field,
        regex: newRegex,
      },
      modifying: null,
      newValue: "",
    }, this.notifyChange);
  }

  onChange = (evt) => {
    this.setState({
      newValue: evt.target.value,
    });
  }

  addOption = (evt) => {
    evt.preventDefault();
    const {newValue} = this.state;
    if(newValue.length === 0 || !this.isValid(newValue)) {
      return;
    }

    const {field} = this.state;
    let options = this.regexToArray(field.regex);
    options.push(this.state.newValue);
    const newRegex = "(" + options.join("|") + ")";
    this.setState({
      field: {
        ...this.props.field,
        regex: newRegex,
      },
      newValue: "",
    }, this.notifyChange);
  }

  startModifying = (i) => {
    this.setState({
      modifying: i,
    });
  }

  deleteField = (i) => {
    const {field} = this.state;
    let options = this.regexToArray(field.regex);
    options.splice(i, 1);
    const newRegex = "(" + options.join("|") + ")";
    this.setState({
      field: {
        ...this.state.field,
        regex: newRegex,
      },
    }, this.notifyChange);
  }

  createDeleteHandler = (i) => {
    return () => {
      this.deleteField(i);
    };
  }

  createModifyHandler = (i) => {
    return () => {
      this.startModifying(i);
    };
  }

  isValid = (string) => {
    const forbidden = ".([{*+?^$\\/|";
    for (let i = 0; i < forbidden.length; i++) {
      if(string.includes(forbidden.charAt(i))) {
        return false;
      }
    }
    return true;
  }

  render() {
    const {field, modifying} = this.state;
    const options = this.regexToArray(field.regex);

    let bodyContent;
    if(options.length > 0) {
      const listItems = options.map((o, i) => {
        if(modifying === i) {
          return (
            <GenericModifier key={i} value={o} onFinish={this.finishHandler} validator={this.isValid} />
          );
        }
        else {
          return (
            <ListGroup.Item key={i}>
              {o}
              {modifying ? null : <FontAwesomeIcon icon={faPen} className="icon-button mx-2" onClick={this.createModifyHandler(i)} />}
              {modifying ? null : <FontAwesomeIcon icon={faTrashAlt} className="icon-button" onClick={this.createDeleteHandler(i)} />}
            </ListGroup.Item>
          );
        }
      });

      bodyContent = (
        <ListGroup variant="flush">
          {listItems}
        </ListGroup>
      );
    }
    else {
      bodyContent = (
        <p className="text-center">Nessun valore</p>
      );
    }

    const inputIsValid = this.isValid(this.state.newValue);
    return (
      <Fragment>
        <h5 className="text-center">Valori permessi</h5>

        {bodyContent}

        <Form className="mt-4" onSubmit={this.addOption}>
          <Form.Row>
            <Col>
              <Form.Control
                type="text"
                placeholder="Nuovo..."
                value={this.state.newValue}
                onChange={this.onChange}
                className={inputIsValid ? "" : "input-field-invalid"}
              />
            </Col>

            <Col xs="auto">
              <Button type="submit" onClick={this.addOption}>
                <FontAwesomeIcon icon={faPlus} className="text-white" />
              </Button>
            </Col>
          </Form.Row>
        </Form>
      </Fragment>
    );
  }
}

StructureEnumField.default = "()";
StructureEnumField.regex = /^\([^?].*\)$/;
StructureEnumField.fieldTypeName = "Valore fisso";

export default StructureEnumField;
