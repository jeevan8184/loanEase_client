import { ALLLOANS, APPROVED, PENDING, REJECTED, TOKEN, USER } from "../constants";

const initState = {
  user: null,
  token: null,
  allLoans:null,
  approved:null,
  rejected:null,
  pending:null
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case USER:
      return { ...state, user: action?.payload };
    case TOKEN:
        localStorage.setItem("token", action.payload);
      return { ...state, token: action?.payload };
    case ALLLOANS:
      return {...state, allLoans: action?.payload };
    case APPROVED:
      return {...state, approved: action?.payload };
    case REJECTED:
      return {...state, rejected: action?.payload };
    case PENDING:
      return {...state, pending: action?.payload };
    case "":
    default:
      return state;
  }
};

export default reducer;


