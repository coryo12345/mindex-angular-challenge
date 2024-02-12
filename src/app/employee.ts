export class Employee {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  directReports?: number[];
  compensation?: number; // this might not be defined from the mock backend, so making it number | undefined so the type is accurate.
}
