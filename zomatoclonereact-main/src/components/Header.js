import '../style/Header.css';
import Logo from './Logo';
import AppNavbar from './AppNavbar';
import HeaderTypeahead from './HeaderTypeahead';
import backgroundimg from '../images/background.jpg';

function Header(){
    
    return (
        <div className='headerContainer'>
            <img src={backgroundimg} alt="not found"/>
            <AppNavbar className='navBar' page='landingPage'/> 
            <Logo/> 
            <div className='navHeading'>Find the best restaurants, cafés, and bars</div> 
            <HeaderTypeahead/>           
        </div>
    );
}

export default Header;