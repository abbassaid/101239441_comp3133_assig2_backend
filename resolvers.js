const User = require("./models/UserModel");
const Employee = require("./models/EmployeeModel");

const resolvers = {
    Query: {
        login: async (_, { email, password }) => {
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }

            const isPasswordMatch = await user.isPasswordMatch(password);
            if (!isPasswordMatch) {
                throw new Error('Invalid credentials');
            }

            return 'Logged in successfully';
        },
        getAllEmployees: async () => {
            return await Employee.find({});
        },
        searchEmployeeById: async (_, { id }) => {
            return await Employee.findById(id);
        },
    },
    Mutation: {
        signup: async (_, { user }) => {
            const newUser = await User.create(user);
            return newUser;
        },
        addEmployee: async (_, { employee }) => {
            const newEmployee = await Employee.create(employee);
            return newEmployee;
        },
        updateEmployeeById: async (_, { id, employee }) => {
            const updatedEmployee = await Employee.findByIdAndUpdate(id, employee, { new: true });
            if (!updatedEmployee) {
                throw new Error('Employee not found');
            }
            return updatedEmployee;
        },
        deleteEmployeeById: async (_, { id }) => {
            const deletedEmployee = await Employee.findByIdAndDelete(id);
            if (!deletedEmployee) {
                throw new Error('Employee not found');
            }
            return 'Employee deleted successfully';
        },
    },
};

module.exports = resolvers;
