* These tests require a running ChessQ GraphQL service on port 3001

To simplify testing, you can assign a mock UUID as an environment variable that the server will you for all createEngine requests:
  MOCK_UUID=1 npm run start