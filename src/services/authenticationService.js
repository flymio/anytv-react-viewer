export const registerUserService = (request) => {
  const REGISTER_API_ENDPOINT = process.env.REACT_APP_API_URL+'/v2/users';
  const LOGIN_API_ENDPOINT = process.env.REACT_APP_API_URL + '/v2/auth/login';

  const parameters = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request.user)
  };

  console.log(request);

  const parameters_login = {
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
    }).then(function (result) {
      return fetch(LOGIN_API_ENDPOINT, parameters_login)
        .then(response => {
          return response.json();
        })
        .then(json => {
          return json;
        });
    });
};

export const loginUserService = (request) => {
  const LOGIN_API_ENDPOINT = process.env.REACT_APP_API_URL + '/v2/auth/login';

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