import React from "react";
import "./Profile.css";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.user.name,
      age: this.props.user.age,
      pet: this.props.user.pet
    };
  }

  onFormChange = event => {
    switch (event.target.name) {
      case "user-name":
        this.setState({ name: event.target.value });
        break;
      case "user-age":
        this.setState({ age: event.target.value });
        break;
      case "user-pet":
        this.setState({ pet: event.target.value });
        break;
      default:
        return;
    }
  };


  onProfileUpdate = (data) => {
    fetch(`http://localhost:3000/profile/${this.props.user.id}`, {
      method: 'post',
      headers: {'Content-Type': 'application/json', Authorization: `${this.props.user.token}`},
      body: JSON.stringify({
        formInput: data,
      })
    }).then(response => {
      this.props.toggleModal();
      this.props.loadUser({...this.props.user, ...data});
    }).catch(console.log);
  }

  render() {
    const { entries, toggleModal } = this.props;
    const { name, age, pet } = this.state;

    return (
      <div className="profile-modal">
        <main className="pa4 bg-white w-50-l shadow-5">
          <div
            className="modal-close flex justify-end dim pointer h2 fw6"
            onClick={toggleModal}
          >
            &times;
          </div>
          <img
            src="https://png.pngtree.com/element_our/md/20180518/md_5aff6089d3e02.png"
            className="br-100 ba h3 w3 dib"
            alt="avatar"
          />
          <h1 className="fw6 mb0"> {name} </h1>
          <h4 className="mt2 mb2"> Images Submitted: {entries} </h4>
          <h6 className="gray fw1"> Member since: January </h6> <hr />
          <label className="db fw6 lh-copy f6" htmlFor="user-name">
            Name:
          </label>
          <input
            onChange={this.onFormChange}
            className="pa2 ba w-100"
            placeholder={name}
            type="text"
            name="user-name"
            id="name"
          />
          <label className="mt2 db fw6 lh-copy f6" htmlFor="user-age">
            Age:
          </label>
          <input
            onChange={this.onFormChange}
            className="pa2 ba w-100"
            placeholder={age}
            type="number"
            name="user-age"
            id="age"
          />
          <label className="mt2 db fw6 lh-copy f6" htmlFor="user-pet">
            Pet:
          </label>
          <input
            onChange={this.onFormChange}
            className="pa2 ba w-100"
            placeholder={pet}
            type="text"
            name="user-pet"
            id="pet"
          />
          <div className="mt4 mb1">
            <button className="b pa2 mr2 grow pointer hover-white w-20 bg-light-blue b--black-20" onClick={() => this.onProfileUpdate({name, age, pet})}>
              Save
            </button>
            
            <button
              className="b pa2 grow pointer hover-white w-20 bg-light-red b--black-20"
              onClick={toggleModal}
            >
              Cancel
            </button>
          </div>
        </main>
      </div>
    );
  }
}

export default Profile;
