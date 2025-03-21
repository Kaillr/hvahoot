export default function LoginPage() {
    return (
      <>
        <h1>Login</h1>
        <form>
          <input type="email" placeholder="Email address" />
          <br />
          <input type="password" placeholder="Password" />
          <br />
          <button type="submit">Login</button>
        </form>
      </>
    );
  }