* These tests require a running ChessQ GraphQL service on port 3001

To simplify testing, these tests use a mock UUID of 1 for the engine, set when starting the ChessQ server using an environent variable:
  MOCK_UUID=1 npm run start