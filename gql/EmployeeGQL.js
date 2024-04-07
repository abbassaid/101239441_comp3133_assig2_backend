const { gql } = require("apollo-server");
const Employee = require("../models/Employee");

const EmployeeTypeDefs = gql`
  #graphql

  type Employee {
    id: String!
    firstName: String!
    lastName: String!
    email: String!
    gender: String!
    salary: Float!
  }

  type Query { # Display data
    employees: [Employee] #return all employees
    employeeById(id: String!): Employee # return a single employee by id
  }

  type EmpResponse { # response message
    message: String!
    employee: Employee!
  }

  type DeleteMessage {
    message: String!
  }

  type Mutation { # CRUD operations
    addEmployee(
      firstName: String!
      lastName: String!
      email: String!
      gender: String!
      salary: Float!
    ): EmpResponse # add a new employee

    updateEmployeebyId(
      id: String!
      
      #optional fields as we only update the fields that we want
      firstName: String
      lastName: String
      email: String
      gender: String
      salary: Float
    ): EmpResponse # update an employee by id
    
    deleteEmployeebyId(id: ID!): DeleteMessage # delete an employee by id
  }
`;
// data types that we have are
// int,float,string,boolean, ID

// ! means that the field is required
// if we don't put ! then the field is optional and can be null

const EmployeeResolvers = {
  Query: {
    employees: async () => {
      try {
        const allEmployees = await Employee.find().exec();
        return allEmployees;
      } catch (err) {
        throw new Error(err);
      }
    },

    employeeById: async (parent, { id }) => {
      try {
        const employee = await Employee.findById(id).exec();
        
        //if employee is not found
        if (!employee) {
          throw new Error(`Employee ${id} is not found`);
        }

        return employee;
        
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    addEmployee: async (parent, args) => {
      try {
        // search if employee already exists
        const existingEmployee = await Employee.findOne({
          email: args.email,
        }).exec();
        
        if (existingEmployee) {
          throw new Error("Employee already exists");
        }else{

          const newEmployee = new Employee({
            ...args, //spread operator to get all the fields
          });
  
          const savedEmp = await newEmployee.save();

          if (savedEmp) {
            return {
              message: `Employee ${savedEmp.firstName} has been successfully added`,
              employee: savedEmp,
            };
          }
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    updateEmployeebyId: async (parent, args) => {
      try {
        const updatedEmp = await Employee.findByIdAndUpdate(
          args.id,
          {
            ...args,
          },
          { new: true }
        ).exec(); //new: true returns the updated document

        if (updatedEmp) {
          return {
            message: `Employee ${updatedEmp.firstName} has been successfully updated`,
            employee: updatedEmp,
          };
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    deleteEmployeebyId: async (parent, { id }) => {
      try {
        const deletedEmp = await Employee.findByIdAndDelete(id).exec();
        return {
          message: `Employee ${deletedEmp.id} has been successfully deleted`,
        };
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

module.exports = { EmployeeTypeDefs, EmployeeResolvers };