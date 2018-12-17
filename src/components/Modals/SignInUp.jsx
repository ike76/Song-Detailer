import React, { Component } from "react";
import firebase from "firebase";
import { StyledFirebaseAuth } from "react-firebaseui";
import { Button } from "reactstrap";
//

export class SignInUp extends Component {
  state = {
    isSignedIn: false
  };
  uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: stuff => {
        console.log(stuff);
        return false;
      }
    }
  };
  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(user =>
      this.setState({
        isSignedIn: !!user,
        user
      })
    );
  }
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }
  render() {
    if (!this.state.isSignedIn) {
      return (
        <div>
          <div>
            <h1>My App</h1>
            <p>Please sign-in:</p>
            <StyledFirebaseAuth
              uiConfig={this.uiConfig}
              firebaseAuth={firebase.auth()}
            />
          </div>
        </div>
      );
    }
    return (
      <div>
        <h1>My App</h1>
        <p>
          Welcome {firebase.auth().currentUser.displayName}! You are now
          signed-in!
        </p>
        <Button className="btn-link" onClick={() => firebase.auth().signOut()}>
          Sign-out
        </Button>
      </div>
    );
  }
}

export default SignInUp;
