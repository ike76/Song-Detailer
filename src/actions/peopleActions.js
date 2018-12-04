import { getPeople } from "./apiActions";

export const PEOPLE_FETCHING = "PEOPLE_FETCHING";
export const PEOPLE_ERROR = "PEOPLE_ERROR";
export const PEOPLE_SUCCESS = "PEOPLE_SUCCESS";

export const getAllPeople = () => ({
  type: "PEOPLE",
  payload: getPeople()
});
