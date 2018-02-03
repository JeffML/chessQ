import casual from 'casual';
import RandExp from 'randexp';
import {MockList} from 'graphql-tools';

const optionTypes = {
  "SpinOption": "spin",
  "ButtonOption": "button",
  "CheckOption": "check",
  "ComboOption": "combo"
}

export default {
  String: () => "acknowledged",
  EngineResponse: () => ({
    engineId: () => casual.uuid,
    state: 'CREATED'
  }),
  UciResponse: () => ({
    identity: {
      name: casual.title,
      author: casual.full_name
    },
    options: () => new MockList([2, 5])
  }),
  Option: () => ({
    __typename: casual.random_element(["SpinOption", "ButtonOption", "CheckOption", "ComboOption"]),
    name: casual.title,
    type: function() {
      return optionTypes[this.__typename]
    }
  })
}
