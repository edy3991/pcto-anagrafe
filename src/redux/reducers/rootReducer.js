import searchReducer from "./searchReducer";
import structureReducer from "./structureReducer";
import companyReducer from "./companyReducer";
import authReducer from "./authReducer";
import {combineReducers} from "redux";

/**
 * A reducer that packs all other reducers.
 *
 * @author Riccardo Sartori
 */
const rootReducer = combineReducers({
  search: searchReducer,
  structure: structureReducer,
  company: companyReducer,
  auth: authReducer,
});

export default rootReducer;