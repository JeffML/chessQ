import {GraphQLScalarType} from 'graphql';
import {Kind} from 'graphql/language';

const moveScalar = new GraphQLScalarType({
  name: 'Move',
  description: 'chess move',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      //TODO: do a pattern check
      return ast.value 
    }
  }
});

export default moveScalar; 
