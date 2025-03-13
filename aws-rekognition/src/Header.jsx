
import logoImage from "./assets/face-logo.jpeg";
const Header = () => {
  return (
    <header>
      <div id="header-inner-container">
        <h1>Celebrity Face Identifier</h1>
        <img src={logoImage} alt="face-logo"></img>
      </div>
    </header>
  )
};

export default Header;         
