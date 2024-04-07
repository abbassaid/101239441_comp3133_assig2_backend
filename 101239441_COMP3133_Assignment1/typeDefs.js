const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        id: ID
        username: String
        email: String
        password: String
    }

    type Employee {
        id: ID
        firstname: String
        lastname: String
        email: String
        gender: String
        salary: Int
    }

    input LoginInput {
        email: String
        password: String
    }

    input UserInput {
        username: String
        email: String
        password: String
    }

    input EmployeeInput {
        firstname: String
        lastname: String
        email: String
        gender: String
        salary: Int
    }

    type Query {
        login(email: String, password: String): String
        getAllEmployees: [Employee]
        searchEmployeeById(id: ID): Employee
    }

    type Mutation {
        signup(user: UserInput): User
        addEmployee(employee: EmployeeInput): Employee
        updateEmployeeById(id: ID, employee: EmployeeInput): Employee
        deleteEmployeeById(id: ID): String
    }
`;

module.exports = typeDefs;
