const Bill = require('../models/Bill');
const Category = require('../models/Category');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLEnumType,
} = require('graphql');

// Category Type
const CategoryType = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  })
});

// Bill Type
const BillType = new GraphQLObjectType({
  name: 'Bill',
  fields: () => ({
    id: { type: GraphQLID },
    description: { type: GraphQLString },
    time: { type: GraphQLString },
    type: { type: GraphQLString },
    amount: { type: GraphQLInt },
    category: {
      type: CategoryType,
      resolve(parent, args) {
        return Category.findById(parent.categoryId)
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    bills: {
      type: new GraphQLList(BillType),
      resolve(parent, args) {
        return Bill.find();
      }
    },
    bill: {
      type: BillType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Bill.findById(args.id);
      }
    },
    categories: {
      type: new GraphQLList(CategoryType),
      resolve(parent, args) {
        return Category.find();
      }
    },
    category: {
      type: CategoryType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Category.findById(args.id)
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCategory: {
      type: CategoryType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const category = new Category({
          name: args.name,
        })

        return category.save();
      }
    },
    deleteCategory: {
      type: CategoryType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Category.findByIdAndRemove(args.id);
      },
    },
    addBill: {
      type: BillType,
      args: {
        description: { type: GraphQLNonNull(GraphQLString) },
        time: { type: GraphQLNonNull(GraphQLString) },
        type: { 
          type: new GraphQLEnumType({
            name: 'BillKind',
            values: {
              'Expense': { value: 'Expense' },
              'Income': { value: 'Income' },
            }
          })
        },
        amount: { type: GraphQLNonNull(GraphQLInt) },
        categoryId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const bill = new Bill({
          description: args.description,
          time: args.time,
          type: args.type,
          amount: args.amount,
          categoryId: args.categoryId,
        })

        return bill.save();
      }
    },
    deleteBill: {
      type: BillType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Bill.findByIdAndRemove(args.id);
      },
    },
    updateBill: {
      type: BillType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        description: { type: GraphQLString },
        amount: { type: GraphQLInt },
        time: { type: GraphQLString },
        type: {
          type: new GraphQLEnumType({
            name: 'BillKindUpdate',
            values: {
              'Expense': { value: 'Expense' },
              'Income': { value: 'Income' },
            }
          })
        },
      },
      resolve(parent, args) {
        return Bill.findByIdAndUpdate(
          args.id,
          {
            $set: {
              description: args.description,
              amount: args.amount,
              time: args.time,
              type: args.type,
            }
          },
          {
            new: true
          }
        );
      }
    },
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
})