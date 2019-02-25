import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

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
      // FIXME: do a pattern check
      return ast.value;
    }
    return ast;
  },
});

export default moveScalar;
