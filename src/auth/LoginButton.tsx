const LOGIN_URL = `/oauth2/authorization/gateway-rest-client`;

export function LoginButton() {
  return (
    <a href={LOGIN_URL} className="login-button-grand">
      Login
    </a>
  );
}
