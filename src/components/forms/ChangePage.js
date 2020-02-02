import React, {Component} from "react";
import {connect} from "react-redux";
import {increasePage, decreasePage} from "../../redux/actions/searchPageAction";
import {resultAction} from "../../redux/actions/resultAction";

import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

/**
 * A component to change the result page
 *
 * @author Riccardo Sartori
 *
 * @param {int} page         The current page.
 * @param {int} totalResults The results of the search.
 */
class ChangePage extends Component {
  jumpToPage = evt => {
    this.props.updatePage(parseInt(evt.target.value));
    this.props.updateResults();
  }

  changePage = evt => {
    if (evt.target.name === "increase") {
      this.props.increasePage();
    }
    else if (evt.target.name === "decrease") {
      this.props.decreasePage();
    }
    this.props.updateResults();
  }

  render() {
    const {page, totalResults} = this.props;
    const resPerPage = 50;
    const pageNum = Math.ceil(totalResults/resPerPage);
    const renderButtonRange = 2;
    let buttons = [];
    for (let i = 0; i < pageNum; i++) {
      if(i === 0 || i === pageNum-1 || (i > page-renderButtonRange && i < page+renderButtonRange)) {
        let className = "page-selector";
        if(i == page) className += "-selected";
        buttons.push(
          <Button key={i} onClick={this.jumpToPage} className={className} value={i} variant="secondary">{i+1}</Button>
        );
      }
    }

    return (
      <Row className="justify-content-center my-3">
        <ButtonGroup>
          <Button
            onClick={this.changePage}
            name="decrease"
            variant="secondary"
            disabled={page <= 0}>
            &lt;
          </Button>
          {buttons}
          <Button
            onClick={this.changePage}
            name="increase"
            variant="secondary"
            disabled={page >= pageNum-1}>
            &gt;
          </Button>
        </ButtonGroup>
      </Row>
    )
  }
}

function mapStateToProps(state) {
  return {
    page: state.search.page,
    totalResults: state.search.totalResults,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updatePage: (page) => {
      dispatch({type:"SET_PAGE", page});
    },
    decreasePage: () => {
      dispatch(decreasePage());
    },
    increasePage: () => {
      dispatch(increasePage());
    },
    updateResults: () => {
      dispatch(resultAction());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePage);
