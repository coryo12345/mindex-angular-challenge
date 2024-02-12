import { Employee } from "src/app/employee";

export const mockEmployees: Employee[] = [
  {
    id: 1,
    firstName: "john",
    lastName: "smith",
    position: "ceo",
    directReports: [2],
  },
  {
    id: 2,
    firstName: "bob",
    lastName: "johnson",
    position: "cto",
    directReports: [3, 4],
  },
  { id: 3, firstName: "sarah", lastName: "hannigan", position: "pm" },
  { id: 4, firstName: "matt", lastName: "parker", position: "developer" },
];
