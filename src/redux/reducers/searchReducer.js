import update from "immutability-helper";

/**
 * The initial state of the searchReducer store.
 *
 * This store provides access to the data fetched while making searches on the /search route.
 *
 * @author Riccardo Sartori
 *
 * @param {{id:int, value:String, field:{id:int, name:String, regex:String}}[]}                 search          The current search terms.
 * @param {{id:int, name:String, fields:{id:int, name:String, regex:String, value:String}[]}[]} results         The companies to show.
 * @param {int}                                                                                 page            The current page number.
 * @param {int}                                                                                 resultsPerPage  The results to show per page.
 * @param {int}                                                                                 totalResults    The total results the search generated.
 * @param {float}                                                                               lastestSearchId The ID of the last search that was made, useful for bad connection.
 */
const init = {
  search: [],
  results: [],
  page: 0,
  resultsPerPage: 50,
  totalResults: 0,
  lastestSearchId: 0,
};

function searchReducer(state=init, action) {
  let search;
  switch(action.type) {
    case "ADD_SEARCH_FIELD":
      return {
        ...state,
        search: [...state.search, action.search],
      };

    case "DELETE_SEARCH_FIELD":
      const {id} = action;
      search = state.search;
      return {
        ...state,
        search: search.filter(s => s.id !== id),
      };

    case "UPDATE_SEARCH_FIELD":
      search = state.search;
      let updateSearch = action.search;

      let index = null;
      for (let i = 0; i < search.length; i++) {
        if(search[i].id === updateSearch.id) {
          index = i;
          break;
        }
      }
      if(index == null) return state;

      search = update(search, {[index]: {$set: updateSearch}});
      return {
        ...state,
        search
      };

    case "UPDATE_RESULTS":
      return {
        ...state,
        results: action.results,
        totalResults: action.totalResults,
      };

    case "SET_PAGE":
      return {
        ...state,
        page: action.page,
      };

    case "INCREASE_PAGE":
      return {
        ...state,
        page: state.page+1,
      };

    case "DECREASE_PAGE":
      return {
        ...state,
        page: (state.page-1 < 0) ? 0 : state.page-1,
      };

    case "RESET_PAGE":
      return {
        ...state,
        page: 0,
      };

    case "RESET_SEARCH":
      return init;

    case "NOTIFY_BEGIN_SEARCH":
      return {
        ...state,
        lastestSearchId: action.searchId,
      };

    default:
      return state;
  }
}

export default searchReducer;
