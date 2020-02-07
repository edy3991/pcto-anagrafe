import axios from "axios";
import {apiUrl} from "./url";
import {getToken} from "../../util/tokenManager";
import {resultAction, selectCompany} from "./resultAction";

export function createCompany(name) {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout
      return;
    }
    dispatch({type: "CHANGECOMPANYR_START_ADD"});

    let payload = new FormData();
    payload.set("REQUEST_METHOD", "POST");
    payload.set("user", getToken());
    payload.set("name", name);
    payload.set("fields", "[]");

    axios.post(apiUrl("/api/company"), payload)
    .then(res => {
      if(res.status === 200 && !res.data.error) {
        dispatch({type: "CHANGECOMPANYR_END_ADD", payload: {id: res.data.id}});
      }
    })
    .catch(e => {
      dispatch({
        type: "CHANGECOMPANYR_END_ERROR",
        error: "Errore di connessione.",
      });
    });
  };
}

export function updateCompany(company) {
  return (dispatch, getState) => {
    const id = getState().company.match.id;

    if(!getToken()) {
      // Logout
      return;
    }

    let payload = new FormData();
    payload.set("REQUEST_METHOD", "PUT");
    payload.set("user", getToken());
    payload.set("id", company.id);
    payload.set("name", company.name);
    payload.set("fields", JSON.stringify(company.fields));

    axios.post(apiUrl("/api/company"), payload)
    .then(res => {
      if(res.status === 200) {
        dispatch({type: "COMPANYR_RESET"});
        dispatch(resultAction());
        dispatch(selectCompany(id));
      }
    })
    .catch(e => {

    });
  };
}
