export default function authHeader(): HeadersInit | undefined {
  const user = JSON.parse(localStorage.getItem('user')!);
  console.log(user);
  if (user && user.token) {
    return {
      Authorization: user.token,
      'Content-Type': 'application/json',
    };
  } else return {};
}
