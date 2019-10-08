export const registerUserService = (request) => {
  const REGISTER_API_ENDPOINT = 'https://24h.tv/v2/auth/login';
  
  const parameters = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request.user)
  };

  return fetch(REGISTER_API_ENDPOINT, parameters)
    .then(response => {
      return response.json();
    })
    .then(json => {
      return json;
    });
};

export const loginUserService = (request) => {
  const LOGIN_API_ENDPOINT = 'https://24h.tv/v2/auth/login';

  const parameters = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request.user)
  };

  return fetch(LOGIN_API_ENDPOINT, parameters)
    .then(response => {
      return response.json();
    })
    .then(json => {
      return json;
    });
};