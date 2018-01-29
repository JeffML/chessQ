import casual from 'casual';
import RandExp from 'randexp';
import {MockList} from 'graphql-tools';

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
    }
  })
}
