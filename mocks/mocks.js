import casual from 'casual';
import RandExp from 'randexp';
import {
    MockList
} from 'graphql-tools';

import InfoGenerator from './InfoGenerator';

const optionTypes = {
    "SpinOption": "spin",
    "ButtonOption": "button",
    "CheckOption": "check",
    "ComboOption": "combo"
}

export {
    InfoGenerator
};

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
        options: () => new MockList([2, 5]),
        uciokay: () => true
    }),
    Option: () => ({
        __typename: casual.random_element(["SpinOption", "ButtonOption", "CheckOption", "ComboOption"]),
        name: casual.title,
        type: function() {
            return optionTypes[this.__typename]
        }
    }),
    SpinOption: () => ({
        value: casual.integer(0, 126),
        min: 0,
        max: 126
    }),
    CheckOption: () => ({
        value: casual.boolean
    }),
    ComboOption: () => ({
        value: casual.random_element(["foo", "bar", "baz"]),
        options: ["foo", "bar", "baz"]
    })
}