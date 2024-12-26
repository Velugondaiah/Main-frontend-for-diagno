import {Component} from "react"
import Cookies from "js-cookie"
import {Redirect} from "react-router-dom"
import {Link} from "react-router-dom"
import "./UserLogin.css"

class UserLogin extends Component {
  state = {
    username: "",
    password: "",
    errorMsg: "",
    showError: false,
    isLoggedIn: false,
  }

  onChangeUsername = (event) => {
    this.setState({ username: event.target.value })
  }

  onChangePassword = (event) => {
    this.setState({ password: event.target.value })
  }

  onSubmitForm = async (event) => {
    event.preventDefault()
    const {username, password} = this.state

    try {
      const response = await fetch("http://localhost:3008/api/login", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({username, password}),
      })

      const data = await response.json()
      if (response.ok) {
        // Set the JWT token in cookies
        Cookies.set('jwt_token', data.jwtToken, { expires: 30 });
        this.setState({ isLoggedIn: true });
      } else {
        this.setState({
          showError: true,
          errorMsg: data.error || 'Login failed. Please check your credentials and try again.'
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      this.setState({
        showError: true,
        errorMsg: 'Connection error. Please try again.'
      })
    }
  }

  render() {
    const {username, password, showError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    
    if (jwtToken !== undefined) {
      return <Redirect to="/home" />
    }

    return (
      <div className="main-bg-container-for-login">
        <img 
          alt="logo" 
          className="login-image" 
          src="https://res.cloudinary.com/dbroxheos/image/upload/v1727454124/Untitled_design_1_nyltzm.png" 
        />
        <div className="login-container">
          <img 
            alt="logo" 
            className="image" 
            src="https://s3-alpha-sig.figma.com/img/0a45/f19e/7d4eedf4fa33fd9fc0b3c8a0c2a31d0f?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=SkHn~1X7XMdgF1GNThtucOukS4ysGKw0I2E6rRNXtGUtpk8FUk-aW~lRoBZvTIJOQNhssxbZZyEXvjoQhBN7DNu80qIcrkKURF4K2LK9DihnNdOL4yovII2Bs50MLhWTKK-y1VJkpKcO~gfMK6R5xjJVZW3v-lSs45SEopSlXvySZogxLed3d34HNJaK06q8md5gJHSdRujcnGBOgJpQ9416aWiO5hxBcX~Vy1tvoQ4ySqtpECN-eSyTCvyzBdLxUtr06av6JBbD8JL0vaJ8G5zN9CQ-6HZYtdnDl37vAm2qUc-ZhUe~hhxV~Sd~YXTx9EQ7kfidmPFUlCGr1HDRSg__" 
          />
          <h1 className="sign-in-heading">Sign In</h1>
          <form className="form-container" onSubmit={this.onSubmitForm}>
            <div className="container">
              <label className="label" htmlFor="username">Username</label>
              <input 
                value={username} 
                onChange={this.onChangeUsername} 
                placeholder="Enter Username" 
                id="username" 
                type="text" 
                className="input-text" 
                required 
              />
            </div>

            <div className="container">
              <label className="label" htmlFor="password">Password</label>
              <input 
                value={password} 
                onChange={this.onChangePassword}
                placeholder="Enter Password" 
                id="password" 
                type="password" 
                className="input-text" 
                required 
              />
            </div>

            {showError && <p className="error-message">{errorMsg}</p>}
            
            <button className="button-otp" type="submit">Sign In</button>
            <Link to="/signup" className="link">
              <p className="sign-up-heading">Don't have an account? Sign Up</p>
            </Link>
          </form>
        </div>
      </div>
    )
  }
}

export default UserLogin